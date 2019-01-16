'use strict'

module.exports = router => {

const database = require('../libs/database.js'),
      logging = require('../libs/logging.js'),
      { requireLoggedIn, extractRequiredFields } = require('./util.js');

function extractRequiredGigFields(req, res, err=true) {
	const requiredFields = ['name', 'location', 'genres', 'vibes', 'instruments', 'gigTypes', 'startDate', 'endDate'];
	if (!requireLoggedIn(req, res))
		return false;
	return extractRequiredFields(req.body, res, requiredFields, err);
}

router.post('/gigs', (req, res) => {
	var gig = extractRequiredGigFields(req, res);
	if (!gig)
		return; // error was already handled within the function

	database.connect(db => {
		let gigs = db.db('gigs').collection('gigs');
		gigs.insertOne(gig, (err, res) => {
			if (err) {
				logger.error('[gigs][database] Database connection for gig creation failed', { gig: gig, err: err });
				res.status(500).end()
			} else {
				logger.verbose('[gigs] Created gig', { id: gig._id, name: gig.name })
				res.status(200).json({ success: true }).end()
			}
		})
	}, err => {
		logger.error('[gigs][database] Database connection whilst adding a gig failed');
		res.status(500).end()
	});
});

router.route('/gigs/:id')
	.get((req, res) => {
		database.connect(db => {
			db.db('gigs').collection('gigs').findOne({ _id: database.objectId(req.params.id) }, (err, gig) => {
				if (err) {
					logger.error('[gigs][database] Database connection for gig lookup failed', { id: req.params.id, err: err });
					res.status(500).end()
				} else if (!gig) {
					res.status(404).end()
				} else {
					res.status(200).json(gig).end()
				}
			})
		}, err => {
			logger.error('[gigs][database] Database connection whilst adding a gig failed');
			res.status(500).end()
		})
	})
	.put((req, res) => {
		database.connect(db => {
			var query = { _id: database.objectId(req.params.id), owner: req.sesion.key };
			var newGig = extractRequiredGigFields(req, res, false);
			if (!newGig)
				return; // error was already handled within the function


			db.db('gigs').collection('gigs').findOne(query, {$set: newGig}, (err, gig) => {
				if (err) {
					logger.error('[gigs][database] Database connection for gig update lookup failed', { query: query, err: err });
					res.status(500).end()
				} else if (!gig) {
					res.status(404).send("Either gig wasn't found or non-owned requested it").end()
				} else {
					res.status(200).json({ success: true }).end()
				}
			})
		}, err => {
			logger.error('[gigs][database] Database connection whilst updating a gig failed');
			res.status(500).end()
		});
	})
	.delete((req, res) => {
		if (!requireLoggedIn(req, res))
			return;
		database.connect(db => {
			var query = { _id: database.objectId(req.params.id), owner: req.sesion.key };

			db.db('gigs').collection('gigs').deleteOne(query, (err, result) => {
				if (err) {
					logger.error('[gigs][database] Database connection for gig deletion failed', {query: query, err: err})
					res.status(500).end()
				} else if (!gig) {
					res.status(404).send("Either gig wasn't found or non-owned requested it").end();
				} else {
					res.status(200).json({ success: true }).end();
				}
			})
		}, err => {
			logger.error('[gigs][database] Database connection whilst updating a gig failed');
			res.status(500).end()
		});
	});





} /* end module.exports */