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
		res.status(400).send('No query or mode sent'.end();
	}

	if (mode == 'band to gig') {
		matching.findGigsForBand(bandName, query, err => {
			// ...
		}, ok => {
			// ...
		});
	}
  else if (mode == 'gig to band'){
    matching.findBandsForGig(bandName, query, err => {
			// ...
		}, ok => {
			
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

router.post('/gig', (req, res) => {
	var gig = req.body;
	if (!gig) {
		return res.status(400).send('No body sent').end();
	}
  gig['isFilled']=false;
  gig['banndFor']='none';
	console.log("Received body for gig: " + gig);

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
		})
	}, err => {
		console.warn("Couldn't connect to database: " + err)
		res.status(500).end()
	});
});

router.get('/current_events'(req, res) => {
  database.connect(db => {
    let gigDB = db.db('gigs').collection('gigs');
    gigDB.findOne(query:{'isFilled':{$eq: true}}).toArraytoArray(function(err, result) {
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
			} else {
				console.log("band inserted");
				res.status(200).end();
				db.close();
			}
		})
	}, err => {
		console.warn("Couldn't connect to database: " + err)
		res.status(500).end()
	});
});
