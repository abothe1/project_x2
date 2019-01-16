'use strict'

module.exports = router => {

const database = require('../libs/database.js'),
      logging = require('../libs/logging.js'),
      { requireLoggedIn, extractRequiredFields } = require('./util.js');

function extractRequiredBandFields(req, res, err=true) {
	const requiredFields = ['name', 'genres', 'vibes', 'instruments', 'gigTypes'];
	if (!requireLoggedIn(req, res))
		return false;
	return extractRequiredFields(req.body, res, requiredFields, err);
}

router.post('/bands', (req, res) => {
	var band = extractRequiredBandFields(req, res);
	if (!band)
		return; // error was already handled within the function

	database.connect(db => {
		let bands = db.db('bands').collection('bands');
		bands.insertOne(band, (err, res) => {
			if (err) {
				logger.error('[bands][database] Database connection for band creation failed', { band: band, err: err });
				res.status(500).end()
			} else {
				logger.verbose('[bands] Created band', { id: band._id, name: band.name })
				res.status(200).json({ success: true }).end()
			}
		})
	}, err => {
		logger.error('[bands][database] Database connection whilst adding a band failed');
		res.status(500).end()
	});
});

router.route('/bands/:id')
	.get((req, res) => {
		database.connect(db => {
			db.db('bands').collection('bands').findOne({ _id: database.objectId(req.params.id) }, (err, band) => {
				if (err) {
					logger.error('[bands][database] Database connection for band lookup failed', { id: req.params.id, err: err });
					res.status(500).end()
				} else if (!band) {
					res.status(404).end()
				} else {
					res.status(200).json(band).end()
				}
			})
		}, err => {
			logger.error('[bands][database] Database connection whilst adding a band failed');
			res.status(500).end()
		})
	})
	.put((req, res) => {
		database.connect(db => {
			var query = { _id: database.objectId(req.params.id), owner: req.sesion.key };
			var newBand = extractRequiredBandFields(req, res, false);
			if (!newBand)
				return; // error was already handled within the function


			db.db('bands').collection('bands').findOne(query, {$set: newBand}, (err, band) => {
				if (err) {
					logger.error('[bands][database] Database connection for band update lookup failed', { query: query, err: err });
					res.status(500).end()
				} else if (!band) {
					res.status(404).send("Either band wasn't found or non-owned requested it").end()
				} else {
					res.status(200).json({ success: true }).end()
				}
			})
		}, err => {
			logger.error('[bands][database] Database connection whilst updating a band failed');
			res.status(500).end()
		});
	})
	.delete((req, res) => {
		if (!requireLoggedIn(req, res))
			return;
		database.connect(db => {
			var query = { _id: database.objectId(req.params.id), owner: req.sesion.key };

			db.db('bands').collection('bands').deleteOne(query, (err, result) => {
				if (err) {
					logger.error('[bands][database] Database connection for band deletion failed', {query: query, err: err})
					res.status(500).end()
				} else if (!band) {
					res.status(404).send("Either band wasn't found or non-owned requested it").end();
				} else {
					res.status(200).json({ success: true }).end();
				}
			})
		}, err => {
			logger.error('[bands][database] Database connection whilst updating a band failed');
			res.status(500).end()
		});
	});





} /* end module.exports */