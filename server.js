/*************************************************************************
 *
 * BANDA CONFIDENTIAL
 * __________________
 *
 *  Copyright (C) 2019
 *  Banda Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Banda Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Banda Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Banda Incorporated.
 *
*************************************************************************/

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
      redisStore = require('connect-redis')(session),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');

var client = redis.createClient();
var app = express();

app.set('views', PUBLIC_DIR);
app.engine('html', require('ejs').renderFile);

// this is how sessions are handled
app.use(session({
	secret: 'secret password here ;p',
	store: new redisStore({ // store sessions with redis
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
app.use(cookieParser("lol my secret $c5%ookie parser 0nu@mber thingy 12038!@"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.listen(EXPRESS_APP_PORT, () => console.info('Express started on port ' + EXPRESS_APP_PORT));
