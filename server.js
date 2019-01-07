// `express` is used to serve up webpages
// `redis` is used to store user sessions
// `mongodb` is used to store more heavy-duty objects

const EXPRESS_APP_PORT = 80,
      PUBLIC_DIR = 'public',
      STATIC_DIR = 'static',
      REDIS_HOST = 'localhost'
      REDIS_PORT = 6379;

// and if so, should i put them in another file? since the `UPLOADS` things are only used in `auth/upload.js`, but needs `STATIC_DIR`. I don’t wanna pass every constant to every 

const express = require('express'),
      redis = require("redis"),
      session = require('express-session'),
      redis_store = require('connect-redis')(session),
      body_parser = require('body-parser'),
      cookie_parser = require('cookie-parser');

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
	// cookie: { secure: true, maxAge: 86400000 }
}));

console.info("figure out why cookies aren't working");

// not sure what these do
app.use(cookie_parser("lol my secret $c5%ookie parser 0nu@mber thingy 12038!@"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

/** ROUTES **/

// Make statics readable
app.use(express.static(STATIC_DIR));

// create the router
var router = express.Router();

// display index
router.get('/', (_, res) => res.redirect('/index'));
router.get('/index', (_, res) => { res.render('index.html'); });

require('./routes/auth.js')(router, app); // login, register, logout
require('./routes/upload.js')(router, app);

// startup the server
app.use('/', router);
app.listen(80, () => console.info('Express started on port 80'));










