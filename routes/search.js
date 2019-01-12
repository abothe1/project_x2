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

router.post('/gig', (req, res) => {
  console.log(req.body);
  console.log("got into post gigs on router")
	var gig = req.body;
	if (!gig) {
		 res.status(400).send('No body sent').end();
	}
  gig['isFilled']=false;
  gig['banndFor']='none';
	console.log("Received body for gig: " + req.body['name']);

	database.connect(db => {
		let gigs = db.db('gigs').collection('gigs');
		gigs.insertOne(gig, (err, result) => {
			if (err){
				console.warn("Couldnt get insert gig into database: " + err);
				res.status(500).end();
				db.close();
			} else {
				console.log("gig inserted");
				res.status(200).end();
				db.close();
			}
		});
	}, err => {
		console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
	});
});

router.get('/current_events', (req, res) => {
  database.connect(db => {
    let gigDB = db.db('gigs').collection('gigs');
    gigDB.find({'isFilled':{$eq: true}}).toArray(function(err, result) {
      if (err){
        console.warn("Couldnt get insert gig into database: " + err);
        res.status(500).end();
        db.close();
      }
      else{
        console.log(result);
        res.status(200).send(result);
        db.close();
      }
    });
  }, err => {
    console.warn("Couldn't connect to database: " + err)
		res.status(500).end()
  });
});

router.post('/band', (req, res) => {
	var band = req.body;

	if (!band) {
		return res.status(400).send('No body sent').end();
	}
  band['applliedGigs']=[];
  band['acceptedGigs']=[];

	console.log("Received body for band: " + band);

	database.connect(db => {
		let bands = db.db('bands').collection('bands');
		bands.insertOne(band, (err, result) => {
			if (err){
				console.warn("Couldnt get insert band into database: " + err);
				res.status(500).end();
				db.close();
			}
      else{
				console.log("band inserted");
				res.status(200).end();
				db.close();
			}
		});
	}, err => {
		console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
	});
});
}
