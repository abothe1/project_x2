module.exports = router => {
const database = require('../database.js');

router.post('/gig', (req, res) => {
  console.log(req);
  console.log("got into post gigs on router");
  if(!req.session.key){
    console.log('Non logged in user tried to post a band');
    res.status(400).end();
  }
  if (!req.body) {
     res.status(400).send('No body sent').end();
  }
  var {name, address, price, picture, zipcode, day, startTime, date, endTime, applications, lat, lng, categories, description} = req.body;
  var creator = req.session.key;
//  gig['isFilled']=true;
//  gig['bandFor']='none';
  console.log("Received body for gig: " + req.body.name);

  database.connect(db => {
    let gigs = db.db('gigs').collection('gigs');
    let confirmCode=createGigConfirmCode(name);
    gigs.insertOne({'name' : name, 'confirmed':false, 'creator' : creator, 'address': address, 'zipcode':zipcode, 'startTime':startTime, 'price': price, 'date' : date, 'day':day, 'endTime' : endTime, 'applications' : [], 'lat' : lat, 'lng':lng, 'categories' : categories, 'description':description, 'isFilled':false, 'bandFor' : "", 'confirmationCode':confirmCode, 'picture':picture}, (err, result) => {
      if (err){
        console.warn("Couldnt get insert gig into database: " + err);
        res.status(500).end();
        db.close();
      } else {
        console.log("gig inserted result: " + result["ops"][0]["_id"]);
        res.status(200).send(result["ops"][0]["_id"]);
        db.close();
      }
    });
  }, err => {
    console.warn("Couldn't connect to database: " + err);
    res.status(500).end();
  });
});

router.post('/band', (req, res) => {
  console.log(req);
  console.log("got into post bands on router");
  if(!req.session.key){
    console.log('Non logged in user tried to post a band');
    res.status(400).end();
  }
  if (!req.body) {
		 res.status(400).send('No body sent').end();
	}
	var {name, address, zipcode, maxDist, price, openDates, application, lat, lng, picture, categories, description, sample} = req.body;
  var creator=req.session.key;

//  gig['isFilled']=true;
//  gig['bandFor']='none';
	console.log("Received body for band: " + req.body.name);

	database.connect(db => {
		let bands = db.db('bands').collection('bands');
		bands.insertOne({'name' : name, 'creator':creator, 'maxDist':maxDist, 'address': address, 'zipcode':zipcode, 'price': price, 'rating':null, 'openDates':openDates, 'applicationText':application, 'lat' : lat, 'lng':lng, 'categories' : categories, 'description': description, 'appliedGigs':[], 'upcomingGigs':[], 'finishedGigs':[], 'interestedGigs':[], 'audioSamples':[sample], 'videoSample':[], 'picture': picture}, (err, result) => {
			if (err){
				console.warn("Couldnt get insert band into database: " + err);
				res.status(500).end();
        db.close();
			} else {
				console.log("band inserted with cats as : " + JSON.stringify(categories));
				res.status(200).send(result);
        db.close();

			}
		});
	}, err => {
		console.warn("Couldn't connect to database: " + err);
		res.status(500).end();
	});
});

function createGigConfirmCode(name){
    //INSERT KWAN's Func here:
  return name;
}

} // end of module exports
