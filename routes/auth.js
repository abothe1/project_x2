module.exports = router => {
database = require('../database.js');

// temporary routes for testing
/*
router.get('/register', (_, res) => res.redirect('_register'));
router.get('/login', (_, res) => res.redirect('_login'));
router.get('/logout', (_, res) => res.redirect('_logout'));
router.get('/_register', (_, res) => res.render('_register.html'));
router.get('/_login', (_, res) => res.render('_login.html'));
router.get('/_logout', (_, res) => res.render('_logout.html'));
*/
/** login and validation stuff **/

function validatePassword(password) {
	console.log("TODO: validate password");
	return true;
}

function hashPassword(password) {
	console.log('TODO: hash password');
	return password;
}

router.post('/register', (req, res) => {
	console.log("GOT INTO Register");
	if (req.session.key) {
		console.info(`User ${req.session.key} from ${req.ip} attempted to register whilst logged in`);
		return res.status(403).send('Already logged in').end();
	}

	var {username, email, password} = req.body;
	console.log("GOT user name, email and passowrd they are: " + username + " " + email + " " + password);

	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	} else if (!email) {
		return res.status(400).send('No email supplied')
	}

	if (!validatePassword(password)) {
		return res.status(200).json({ success: false, cause: 'Too weak of a password supplied'})
	}

	password = hashPassword(password);

	database.connect(db => {
		var users = db.db('users').collection('users');
		users.findOne({ $or: [{email: email}, {username: username}]}, (err, obj) => {
			if (err) {
				console.error(`User find request from ${req.ip} (for ${username}) returned error: ${err}`)
				res.status(500).end()
			} else if (obj) {
				res.status(400).send('Username or email already exists').end()
			} else {
				users.insertOne({ email: email, username: username, password: password, contacts:[]}, (err, obj) => {
					if (err) {
						console.error(`Register request from ${req.ip} (for ${username}, ${email}, ${password}) returned error: ${err}`);
						res.status(500).end();
					} else {
						//booth code, testing how to store usernames in sessions//
						req.session.key = username;
						///////
						res.status(200).json({ success: true }).end();
					}
				});
			}
		})
	}, err => {
		console.warn("Couldn't connect to database: " + err)
		res.status(500).end()
	});
})

router.post('/login', (req, res) => {
	console.log("IN LOGIN On Router Page");
	if (req.session.key) {
		console.info(`User ${req.session.key} from ${req.ip} attempted to login whilst logged in`);
		return res.status(402).send('Already logged in').end();
	}

	var {username, password} = req.body;
	console.log("////////////////////////////////////////////////////////////////////////////////////");
	console.log("GOt username it is : " + username);
	console.log(" ");
	console.log("////////////////////////////////////////////////////////////////////////////////////");
	console.log("GOt password it is : " + password);
	console.log(" ");
	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	}

	password = hashPassword(password);

	database.connect(db => {
		console.log("Got in database connect");
		db.db('users').collection('users').findOne({ 'username': username, 'password': password }, (err, obj) => {
			console.log("Got in find one");
			console.log(JSON.stringify(obj));
			if (err) {
				console.error(`Login request from ${req.ip} (for ${username}) returned error: ${err}`)
				res.status(500).end()
			} else if (!obj) {
				res.status(400).send('Invalid Credentials').end()
				console.log("INVALID CREDS SENT");
			} else {
				console.log("////////////////////////////////////////////////////////////////////////////////////");
				req.session.key = username;
				console.log('In the login, just made the session key from obj key and it is: ' + req.session.key);
				res.status(200).json({ success: true }).end()
			}
		})
	}, err => {
		console.warn("Couldn't connect to database: " + err)
		res.status(500).end()
	});
});

router.get('/logout', (req, res) => {
	if(req.session.key) {
		req.session.destroy(() => res.status(200).json({ success: true }).end())
	} else {
		res.status(402).send('Not logged in').end()
    }
});

} /* end module.exports */
