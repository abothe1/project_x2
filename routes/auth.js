module.exports = router => {

const database = require('../libs/database.js'),
      logger = require('../libs/logging.js'),
      emailValidator = require('email-validator'),
      usernamePasswordValidator = require('password-validator'),
      { requireLoggedIn, requireNotLoggedIn, extractRequiredFields } = require('./util.js');

var passwordValidator = new usernamePasswordValidator();
passwordValidator
	.is().min(8)
	.is().max(100)
	.is().not().oneOf([/.*p[a4][5s][5s]sw[o0][2r]d.*/i]);

var usernameValidator = new usernamePasswordValidator();
usernameValidator
	.is().min(4)
	.is().max(15)
	.has().not().symbols()
	.has().not().spaces()
	.is().not().oneOf([/(admin|staff)|.*/i]);

// temporary routes for testing
router.get('/register', (_, res) => res.redirect('_register'));
router.get('/login', (_, res) => res.redirect('_login'));
router.get('/logout', (_, res) => res.redirect('_logout'));
router.get('/_register', (_, res) => res.render('_register.html'));
router.get('/_login', (_, res) => res.render('_login.html'));
router.get('/_logout', (_, res) => res.render('_logout.html'));

function hashPassword(password) {
	console.log('TODO: hash password');
	return '<HASH:' + password + '>';
}

router.post('/register', (req, res) => {
	if (!requireNotLoggedIn(req, res))
		return;

	var user = extractRequiredFields(req.body, res, ['username', 'password', 'email']);
	if (!user)
		return;

	var {username, email, password} = user;

	if (process.env.NODE_ENV === 'production') {
		if (!usernameValidator.validate(username)){
			return res.status(200).json({ success: false, cause: 'Invalid email' });
		} if (!emailValidator.validate(email)){
			return res.status(200).json({ success: false, cause: 'Invalid email' });
		} else if (!passwordValidator.validate(password)) {
			return res.status(200).json({ success: false, cause: 'Too weak of a password'});
		}
	} else {
		logger.info('Not running in production, so not validating username/email/password');
	}

	password = hashPassword(password);

	database.connect(db => {
		var users = db.db('users').collection('users');
		users.findOne({$or: [{email: email}, {username: username}]}, (err, obj) => {
			console.log('a');
			if (err) {
				logger.error('[auth][database] Database connection for user existence failed', { username: username, email: email, err: err });
				res.status(500).end()
			} else if (obj) {
				logger.verbose('[auth] Registration failed because the username or email already exists', { username: username, email: email });
				res.status(200).json({ success: false, cause: 'Username or email already exists' }).end()
			} else {
				var user = { email: email, username: username, password: password, creation: new Date() };
				users.insertOne(user, (err, obj) => {
					if (err) {
						logger.error('[auth][database] Creation of a new user failed', { username: username, email: email, err: err });
						res.status(500).end();
					} else {
						logger.verbose('[auth] User successfully registered', user);
						res.status(200).json({ success: true }).end();
					}
				});
			}
		})
	}, err => {
		logger.error('[auth][database] Database connection whilst registering failed');
		res.status(500).end()
	});
})

router.post('/login', (req, res) => { 
	if (!requireNotLoggedIn(req, res))
		return;

	var user = extractRequiredFields(req.body, res, ['username', 'password']);
	if (!user)
		return;

	var {username, password} = req.body;

	password = hashPassword(password);

	database.connect(db => {
		db.db('users').collection('users').findOne({ username: username, password: password }, (err, user) => {
			if (err) {
				logger.error('[auth][database] Database connection for login faild', { username: username, err: err });
				res.status(500).end()
			} else if (!user) {
				logger.silly('[auth] Login failed because of invalid credentials', { username: username });
				res.status(400).send('Invalid Credentials').end()
			} else {
				// console.log(JSON.stringify(user));
				logger.silly('[auth] User logged in successfully', { username: username });
				req.session.key = user._id;
				res.status(200).json({ success: true }).end()
			}
		})
	}, err => {
		logger.error('[auth][database] Database connection whilst logging in failed');
		res.status(500).end()
	});
});

router.get('/logout', (req, res) => {
	if (!requireLoggedIn(req, res))
		return;

	logger.silly('[auth] User logged out', { id: req.session.key });
	req.session.destroy(() => res.status(200).json({ success: true }).end())
});

} /* end module.exports */