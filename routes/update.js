module.exports = router => {
  const database = require('../database.js');


  router.put('/gigs', (req, res) => {
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}

    var {query, gigName} = req.body;
    var newvalues = {$set: query};
    db.db('gigs').collection("gigs").updateOne('name':gigName, newvalues, function(err, res){
    if (err){
      console.log("There was an error: " + err);
      res.send("Internal server error").end();
    }
    console.log("update gig " + gigName);
    db.close();
    });
  });

  router.put('/bands', (req, res) =>{
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}

    var {query, bandName} = req.body;
    var newvalues = {$set: query};
    db.db('bands').collection("bands").updateOne('name':bandName, newvalues, function(err, res){
    if (err){
      console.log("There was an error: " + err);
      res.send("Internal server error").end();
    }
    console.log("updated band " + bandName);
    db.close();
    });
  });

}
