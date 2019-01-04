module.exports = router => {
database = require('../database.js');

// temporary routes for testing
router.get('/_register', (_, res) => res.render('_register.html'));
router.get('/_login', (_, res) => res.render('_login.html'));
router.get('/_logout', (_, res) => res.render('_logout.html'));

/** login and validation stuff **/

function validate_password(password) {
	console.log("TODO: validate password");
	return true;
}

function hash_password(password) {
	console.log('TODO: hash password');
	return password;
}

router.post('/register', (req, res) => {
	if (req.session.key) {
		console.info(`User ${req.session.key} from ${req.ip} attempted to register whilst logged in`);
		return res.status(403).send('Already logged in').end();
	}

	var {username, email, password} = req.body;

	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	} else if (!email) {
		return res.status(400).send('No email supplied')
	}

	if (!validate_password(password)) {
		return res.status(200).json({ success: false, cause: 'Too weak of a password supplied'})
	}

	password = hash_password(password);

	database.connect(db => {
		var users = db.db('users').collection('users');
		users.findOne({ $or: [{email: email}, {username: username}]}, (err, obj) => {
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
						res.status(200).json({ success: true }).end();
					}
				});
			}
		})
	});
})

router.post('/login', (req, res) => { 
	if (req.session.key) {
		console.info(`User ${req.session.key} from ${req.ip} attempted to login whilst logged in`);
		return res.status(402).send('Already logged in').end();
	}

	var {username, password} = req.body;

	if (!username) {
		return res.status(400).send('No username supplied')
	} else if (!password) {
		return res.status(400).send('No password supplied')
	}

	password = hash_password(password);

	database.connect(db => {
		db.db('users').collection('users').findOne({ username: username, password: password }, (err, obj) => {
			if (err) {
				console.error(`Login request from ${req.ip} (for ${username}) returned error: ${err}`)
				res.status(500).end()
			} else if (!obj) {
				res.status(400).send('Invalid Credentials').end()
			} else {
				req.session.key = obj._id;
				res.status(200).json({ success: true }).end()
			}
		})
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