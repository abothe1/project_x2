module.exports = router => {

const database = require('../database.js'),
      matching = require('../algs/matching.js');
console.log(matching);

router.get('/search', (req, res) => {
  console.log("req is search is : " + req);
  console.log("req.query is search is : " + req.query);
	var {query, mode, bandName, gigName} = req.query;
  console.log("IN SEARCH AND query IS " + query);
  console.log("IN SEARCH AND MODE IS " + mode);
  console.log("IN SEARCH AND bandName IS " + bandName);
	if (!query) {
		return res.status(400).send('No query supplied').end();
	} else if (!mode) {
		return res.status(400).send('No mode supplied').end();
	}

	switch (mode) {
		case 'findGigs':
    console.log("got in searchign for gigs on search rotues page");
    console.log("band namee searching for bands is: " + bandName);
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
    console.log("got in searchign for bands");
    console.log("gig namee searching for bands is: " + gigName);
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
  console.log(req);
  console.log("got into post gigs on router");
	var {name, creator, address, price, startDate, endDate, applications, lat, lng, categories} = req.body;
	if (!req.body) {
		 res.status(400).send('No body sent').end();
	}
//  gig['isFilled']=true;
//  gig['bandFor']='none';
	console.log("Received body for gig: " + req.body.name);

	database.connect(db => {
		let gigs = db.db('gigs').collection('gigs');
		gigs.insertOne({'name' : name, 'creator' : creator, 'address': address, 'price': price, 'startDate' : startDate, 'endDate' : endDate, 'applications' : applications, 'lat' : lat, 'lng':lng, 'categories' : categories, 'isFilled':true, 'bandFor' : 'none' }, (err, result) => {
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
        console.warn("Couldnt get gigs: " + err);
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
  console.log(req);
  console.log("got into post gigs on router");
	var {name, creator, address, zipcode, price, openDates, application, lat, lng, audioSamples, videoSamples, picture, categories} = req.body;
	if (!req.body) {
		 res.status(400).send('No body sent').end();
	}
//  gig['isFilled']=true;
//  gig['bandFor']='none';
	console.log("Received body for band: " + req.body.name);

	database.connect(db => {
		let bands = db.db('bands').collection('bands');
		bands.insertOne({'name' : name, 'creator':creator, 'address': address, 'zipcode':zipcode, 'price': price, 'openDates':openDates, 'applicationText':application, 'lat' : lat, 'lng':lng, 'categories' : categories, 'appliedGigs':[], 'upcomingGigs':[], 'finishedGigs':[], 'audioSamples':audioSamples, 'videoSamples':videoSamples, 'picture': picture}, (err, result) => {
			if (err){
				console.warn("Couldnt get insert band into database: " + err);
				res.status(500).end();
				db.close();
			} else {
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

router.get('/search_page', (req,res) => {
  res.render('search.html');
});

router.get('/getBands', (req, res)=>{


  if (! req.body){
    console.log("No req body sent, in get bands And Gigs for user");
    res.status(200).send('No req body sent');
  }
  var {creator} = req.query;
  console.log('in get bands and creator is: ' + creator);
  database.connect(db => {
    let bands = db.db('bands').collection('bands');
    var bandquery = {'creator':creator};
    bands.find(bandquery).toArray(function(err, result) {
     if (err){
       console.log("Error in get Bands and Gigs For User: " + err);
       req.status(200).end();
     }
     else{
       res.status(200).send(result);
     }
     db.close();
    });
  }, err =>{
    console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
  });


});

router.get('/getGigs', (req, res)=>{
  var {creator} = req.query;
  console.log('in get gigs and creator is: ' + creator);
  if (! req.body){
    console.log("No req body sent, in get bands And Gigs for user");
    res.status(200).send('No req body sent');
  }
  database.connect( db => {
    let gigs = db.db('gigs').collection('gigs');
    var gigQuery = {'creator':creator};
    gigs.find(gigQuery).toArray(function(err, result) {
     if (err){
       console.log("Error in get Bands and Gigs For User: " + err);
       req.status(200).end();
     }
     else{
       res.status(200).send(result);
     }
     db.close();
    });
  }, err =>{
    console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
  });


});

}
