// `express` is used to serve up webpages
// `redis` is used to store user sessions
// `mongodb` is used to store more heavy-duty objects

const EXPRESS_APP_PORT = 80,
      PUBLIC_DIR = 'public',
      STATIC_DIR = 'static',
      REDIS_HOST = 'localhost'
      REDIS_PORT = 6379;

const express = require('express'),
      redis = require("redis"),
      session = require('express-session'),
      redis_store = require('connect-redis')(session),
      body_parser = require('body-parser'),
      cookie_parser = require('cookie-parser'),
      multer = require('multer');
      
const database = require('./database'),
      users = require('./users');

// TODO: look into `res.cookie` (https://expressjs.com/en/4x/api.html#res.cookie)

// var upload = multer({
// 	storage: multer.diskStorage({
// 		destination: (req, file, cb) => {
// 			cb(null, 'static/' + file.fieldname)
// 			// console.log(file);
// 			// throw;
// 		}
// 	})
// });
var client = redis.createClient();
var app = express();

app.set('views', PUBLIC_DIR);
app.engine('html', require('ejs').renderFile);

// this is how sessions are handled
app.use(session({
	secret: 'secret password here ;p',
	store: new redis_store({ // store sessions with redis
		host: REDIS_HOST,
		port: REDIS_PORT,
		client: client,
		ttl: 260
	}),
	saveUninitialized: false,
	resave: false,
	cookie: { secure: true, maxAge: 86400000 }
}));

// not sure what these do
app.use(cookie_parser("lol my secret $c5%ookie parser 0nu@mber thingy 12038!@"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

/** ROUTES **/

// Make statics readable. e.g. `/static/avatar/...` 
app.use('/static', express.static(STATIC_DIR));

// create the router
var router = express.Router();

// temporary routes for testing
router.get('/_register', (_, res) => res.render('_register.html'));
router.get('/_login', (_, res) => res.render('_login.html'));
router.get('/_logout', (_, res) => res.render('_logout.html'));


// display index
router.get('/', (_req, res) => res.render('index.html'));
router.get('/index', (_req, res) => res.render('index.html'));


/** login and validation stuff **/

router.post('/register', (req, res) => {
	if (req.session.key) {
		if (!req.sesion.key.id) {
			console.warn(`User from ${req.ip} has a session, but has no id; deleting their session`);
			delete req.session.key;
		} else {
			console.info(`User ${req.session.key.id} from ${req.ip} attempted to register, whilst logged in`);
			return res.status(403).send('Already logged in').end();
		}
	}

	var {username, email, password} = req.body;

	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	} else if (!email) {
		return res.status(400).send('No email supplied')
	}

	password = /* hash password */ password;
	console.warn('TODO: HASH PASSWORDS [register]!');

	database.connect(db => {
		var users = db.db('users').collection('users');
		users.findOne({ email: email, username: username }, (err, obj) => {
			if (err) {
				console.error(`User find request from ${req.ip} (for ${username}) returned error: ${err}`)
				res.status(500).end()
			} else if (obj) {
				res.status(400).send('Username or email already exists').end()
			} else {
				users.insertOne({ email: email, username: username, password: password }, (err, obj) => {
					if (err) {
						console.error(`Register request from ${req.ip} (for ${username}, ${email}, ${password}) returned error: ${err}`);
						res.status(500).end();
					} else {
						res.status(200).end();
					}
				});
			}
		})
	});
})


router.post('/login', (req, res) => { 
	if (req.session.key) {
		if (!req.sesion.key.id) {
			console.warn(`User from ${req.ip} has a session, but has no id; deleting their session`);
			delete req.session.key;
		} else {
			console.info(`User ${req.session.key.id} from ${req.ip} attempted to login, whilst logged in`);
			return res.status(403).send('Already logged in').end();
		}
	}

	var {username, password} = req.body;

	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	} 

	console.warn('TODO: HASH PASSWORDS [login]!');

	password = /* hashed password */ password;

	database.connect(db => {
		db.db('users').collection('users').findOne({ username: username, password: password }, (err, obj) => {
			if (err) {
				console.error(`Login request from ${req.ip} (for ${username}) returned error: ${err}`)
				res.status(500).end()
			} else if (!obj) {
				res.status(400).send('Invalid Credentials').end()
			} else {
				req.session.key = { id: obj._id };
				res.status(200).end()
			}
		})
	});
});

router.get('/logout', (req, res) => {
	if(req.session.key) {
		req.session.destroy(() => res.status(204).end())
	} else {
		res.status(403).send('Not logged in').end()
    }
});


// this is used for uploading to specific static places, e.g. `avatars` or `soundbytes`
function upload(ending) {
	return multer({ dest: STATIC_DIR + '/' + ending });
}

// require the user to be logged in, or return an error message
function login_needed(error_message) {
	return (req, res, next) => {
		// if we aren't logged in, send 'Unauthorized' back to client
		if (!req.session.key || !req.session.key.id) {
			console.info(`User from ${req.ip} `+ error_message);
			res.status(401).send('Not logged in').end();
		} else {
			// otherwise, continue
			next();
		}
	}
}

/** AVATAR UPLOADING **/

// get the avatar for a specific user--this can also be done thru `/static/avatar/<avatar filename>`
router.get('/users/:id/avatar', (req, res) => {
	database.connect(db => {
		var avatars = db.db('users').collection('avatars');
		avatars.findOne({ owner: req.params.id }, (err, obj) => {
			if (err) {
				console.error(`Avatar request ${req.url} (from ${req.ip}) caused an error: ${err}`);
				res.status(500).end()
			} else if (obj === null) {
				res.status(404).end()
			} else {
				res.redirect('/static/avatar/' + obj.filename)
			}
		})
	})
});

// upload an avatar, you need to be logged in to do it.
router.post('/upload/avatar',
	// being logged in is required to upload an avatar
	login_needed('tried to upload an avatar whilst not logged in'),
	// allow the user to upload a single avatar
	upload('avatars').single('avatar'),
	// actual login script
	(req, res) => {
		console.log(`[${req.ip}] File uploaded: ` + req.file.path);

		var id = req.session.key && req.session.key.id;
		var filename = req.file.filename;

		if (!id) {
			console.error("User wasn't logged in, but got past `login_needed`");
			return res.status(500).end();
		}

		database.connect(db => {
			var avatars = db.db('users').collection('avatars');

			avatars.deleteMany({ owner: id }, (err, _obj) => {
				if (err) {
					console.error(`Couldn't delete avatar with user id ${id}: ${err}`);
					res.status(500).end()
					db.close()
				} else {
					avatars.insertOne({ filename: filename, owner: id }, (err, _result) => {
						if (err) {
							console.error(`Couldn't insert avatar with owner '${id}', filename '${filename}': ${err}`)
							res.status(500).end()
						} else {
							console.log(JSON.stringify(_result));
							res.status(201).json({ username: username }).end()
						}
						db.close()
					})
				}
			})
		}, err => {
			console.error(`Error with connecting to databse: ${err}`);
			res.status(500).end();
		})
	}
);




// startup the server
app.use('/', router);
app.listen(80, () => console.info('Express started on port 80'));














