module.exports = router => {
  const database = require('../database.js');
  var ObjectId = require('mongodb').ObjectID;
  router.post('/updateGig', (req, res) => {
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}
    database.connect(db=>{
      var {id, query} = req.body;
      var newvalues = query;
      db.db('gigs').collection("gigs").updateOne({'_id':ObjectId(id)}, newvalues, result =>{
        console.log("updated gig " + id);
        res.status(200).send(result);

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

    var {id, query} = req.body;
    var newvalues =  query;
    console.log('query :' + JSON.stringify(query));
    database.connect(db=>{
      db.db('bands').collection("bands").updateOne({'_id':ObjectId(id)}, newvalues, result=>{
        console.log("updated band " + id);
        db.close();
        res.status(200).end();
      }, error=>{
        db.close();
        console.log("There was an error: " + err);
        res.send("Internal server error").end();
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });

  });

  router.post('/bandRating', (req, res) =>{
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}

    var {id, newRating} = req.body;

    database.connect(db=>{
      db.db('bands').collection('bands').findOne({'_id':ObjectId(id)}, function(err2, result){
        if (err2){
          console.log("Error while trying to find band with id: "+id+"Error: "+err2);
          res.sataus(500).end();
          db.close();
        }
        else{
          console.log("Result from find one band in rating post is: "+JSON.stringify(result));
          var myBand = result;
          var rating = result['rating'];
          var numRatings = result['numRatings'];
          if (numRatings=null){
            numRatings=1;
            var query = {'rating':newRating, 'numRatings':numRatings};
            var newvalues = {$set: query};
            database.connect(db=>{
              db.db('bands').collection("bands").updateOne({'_id':id}, newvalues, res=>{
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
          }
          else{
            var totalScore = numRatings*rating;
            totalScore = totalScore + newRating;
            numRatings = numRatings+1;
            newRating = totalScore/numRatings;
            var query = {'rating':newRating, 'numRatings':numRatings};
            var newvalues = {$set: query};
            database.connect(db=>{
              db.db('bands').collection("bands").updateOne({'_id':ObjectId(id)}, newvalues, res=>{
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

          }
        }
      });
    }, err=>{
      console.log("Couldn't connect to mongo with error: "+err);
      res.status(500).end();
    });
  });

}
