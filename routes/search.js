module.exports = router => {

const database = require('../database.js'),
      matching = require('../algs/matching.js');

router.get('/search', (req, res) => {
	var { query, mode, bandName, gigName } = req.query;

	if (!query) {
		return res.status(400).send('No query supplied').end();
	} else if (!mode) {
		return res.status(400).send('No mode supplied').end();
	}

	switch (mode) {
		case 'findGigs':
			database.connect(db => {
				matching.findGigsForBand(bandName, query, db, err => {
					console.error("Error when finding gigs for " + bandName + ": " + err);
					res.status(500).end();
				}, data => {
					res.status(200).json({ success: true, data: data });
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
			})
			break;
		case 'findBands':
			database.connect(db => {
				matching.findBandsForGig(gigName, query, db, err => {
					console.error("Error when finding bands for " + gigName + ": " + err);
					res.status(500).end();
				}, data => {
					res.status(200).json({ success: true, data: data });
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
			});
			break;
		default:
			res.status(400).send("Invalid mode: " + mode).end()
	}
});

}