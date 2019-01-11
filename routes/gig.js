module.exports = router => {

const database = require('../database.js'),
      matching = require('../algs/matching.js');

router.post('/gig', (req, res) => {
	var gig = req.body;
	if (!gig) {
		return res.status(400).send('No body sent').end();
	}

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

}