module.exports = router => {
  const database = require('../database.js');
  router.post('/apply', (req, res)=>{
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    database.connect(db=>{
      var {gigID, bandID}=req.body;
      var newValues = {$push: {'applications':bandID}};
      db.db('gigs').collection('gigs').updateOne({'_id':ObjectId(gigId)}, newValues, (err2 , result)=>{
        if (err2){
          console.log('There was an error tryign to append application to gig, error was: ' + err2);
          db.close();
          res.status(500).end();
        }
        console.log('Appended application ' + bandID + ' To gig with id: ' + gigId);
      });
      var newValues2 = {$push:{ 'gigsApplied':gigID}};
      db.db('bands').collection('bands').updateOne({'_id':ObjectID(bandID)}, newValues2, (err3, result3)=>{
        if (err3){
          console.log('There was an error tryign to append application to gig, error was: ' + err3);
          db.close();
          res.status(500).end();
        }
        else{
          console.log('Appended gig ' + gigID + ' To band with id: ' + bandID);
          db.close();
          res.status(200).end();
        }
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });
  });

  router.post('/askBandToPlay', (req, res)=>{
    if (!req.body) {
  		 res.status(400).send('No body sent').end();
  	}
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    var {gigID, bandID}=req.body;
    database.connect(db=>{
      var newValues = {$push: {'interstedGigs':gigId}};
      db.db('bands').collection('bands').updateOne({'_id':ObjectID(bandID)}, newValues, (err2 , result)=>{
        if (err2){
          console.log('There was an error tryign to append application to gig, error was: ' + err2);
          db.close();
          res.status(500).end();
        }
        console.log('Appended gig ' + gigID + ' To band with id: ' + bandID);
      });
      var newValues2 = {$push: {'bandsAskedToPlay':ObjectID(bandID)}};
      db.db('gigs').collection('gigs').updateOne({'_id':ObjectId(gigId)}, newValues2, (err3 , result3)=>{
        if (err3){
          console.log('There was an error tryign to append application to gig, error was: ' + err3);
          db.close();
          res.status(500).end();
        }
        console.log('Appended bandID ' + bandID + ' To gig with id: ' + gigID);
        db.close();
        res.status(200).end();
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });


  });

  router.post('/accept', (req, res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    database.connect(db=>{
      db.db('gigs').collection('gigs').findOne({'_id':ObjectId(gigId)}, (err5, result5)=>{
        if (err5){
          console.log("Couldnt find gig with id " + gigID + " Error: " + err5);
          res.status(500).end();
        }
        else{
          console.log('Result for finding the gig in accept is: ' + JSON.stringify(result5));
          if(result2['isFilled']==true){
            console.log("Gig with id: "+ gigID + "tried to acccept a gig when alreay isFilled");
            res.status(200).send("That gig is already filled");
            db.close();
            return;
          }
          else{
            var {gigID, bandID} = req.body;
            console.log("Gig with id: "+ gigID + 'is not filled');
            var newValues = {$set: {'bandFor':bandID, 'isFilled':true}};
            db.db('gigs').collection('gigs').updateOne({'_id':ObjectId(gigId)}, newValues, (err2, result)=>{
              if (err2){
                console.log('There was an error tryign to append set gig stuff, error was: ' + err2);
                db.close();
                res.status(500).end();
              }
              else{
                console.log('got gig set with the band' + bandID);
                console.log(JSON.stringify(result));
              }
            });
            var newValues2 = {
              $push: {'upcomingGigs':gigID},
              $pull:{'appliedGigs': {$elemMatch:{'_id':gigID}}}
            };
            db.db('bands').collection('bands').updateOne({'_id':ObjectID(bandID)}, newValues2, (err3, result3)=>{
              if (err3){
                console.log('There was an error tryign to append set gig stuff, error was: ' + err3);
                db.close();
                res.status(500).end();
              }
              else{
                console.log('got band set with the band' + bandID);
                console.log(JSON.stringify(result));
                db.close();
                res.status(200).end();
              }
            });
          }
        }
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });
  });

  router.post('/addContact', (req, res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    var {contactID} = req.body;
    database.connect(db=>{
      var newValues = {$push: {'contacts':contactID}};
      db.db('users').collection('users').updateOne({'username':req.session.key}, newValues, (err2, result)=>{
        if (err2){
          console.log('There was an error tryign to append contact, error was: ' + err2);
          db.close();
          res.status(500).end();
        }
        else{
          console.log('got user set with the contact' + contactID);
          console.log(JSON.stringify(result));
          db.close();
          res.status(200).end();
        }
      });
    }, err =>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    });
  });
}
