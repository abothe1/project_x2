// `express` is used to serve up webpages
// `redis` is used to store user sessions
// `mongodb` is used to store more heavy-duty objects

const EXPRESS_APP_PORT = 80,
      PUBLIC_DIR = 'public',
      STATIC_DIR = 'static',

const express = require('express'),
      redis = require("redis"),
      session = require('express-session'),
      redis_store = require('connect-redis')(session),
      body_parser = require('body-parser'),
      cookie_parser = require('cookie-parser'),
      multer = require('multer');
      
const database = require('./database'),
      users = require('./users');

var upload = multer({ dest: STATIC_DIR });
var client = redis.createClient();
var app = express();
var router = express.Router();

app.set('views', PUBLIC_DIR);
app.use('/static', express.static(STATIC_DIR));
app.engine('html', require('ejs').renderFile);

// this is how sessions are handled
app.use(session({
		secret: 'secret password here ;p',
		store: new redis_store({ // store sessions with redis
			host: 'localhost',
			port: 6379,
			client: client,
			ttl: 260
		}),
		saveUninitialized: false,
		resave: false,
		cookie: {
			secure: true, 
			axAge: 86400000
		}
}));

// not sure what these do
app.use(cookie_parser("lol my secret $c5%ookie parser 0nu@mber thingy 12038!@"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

/** These are the different paths **/

/*

router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
});

router.route('/foo')
	.get((req, res) = { ... })
	.post((req, res) = { ... })
	.put((req, res) = { ... })

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})
 
app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

*/


router.post('/upload/avatar', upload.single('avatar'), (req, res) => {
	res.json({ id: req.file.username });
	res.status(201).end()
});
	// .get( (req, res) => res.render('a') )

// function(req, res) {
//     res.statusMessage = "Current password does not match";
//     res.status(400).end();
// }

router.route('/_post_image')
	.get((_, res) => res.render('_post_image.html'))
	.post(upload.single('image-file'), (req, res) => {
		res.json({ id: req.file.filename })
		res.status(200).end()
	});

// router.get('/_post_image/:id', (req, res) => {
// 
// });

// redirect `/` to `/index`, unless we're logged in
router.get('/', (req, res) => { //(_, res) => res.render('index.html'));
	console.log(JSON.stringify(req.session));
	if (req.session.key) {
		res.redirect('/home')
	} else {
		res.redirect('/index')
	}
})

router.get('/index', (_req, res) => res.render('index.html'));

router.get('/home', (req, res) => {
	if (req.session.key) { // if logged in, display home
		res.render('home.html', { username : req.session.key['username'] });
		res.render('home.html', { session: req.session.key });
	} else {
		res.redirect('/'); // otherwise, show base page
	}
});

router.get('/register', (req, res) => {
	if (req.session.key) { // if logged in, redirect home
		res.redirect('/home')
	} else {
		res.render('register.html')
	}
});

router.get('/login', (req, res) => {
	console.log(JSON.stringify(req.session.key));
	if (req.session.key) { // if logged in, redirect to home
		res.redirect('/home')
	} else {
		res.render('_login.html')
	}
});

router.get('/logout', (req, res) => {
	if(req.session.key) {
		req.session.destroy(() => res.redirect('/'))
	} else {
		res.json({ success: false, cause: 'Not logged in' })
    	res.redirect('/');
    }
})

router.get('/search', (req, res) => {

})
router.get('/search', (req, res) => {
	var query = req.query.query;
	if (!query) {
		return res.json({ success: false, cause: "No query provided" });
	}

	res.json({ success: true, result: "hi '" + query + "'" });

});


router.get('/__get_statuses', (req, res) => {
	if (!req.session.key) {
		res.json({ success: false, cause: 'Not logged in' });
	} else {
		var username = req.session.key.username;
		require('./database').connect(db => {
			db.db('users').collection('__statuses').find({ username: username }).toArray((err, result) => {
				if(err) {
					res.json({ success: false, cause: `error with getting status: ${err}`})
				} else {
					res.json({ success: true, statuses: result })
				}
				db.close();
			})
		}, err => res.json({ success: false, cause: `db error: ${err}`}))
	}
})

router.post('/__add_status', (req, res) => {
	if (!req.session.key) {
		res.json({ success: false, cause: 'Not logged in' });
	} else {
		var username = req.session.key.username;

		require('./database').connect(db => {
			db.db('users').collection('__statuses').insertOne({ username: username, status: req.body.status }, (err, result) => {
				if(err) {
					res.json({ success: false, cause: `error with inserting status: ${err}`})
				} else {
					res.json({ success: true})
				}
				db.close();
			})
		}, err => res.json({ success: false, cause: `db error: ${err}`}))
	}
})

router.post('/login', users.login)
router.post('/register', users.register)
router.post('/logout', users.logout)

app.use('/', router);
app.listen(80, () => console.info('Express started on port 80'));
