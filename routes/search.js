module.exports = router => {

const database = require('../database.js'),
      matching = require('../algs/matching.js');
console.log(matching);
var ObjectId = require('mongodb').ObjectID;

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
          db.close();
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
        db.close();
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
          db.close();
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
        db.close();
			});
			break;
		default:
			res.status(400).send("Invalid mode: " + mode).end()
	}
});



router.get('/current_events', (req, res) => {
  database.connect(db => {
    let gigDB = db.db('gigs').collection('gigs');
    gigDB.find({'isFilled':{$eq: true}}).toArray(function(err2, result) {
      if (err2){
        console.warn("Couldnt get gigs: " + err2);
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




router.get('/getBands', (req, res)=>{
  if (! req.body){
    console.log("No req body sent, in get bands And Gigs for user");
    res.status(400).send('No req body sent');
  }
  var {creator} = req.query;
  console.log('in get bands and creator is: ' + creator);
  database.connect(db => {
    let bands = db.db('bands').collection('bands');
    var bandquery = {'creator':creator};
    bands.find(bandquery).toArray(function(err, result) {
     if (err){
       console.log("Error in get Bands and Gigs For User: " + err);
       req.status(500).end();
       db.close();
     }
     else{
       res.status(200).send(result);
       db.close();
     }
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
    res.status(400).send('No req body sent');
  }
  database.connect( db => {
    let gigs = db.db('gigs').collection('gigs');
    var gigQuery = {'creator':creator};
    gigs.find(gigQuery).toArray(function(err, result) {
     if (err){
       console.log("Error in get Bands and Gigs For User: " + err);
       req.status(500).end();
       db.close();
     }
     else{
       res.status(200).send(result);
       db.close();
     }
    });
  }, err =>{
    console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
  });
});

router.get('/searchNoName', (req, res) => {
  console.log("req is search is : " + req);
  console.log("req.query is search is : " + req.query);
	var {query, mode} = req.query;
  console.log("IN SEARCH AND query IS " + query);
  console.log("IN SEARCH AND MODE IS " + mode);
	if (!query) {
		return res.status(400).send('No query supplied').end();
	} else if (!mode) {
		return res.status(400).send('No mode supplied').end();
	}

	switch (mode) {
		case 'findGigs':
    console.log("got in searching no name for gigs on search rotues page");
    //console.log("band namee searching for bands is: " + bandName);
			database.connect(db => {
				matching.findGigsNoName(query, db, err => {
					console.error("Error when finding gigs for "+ err);
					res.status(500).end();
				}, data => {
					res.status(200).json({ success: true, data: data });
          db.close();
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
			})
			break;
		case 'findBands':
    console.log("got in searching no name for bands");
  //  console.log("gig namee searching for bands is: " + gigName);
			database.connect(db => {
				matching.findBandsNoName( query, db, err => {
					console.error("Error when finding bands : " + err);
					res.status(500).end();
				}, data => {
					res.status(200).json({ success: true, data: data });
          db.close();
				});
			}, err => {
				console.error('[auth][database] Database connection whilst logging in failed');
				res.status(500).end()
        db.close();
			});
			break;
		default:
			res.status(400).send("Invalid mode: " + mode).end()
	}
});

router.get('/bandsForDrops', (req, res)=>{
  db.db('bands').collection('bands').find({}, {projection : {'audioSamples':1, 'picture':1}}).toArray((err, result)=>{
    if (err){
      console.log('there was an error trying to get audio and picture for bands err is :' + err);
      res.status(500).end();
      db.close();
    }
    else{
      console.log('Got audio and pictures out of bands here is result: ' + JSON.stringify(result));
      res.status(200).send(result);
      db.close();
    }
  });
});
router.get('/aGig', (req, res)=>{
  if (!req.query) {
     res.status(400).send('No body sent').end();
  }
  if (!req.session.key){
    res.status(401).send('No body sent').end();
    console.log('user tried to apply without being logged in');
  }
  console.log(req.query);
  var {gigID} = req.query;
  console.log("Gig id is : " + gigID);
  database.connect(db=>{
    db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err2, result2)=>{
      if (err2) {
        console.log('There was an erro rtrying to get gig with id ' + gigID + " ERROR: " + err2);
        res.status(500).end();
        db.close();
      }
      else{
        console.log("IN find a gig result is " + result2);
        res.status(200).send(result2);
        db.close();
      }
    });
  }, err=>{
    console.log('There was an error connect to db: ' + err);
    res.status(500).end();

  });
});

router.get('/aBand', (req, res)=>{
  if (!req.query) {
     res.status(400).send('No body sent').end();
  }
  if (!req.session.key){
    res.status(401).send('No body sent').end();
    console.log('user tried to apply without being logged in');
  }

  var {id}=req.query;
  console.log('Id :' + id);
  database.connect(db=>{
    db.db('bands').collection('bands').findOne({_id:database.objectId(id)}, (err2, result2)=>{
      if (err2){
        console.log('There was an erro rtrying to get band with id ' + id + " ERROR: " + err2);
        res.status(500).end();
       db.close();
      }
      else{
        console.log("IN find a band result is " + result2);
        res.status(200).send(result2);
        db.close();
      }

    });
  }, err=>{
    console.log('There was an error connect to db: ' + err);
    res.status(500).end();
  });
});

router.get('/aUser', (req, res)=>{
  if (!req.session.key){
    console.log('Non-logged in user tried to download');
    res.status(403).end();
  }
  if (!req.query){
    console.log('no query sent for a user');
    res.status(400).end();
  }
  else{
    var {id} = req.query;
    database.connect(db=>{
      db.db('users').collection('users').findOne({'_id':database.objectId(id)},{'password':0, 'username':1}, (err2, result2)=>{
        if(err2){
          console.log('There was an error getting user: ' + id + 'out of mongo, error: ' + err2);
          res.status(500).end();
        }
        else{
          console.log('Got a user : ' + JSON.stringify(result));
          res.status(200).send(result2);
        }
      })
    }, err=>{
      console.log('There was an error connecting to mongo db error: was : ' + err);
    })
  }
});

}
