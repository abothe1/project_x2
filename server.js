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

// display index
router.get('/', (_req, res) => res.render('_index.html'));
router.get('/index', (_req, res) => res.render('_index.html'));

function upload(ending) {
	return multer({ dest: STATIC_DIR + '/' + ending });
}

function login_needed(error_message) {
	return (req, res, next) => {
		// if we aren't logged in, send 'Unauthorized' back to client
		if (!req.session.key || !req.session.key.username) {
			console.info(`User from '${req.ip}' `+ error_message);
			res.status(401).send('Not logged in').end();
		} else {
			// otherwise, continue
			next();
		}
	}
}

router.post('/upload/avatar',
	// being logged in is required to upload an avatar
	login_needed('Tried to upload an avatar whilst not logged in'),
	upload('avatars').single('avatar'),
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

			avatars.deleteMany({ user_id: id }, (err, _obj) => {
				if (err) {
					console.error(`Couldn't delete avatar with user id ${id}: ${err}`);
					res.status(500).end()
					db.close()
				} else {
					avatars.insertOne({ user_id: id, file: filename }, (err, _res) => {
						if (err) {
							console.error(`Couldn't insert avatar with user id ${id}, filename ${filename}: ${err}`)
							res.status(500).end()
						} else {
							console.log(JSON.stringify(_res));
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







