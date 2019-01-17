module.exports = router => {

const database = require('../libs/database.js'),
      logging = require('../libs/logging.js');

router.get('/', (req, res) => {
	var id = req.session.key
	if (id) {
		database.usernameFromId(id, username => {
			res.render('index.html', {username: username})
		}, err => {
			logger.warn("[index][db] Username find request returned an error", { id: id, err: err })
			res.status(500).end();
		}, () => {
			logger.debug("[index][db] Username find request couldn't find a username", { id: id })
			res.status(500).end();			
		})
	} else {
		res.render('index.html', { username: undefined })
	}
});

router.get('/index', (_, res) => res.redirect('/'));

}