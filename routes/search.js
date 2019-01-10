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

router.post('/post_gig', (req, res) => {
  console.log("got into the post gig thing on search.js")

    var gig = req.body;
    database.connect(db => {
       db.db('gigs').collection('gigs').insertOne(gig, function(err,result){
         if (err){
           res.err=err;
           db.close();
         }
         else{
           console.log("gig inserted");
           db.close();
         }
       });

  	}, err => {
  		console.warn("Couldn't connect to database: " + err)
  		res.status(500).end()
  	});
});


}
