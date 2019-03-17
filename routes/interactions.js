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
            var newCode = creatBandConfirmCode(gigID, bandID);
            var upGig = {'gigID':gigID, 'confirmationCode':newCode};
            var newValues2 = {
              $push: {'upcomingGigs':upGig},
              $pull:{'appliedGigs.$[element]': gigID}
            };
            db.db('bands').collection('bands').updateOne({'_id':ObjectID(bandID)}, newValues2, {arrayFilters:{element:gigID}}, (err3, result3)=>{
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

  router.post('/confirmationCodeBand', (req,res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    else{
      var {confirmCode, gigID, bandID} = req.body;
      database.connect(db=>{
        db.db('gigs').collection('gigs').findOne({'_id':database.objectID('gigID')}, (err2, result2)=>{
            if (err2){
              console.log('There was an error tryign to find gig, error was: ' + err2);
              db.close();
              res.status(500).end();
            }
            else{
              console.log("Result2 from confirmCode band (find gig) is " + result2);
              if(!(result2['bandFor']==bandID)){
                console.log('band sent a confirm code for a gig they are not booked for');
                db.close();
                res.status(400).end();
              }
              else if (result2['isFilled']==false){
                console.log('band sent a confirm code for a gig that has not been filled');
                db.close();
                res.status(400).end();
              }
              else if (!(result2['confirmationCode']==confirmCode)){
                console.log("Band sent an incorrect confirmation code");
              }
              else{
                console.log("Band with id: " + bandID + "sent a correct confirmation code: " + confirmCode + "for gig: " + gigID);
                var newValues = {$set:{'confirmed':true}};

                db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues, (err3, result3)=>{
                  if(err3){
                    console.log('Got error trying to update gig: ' + err3);
                    db.close();
                    res.status(500).end();
                  }
                  else{
                    console.log('Result for setting confirmed to true for gig was : ' + result3);
                    res.status(200).send('Updated gigs and it all went through');
                    //moved db bands moving arrays around func
                  }
                });
              }
            }
        });
      }, err=>{
        console.log("Couldn't connec to mongo with error: "+err);
        res.status(500).end();
      });
    }
  });

  router.post('/confirmationCodeGig', (req, res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    var {gigID, bandID, confirmGig} = req.body;
    database.connect(db=>{
      db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err2, result2)=>{
        if (err2){
          console.log("There was error trying to find gig with id : " + gigID+"  error was: " + err2);
          db.close();
          res.status(500).end();
        }
        else{
          console.log("Got gig out of db in confirm code gig: " + result2);
          if (!(result2['bandFor']==bandID)){
            console.log('bandID sent did not match the band for in gig');
            db.close();
            res.status(401).send('Band ID does not match bandfor');
          }
          else if (!result2['isFilled']){
            console.log('In confirm gig is not booked yet... so that shouldnt have happended');
            db.close();
            res.status(401).send('Gig not filled yet');
          }
          else{
            db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err3, result3)=>{
              if (err3){
                console.log("There was an error getting band with id: " +bandID+ " out of the db, error: " + err3);
                db.close();
                res.status(500).end();
              }
              else{
                console.log("Got band out of db in gig send confrim code here is result: " + result3);
                var gigMatches = false;
                for (var upGig in result3['upcomingGigs']){
                  if (result3['upcomingGigs'][upGig]==gigID){
                    gigMatches=true;
                  }
                }
                if(gigMatches){
                  if(result3['upcomingGigs']['confirmationCode']==confirmCode){

                  }
                  else{
                    var newValues2 = {$pull: {'upcomingGigs.$[element]'},
                                      $push: {'finishedGigs':gigID}
                                     };
                    var filters = {arrayFilters:[element:gigID};

                    db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, newValues2, filters, (err4, result4)=>{
                      if (err4){
                        console.log("There was an error trying to modify bands arrays for confirm, err: " + err4);
                        res.status(500).end();
                      }
                      else{
                        console.log("Update band in confirm code gig, result was: " + result4);
                        db.close();
                        res.status(200).end();
                      }
                    });
                  }
                }
                else{
                  console.log('Gig id sent with confrim code in gig send confirm code does not match any upcoming gig in bandID sent');
                  db.close();
                  res.status(200).send('Gig id does not match any off the bands upcoming gigs');
                }
              }
            });
          }
        }
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      res.status(500).end();
    })
  });
}
