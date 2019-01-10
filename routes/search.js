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
    gig['isFilled']=false;
    gig['bandFor']='none';
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

router.get('/get_current_events', (req, res) => {
  console.log("got into the get gig get_current_events on search.js")
  var query_curr_events = {isFilled: true};
    database.connect(db => {
       db.db('gigs').collection('gigs').find(query_curr_events).toArray(function(err,result){
         if (err){
           //res.err=err;
           console.log(err);
           db.close();
         }
         else{
           console.log("result is:" + result);
           res.status(200).json({'events':result});
           db.close();
         }
       });

  	}, err => {
  		console.warn("Couldn't connect to database: " + err);
  		res.status(500).end();
  	});
});


}
