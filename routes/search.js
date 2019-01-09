module.exports = router => {

const database = require('../database.js'),
      matching = require('../algs/matching.js');

router.get('/search', (req, res) => {
	var { query, mode, bandName, gigName } = req.query;

	// search text
	// mode
	// band
	// gig

	if (!query || !mode) {
		/* error */
	}



	if (mode == 'band to gig') {
		matching.findGigsForBand(bandName, query, err => {
			// ...
		}, ok => {
			// ...
		});
	}
	// // ignore from here down
	// 	database.connect(db => {
	// 		var bands = db.db('bands').collection('bands');

	// 		bands.findOne({ name: bandName }, (err, band) => {
	// 			if (err) {
	// 				console.error(`User find request from ${req.ip} (for ${username}) returned error: ${err}`)
	// 				res.status(500).end()
	// 			} else if (!band) {
	// 				res.status(400).send('Username or email already exists').end()
	// 			} else {
	// 				var gigs = /* ... */;
	// 				res.json(matching.find_gigs_for_band(band, gigs, query)).end();
	// 			}
	// 		})
	// 	});
	// }
});

}