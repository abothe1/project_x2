module.exports = router => {
  const database = require('../database.js');

  router.post('/updateGig', (req, res) => {
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}
    database.connect(db=>{
      var {gigName, query} = req.body;
      var newvalues = {$set: query};
      db.db('gigs').collection("gigs").updateOne({'name':gigName}, newvalues, res =>{
        console.log("updated gig " + gigName);
        db.close();
      }, error =>{
        console.log("There was an error: " + error);
        res.send("Internal server error").end();
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });

  });

  router.post('/updateBand', (req, res) =>{
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}

    var {bandName, query} = req.body;
    var newvalues = {$set: query};
    database.connect(db=>{
      db.db('bands').collection("bands").updateOne({'name':bandName}, newvalues, res=>{
        console.log("updated band " + bandName);
        db.close();
      }, error=>{
        console.log("There was an error: " + err);
        res.send("Internal server error").end();
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });

  });

}
