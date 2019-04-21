module.exports = router => {
  const database = require('../database.js');
  stripe_private_key = 'sk_test_t6hlsKu6iehEdJhV9KzITmxm00flbTdrG5';
  var stripe = require('stripe')(stripe_private_key);
  const BANDA_CUT = 0.05;
  const OUR_ADDRESS = 'xxxx@xxx';
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
      db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err5, result5)=>{
        if(err5){
          console.log('There was an error getting gi with id: '+gigID+' out of db, error: ' + err5);
          res.status(500).end();
          db.close();
        }
        else{
          if (result5['isFilled']){
            console.log('A band applied to a gig that was filled.');
            res.status(200).send('Event already filled');
            db.close();
          }
          else{
            var applicantExists = false;
            for (var key in result5['applications']){
              if(result5['applications'][key]==bandID){
                applicantExists=true;
              }
            }
            if(applicantExists){
              console.log('Band with id : '+bandID+' tried to apply to a gig it already applied to.');
              res.status(200).send('You already applied to this gig with this band.');
              db.close();
            }
            else{
              db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues, (err2 , result)=>{
                if (err2){
                  console.log('There was an error tryign to append application to gig, error was: ' + err2);
                  res.status(500).end();
                  db.close();
                }
                console.log('Appended application ' + bandID + ' To gig with id: ' + gigID);
                var gigApplied = [gigID, false]
                var newValues2 = {$push:{ 'appliedGigs':gigApplied}};
                db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, newValues2, (err3, result3)=>{
                  if (err3){
                    console.log('There was an error tryign to append application to gig, error was: ' + err3);
                    res.status(500).end();
                    db.close();
                  }
                  else{
                    console.log('Appended gig ' + gigID + ' To band with id: ' + bandID);
                    res.status(200).end();
                    db.close();
                  }
                });
              });
            }
          }
        }
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
    var {gigID, bandID} = req.body;
    var theGig = null;
    var theBand = null;
    console.log('//////////// IN ACCEPT');

    database.connect(db=>{
      db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err5, result5)=>{
        if (err5){
          console.log("Couldnt find gig with id " + gigID + " Error: " + err5);
          res.status(500).end();
        }
        else{
          theGig=result5;
          console.log('Result for finding the gig in accept is: ' + JSON.stringify(result5));
          if(result5['isFilled']==true){
            console.log("Gig with id: "+ gigID + "tried to acccept a gig when alreay isFilled");
            res.status(200).send("That gig is already filled");
            db.close();
          }
          else{
            console.log("Gig with id: "+ gigID + 'is not filled');
            var newValues = {$set: {'bandFor':bandID, 'isFilled':true}};
            db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues, (err2, result)=>{
              if (err2){
                console.log('There was an error tryign to append set gig stuff, error was: ' + err2);
                res.status(500).end();
                db.close();

              }
              else{
                console.log('got gig set with the band' + bandID);
                console.log(JSON.stringify(result));
                chargeUser(req, theGig.price, theGig._id, (ourError)=>{
                  if(ourError){
                    console.log('We had an error chraging customer: ' + ourError);
                  }
                });
              }
            });
            var newCode = createBandConfirmCode(gigID, bandID);
            var upGig = {'gigID':gigID, 'confirmationCode':newCode};

            db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err6, result6)=>{
              if (err6){
                console.log('THre was an error finding band : ' + bandID +' from mongo. '+err6);
                res.status(500).end();
                db.close();
              }
              else{
                var stillAppliedTo=[];
                for (var g in result6['appliedGigs']){
                  if(gigID==result6['appliedGigs'][g][0]){

                  }
                  else{
                    stillAppliedTo.push(result6['appliedGigs'][g]);
                  }
                }
                var newValues2 = {
                  $push: {'upcomingGigs':upGig},
                  $set:{'appliedGigs': stillAppliedTo}
                };
                db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, newValues2, (err3, result3)=>{
                  if (err3){
                    console.log('There was an error tryign to append set band stuff, error was: ' + err3);
                    res.status(500).end();
                    db.close();
                  }
                  else{
                    console.log('got band set with the band' + bandID);
                    console.log(JSON.stringify(result3));
                    var denied = [];
                    for (var ap in theGig['applications']){
                      if (theGig['applications'][ap]==bandID){

                      }
                      else{
                        denied.push({'_id':database.objectId(theGig['applications'][ap])});
                      }
                    }
                    if (denied.length==0){
                      res.status(200).end();
                      db.close();
                      return;
                    }
                    db.db('bands').collection('bands').find({$or:denied}).toArray((err4, result4)=>{
                      if (err4){
                        console.log('Faild to get the batch of denied bands ' +err4);
                        res.status(500).end();
                        db.close();
                      }
                      var on = 0;
                      result4.forEach(bandOn=>{
                        on+=1;
                        var nonDeniedGigs=[];
                        for (var gigAppliedTo in bandOn['appliedGigs']){
                          if (bandOn['appliedGigs'][gigAppliedTo][0]==gigID){
                            nonDeniedGigs.push(bandOn['appliedGigs'][gigAppliedTo]);
                          }
                          else{
                            bandOn['appliedGigs'][gigAppliedTo][1]=true;
                            nonDeniedGigs.push(bandOn['appliedGigs'][gigAppliedTo]);
                          }
                        }
                        var newValues7 = {$set:{'appliedGigs':nonDeniedGigs}};
                        db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandOn['_id'])}, newValues7, (err7, res7)=>{
                          if (err7){
                            console.log('THere was an error updating one of the denied bands: ' + bandOn['_id']+' Error: '+err7);
                            res.status(500).end();
                          }
                          else{
                            if (on>result4.length){
                              res.status(200).end();
                              db.close();
                            }
                          }
                        });
                      });
                    });
                  }
                });
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

  function chargeUser(req, price, gigID, cb){
    console.log('PRICE IN CHARGE: ' + price);
    var username = req.session.key;
    var chargeAmount = Math.trunc(100*BANDA_CUT*price); // this puts it into cents.

    console.log('BANDA CASH: ' + chargeAmount);
    database.connect(db=>{
      db.db('users').collection('stripe_customers').findOne({'username':username}, (err9, stripe_user)=>{
        if(err9){
          console.log('There was an error finding username: ' + username + ' in the stripe_customers' + err9);
          cb(err9);
          return;
        }
        console.log('stripe_user is: ' + JSON.stringify(stripe_user));

        stripe.charges.create({
          amount: chargeAmount,
          currency: 'usd',
          customer: stripe_user.stripe_id,
          description: "For a band from Banda, for your event.",
        }, function(stripe_error, charge) {
            if(stripe_error){
              console.log('There was an error createing chage with stripe: ' + stripe_error.message);
              cb(stripe_error);
            }
            else{
              console.log('THe charge is: ' + JSON.stringify(charge));
              var chageForDB={'charge_id':charge.id, 'amount':charge.amount, 'gigID':gigID, 'transfer':false};
              db.db('users').collection('stripe_customers').updateOne({'username':username}, {$push:{'charges':chageForDB}}, (result11, err11)=>{
                if (err11){
                  console.log('There was an error adding the charge to user: '+username+' charges array.');
                  cb(err11);
                  db.close();
                }
                else{
                  console.log('Added charge to db and charge was successful. We charged user: ' +username+' '+chargeAmount);
                  cb();
                  db.close();
                }
              })
            }
          });
      });
    }, err=>{
      cb(err)
    });
  }

  router.post('/addContact', (req, res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to apply without being logged in');
    }
    var {contactName} = req.body;
    var ourUser=null;
    var newContact = null;
    database.connect(db=>{
        db.db('users').collection('users').findOne({'username':req.session.key}, (err2, result2)=>{
          if (err2){
            console.log("THere was an error getting user out of db with name: " +req.session.key );
             ourUser=result2;
            res.status(500).end();
            db.close();
          }
          else{
            var contactExists=false;
            for (var key in result2['contacts']){
              if(result2['contacts'][key]['name']==contactName){
                contactExists=true;
              }
            }
            if(contactExists){
              console.log('A user: ' + req.session.key + 'tried to add a user to contacts with id: ' + contactName);
              res.status(200).send('That contact is already in this users');
              db.close();
            }
            else{
              db.db('users').collection("users").findOne({'username':contactName}, (err4, result4)=>{
                if (err4){
                  console.log('Ran into an error getting the new contact with id: ' + contactName+" Out of the db, "+err4);
                  res.status(500).end();
                  db.close();
                }
                else{
                  newContact=result4;
                  var newvalues = {$push:{'contacts':{'id':newContact['_id'], 'name':contactName}}};
                  db.db('users').collection('users').updateOne({'username':req.session.key}, newValues, (err3, result3)=>{
                    if (err3){
                      console.log('There was an error tryign to append contact, error was: ' + err3);
                      res.status(500).end();
                      db.close();
                    }
                    else{
                      console.log('got user set with the contact' + contactName);
                      console.log(JSON.stringify(result));
                      res.status(200).end();
                      db.close();
                    }
                  });
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

  router.post('/confirmationCodeBand', (req,res)=>{
    if (!req.body) {
       res.status(400).send('No body sent').end();
    }
    if (!req.session.key){
      res.status(401).send('No body sent').end();
      console.log('user tried to send confirm code without being logged in');
    }
    else{
      var {confirmCode, gigID, bandID} = req.body;
      database.connect(db=>{
        db.db('gigs').collection('gigs').findOne({'_id':database.objectId('gigID')}, (err2, result2)=>{
            if (err2){
              console.log('There was an error tryign to find gig, error was: ' + err2);
              db.close();
              res.status(500).end();
            }
            else{
              var theGig = result2;
              console.log("Result2 from confirmCode band (find gig) is " + result2);
              if(!(result2['bandFor']==bandID)){
                console.log('band sent a confirm code for a gig they are not booked for');
                res.status(400).end();
                db.close();
              }
              else if (result2['isFilled']==false){
                console.log('band sent a confirm code for a gig that has not been filled');
                res.status(400).end();
                db.close();
              }
              else if (!(result2['confirmationCode']==confirmCode)){
                console.log("Band sent an incorrect confirmation code");
                res.status(200).send('Sorry, the code you sent did not match the code we have on record for that gig. Please try again.');
                db.close();
              }
              else{
                console.log("Band with id: " + bandID + "sent a correct confirmation code: " + confirmCode + "for gig: " + gigID);
                //var newValues = {$set:{'confirmed':true}}
                    db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err4, theBand)=>{
                      if (err4){
                        console.log('There was an error finding band with id: ' + bandID+" "+err4);
                        res.status(500).end();
                        db.close();
                      }
                      else{
                        var allUpGigs =[];
                        for (var upGig in theBand.upcomigGigs){
                            if (!(upGig.gigID==gigID)){
                              allUpGigs.push(theBand.upcomigGigs[upGig]);
                            }
                        }
                        db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, {$set:{'upcomingGigs':allUpGigs}, $push:{'finishedGigs':{'gigID':gigID, 'paid':true, 'flaked':false}}}, (err5, res5)=>{
                          if(err5){
                            console.log('There was an error updating band: ' + bandID+' error: ' + err5);
                            res.status(500).end();
                            db.close();
                          }
                          else{
                            db.db('users').collection('stripe_customers').findOne({'username':req.session.key}, (err6, stripe_customer)=>{
                              if (err6){
                                console.log('There was an error getting the stripe_customer: '+req.session.key+' out. ' + err6);
                                res.status(500).end();
                                db.close();
                              }
                              else{
                                db.db('users').collection('stripe_users').findOne({'username':theBand.creator}, (err7, stripe_account)=>{
                                  if (err7){
                                    console.log('There was an error getting connected account out of mongo for user: ' +username+' Error: '+err7);
                                    res.status(500).end();
                                    db.close();
                                  }
                                  else{
                                    var account = stripe_account.stripe_connected_account_id;
                                    var total_amount = Math.trunc(theGig.price*100);
                                    var stripe_amount = (total_amount*0.029)+30;
                                    var dest_amount = total_amount-stripe_amount
                                    var card_src = stripe_customer.src_id;
                                    var descript = 'Payment for artist: '+theBand.name+' for your event: ' +theGig.name+' on ' +theGig.date;
                                    stripe.charges.create({
                                      amount: total_amount,
                                      currency: "usd",
                                      cusotmer: stripe_customer.stripe_id,
                                      description: descript,
                                      transfer_data: {
                                        amount:dest_amount,
                                        destination: account,
                                      },
                                    }).then(function(charge) {
                                      var chageForDB={'charge_id':charge.id, 'amount':charge.amount, 'gigID':gigID, 'transfer':true};
                                      db.db('users').collection('stripe_customers').updateOne({'username':req.session.key}, {$push:{'charges':chageForDB}}, (err8, res8)=>{
                                        if (err8){
                                          console.log('There was an error updating stripe_customer: '+req.session.key+' error: ' +err8);
                                          res.status(500).end();
                                          db.close();
                                        }
                                        else{
                                          res.status(200).send('You will recieve $'+dest_amount+' in the bank account you provided within 48 hours. Great work!');
                                          db.close();
                                        }
                                      });
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                    //moved db bands moving arrays around func
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
      console.log('user tried to send confirm code without being logged in');
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
                var allUpGigs = [];
                var theUpGig=null;
                for (var upGig in result3['upcomingGigs']){
                  if (result3['upcomingGigs'][upGig].gigID==gigID){
                    gigMatches=true;
                    theUpGig=result3['upcomingGigs'][upGig];
                  }
                  else{
                    allUpGigs.push(result3['upcomingGigs'][upGig]);
                  }
                }
                if(gigMatches){
                  if(!(theUpGig.confirmCode==confirmCode)){
                    console.log('Confirm code did not match the one we were looking for in gig send code');
                    res.status(200).send("Sorry, the code your provided did not match the one we were looking for, please try again.");
                    db.close();
                  }
                  else{
                    var newValues2 = {$set:{'confirmed':true}};
                    db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues2, (err4, result4)=>{
                      if (err4){
                        console.log("There was an error trying to modify gig to be confirmed " + err4);
                        res.status(500).end();
                        db.close();
                      }
                      else{
                        console.log("Update band in confirm code gig, result was: " + result4);
                        res.status(200).send('Thank you for submitting the bands confrimation code. We will transfer the appropaite amount into their account when the band sends your confrim code.');
                        db.close();
                      }
                    });
                  }
                }
                else{
                  console.log('Gig id sent with confrim code in gig send confirm code does not match any upcoming gig in bandID sent');
                  res.status(200).send('Sorry, this band seems to not be matched with you.');
                  db.close();
                }
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

  router.post('/decline', (req, res)=>{
    if (!req.session.key){
      console.log('A non logged in user tried to decline an applied band...what?');
      res.status(403).end();
    }
    if (!req.body){
      console.log('A non logged in user tried to decline an applied band...what?');
      res.status(400).end();
    }
    else{
      var {gigID, bandID} = req.body;

      database.connect(db=>{
        db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err2, result2)=>{
          if (err2){
            console.log('There was an error getting gig with: ' + gigID + ' error: '+err2);
            res.status(500).end();
            db.close();
          }
          else{
            var gigApplications=[];
            var appExists = false;
            console.log('gig is : ' + JSON.stringify(result2));
            console.log('gigID : ' + gigID);
            console.log('bandID: ' + bandID);
            for (var key in result2['applications']){
              if (result2['applications'][key]==bandID){
                appExists=true;
              }
              else{
                gigApplications.push(result2['applications'][key]);
              }
            }
            if (appExists){
              var newValues = {$set:{'applications':gigApplications}};
              db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues, (err3, result3)=>{
                if (err3){
                  console.log('There was an error trying to add band: ' + bandID+' to gigs applications: '+gigID+' error: ' + err3);
                  res.status(500).send();
                  db.close();
                }
                else{
                  console.log('Removed band: ' + bandID + 'from gig with id: ' + gigID);
                }
              });
              db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err6, result6)=>{
                if(err6){
                  console.log('There was an error getting band: ' + bandID +' out of mongo, ' + err6);
                  res.status(500).send();
                  db.close();
                }
                else{
                  var gigsApped = [];
                  for (var theG in result6['appliedGigs']){
                    if(result6['appliedGigs'][theG][0]==gigID){
                      result6['appliedGigs'][theG][1]=true;
                      gigsApped.push(result6['appliedGigs'][theG]);
                    }
                    else{
                      gigsApped.push(result6['appliedGigs'][theG]);
                    }
                  }
                  var newValues3={$set:{'appliedGigs':gigsApped}};
                  db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, newValues3, (err4, result4)=>{
                    if (err4){
                      console.log('THere was an error updating appliedGigs denied for gig id: ' + gigID + 'and band id: ' + bandID+' the error: ' +err4);
                      res.status(500).send();
                      db.close();
                    }
                    else{
                      console.log('Chnaged upcoming gig: ' + gigID+ ' in band: ' + bandID+' to true in the second array postion, indicates its denied');
                      res.status(200).send();
                      db.close();
                    }
                  });
                }
              });
            }
            else{
              console.log('A user tried to decline a gig that was not in their applicants');
              res.status(200).send('You cannot decline a band that is no applied to your event');
              db.close();
            }
          }
        });
      }, err=>{
        console.log('THere was error trying to connect to mongo, error: '+err);
        res.status(500).send();
      });
    }
  });


  router.post('/cancel', (req, res)=>{
    if (!req.session.id){
      console.log('No logged in user tried to post to cancel');
      res.status(403).send();
    }
    if (!req.body){
      res.status(400).send();
    }
    else{
      database.connect(db=>{
        var {bandID, gigID, whoCanceled} = req.body;
        db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err2, result2)=>{
          if (err2){
            console.log('There was an error getting band with ID' + bandID + ' put of the mongo');
            res.status(500).send();
            db.close();
          }
          else{
            var myBand = result2;
            var gigExists = false;
            for (var g in myBand.upcomingGigs){
              if (myBand.upcomingGigs[g]['gigID']==gigID){
                gigExists=true;
              }
            }
            if (!gigExists){
              console.log('in cancel, band with id: '+bandID+' does not have the gig with id : '+gigID+' in its upcomingGigs');
              res.status(403).send();
              db.close();
            }
            else{
              db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err3, result3)=>{
                if (err3){
                  console.log('THere was an error getting gig with id: ' +gigID+' out of mongo. ' + err3);
                  res.status(500).send();
                  db.close();
                }
                else{
                  var myGig = result3;
                  console.log('myGig is : '+ JSON.stringify(myGig));
                  if (!(myGig['bandFor']==bandID)){
                    console.log('In cancel, the gig with id: ' +gigID+ ' did not have band with id: ' + bandID+' as its band for.');
                    res.status(403).send();
                    db.close();
                  }
                  else{
                    // do eveything
                    var now = new Date();
                    var gigStartDate = myGig['date'];
                    console.log('gigStartDate is : ' + gigStartDate);
                    var gigStartTime = myGig['startTime'];
                    console.log('gigStartTime is : ' + gigStartTime);
                    var dateArr = gigStartDate.split('-');
                    dateArr[1]=parseInt(dateArr[1])-1;
                    var timeArr = gigStartTime.split(':');
                    var gigDate = new Date(dateArr[0], dateArr[1], dateArr[2],timeArr[0], timeArr[1]);
                    //"startTime":"03:22","price":"222","date":"2019-04-25"
                    var timeDiff = diff_hours(now, gigDate)
                    var cancelFee=null
                    if (timeDiff>=24){
                      cancelFee=false;
                    }
                    else{
                      cancelFee=true;
                    }
                    console.log('Cancel fee is : ' + cancelFee);
                    var newValues = {$set:{'isFilled':false, 'bandFor':'none'}};
                    var applicants = [];
                    var appsWithOutMyBand = [];
                    for (var ap in myGig['applications']){
                      applicants.push({'_id':database.objectId(myGig['applications'][ap])});
                      if (myGig['applications'][ap]==bandID){
                        continue;
                      }
                      else{
                        appsWithOutMyBand.push(myGig['applications'][ap]);
                      }
                    }
                    if (whoCanceled=='band'){
                      newValues = {$set:{'isFilled':false, 'bandFor':'none', 'applications':appsWithOutMyBand}};
                    }
                    db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, newValues, (err4, result4)=>{
                      if (err4){
                        console.log('THere was an error resetting the gig with id : ' + gigID+' to be open. Error: '+ err4);
                        res.status(500).send();
                        db.close();
                      }
                      else{
                        for (var upGig in myBand.upcomingGigs){
                          if (myBand.upcomingGigs[upGig]['gigID']==gigID){
                              myBand.upcomingGigs[upGig]['canceled']=true;
                            }
                          }
                          var newValues2 = null;
                          if (whoCanceled=='band' && cancelFee){
                            var noShows = 0;
                            var numRatings = parseInt(myBand['numRatings']);
                            if (myBand['noShows']==null || myBand['noShows']==0){
                              noShows=1;
                            }
                            else{
                              noShows=parseInt(myBand['noShows'])+1;
                            }
                            if (myBand['numRatings']==null || myBand['numRatings']==0){
                              numRatings=1;
                            }
                            else{
                              numRatings=parseInt(myBand['numRatings'])+1;
                            }
                            var showedUp = numRatings-noShows;
                            var perShowsUp = showedUp/numRatings;
                            newValues2 = {$set:{'upcomingGigs':myBand.upcomingGigs, 'noShows':noShows, 'showsUp':perShowsUp}};
                          }
                          else{
                            newValues2 = {$set:{'upcomingGigs':myBand.upcomingGigs}};
                          }

                          db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)}, newValues2, (err5, result5)=>{
                            if (err5){
                              console.log('There was an error updating band with id: ' + bandID+' to have gig with ID : ' + gigID+' be canceled.' + err5);
                              res.status(500).send("Internal server error.");
                              db.close();
                            }
                            if (applicants.length==0 || applicants==null){
                              console.log('There were no other applicants to update for gig with id: ' + gigID);
                              if (!cancelFeel){
                                db.db('users').collection('stripe_customers').findOne({'username':req.session.key}, (mongo_customer_error, stripe_customer)=>{
                                  if (mongo_customer_error){
                                    console.log('There was an error in the refund proccess, canceling.')
                                    console.log('mongo_customer_error: ' + mongo_customer_error);
                                    res.status(500).end();
                                  }
                                  else{
                                    var theCharge=null;
                                    console.log('the stripe customer is: ' + JSON.stringify(stripe_customer));
                                    console.log('ThE gigID from req is: ' + gigID);
                                    var otherCharges=[];
                                    for (var charge in stripe_customer.charges){
                                      if (stripe_customer.charges[charge].gigID == gigID){
                                          console.log('On charge with gigID: '+ stripe_customer.charges[charge].gigID);
                                          theCharge=stripe_customer.charges[charge]
                                      }
                                      else{
                                        otherCharges.push(stripe_customer.charges[charge]);
                                      }
                                    }
                                    if (theCharge){
                                      console.log('The charge is : ' + JSON.stringify(theCharge));
                                      if (theCharge.refunded){
                                        res.status(200).send('You cannot refund a charge that has already been refunded');
                                        db.close();
                                      }
                                      else{
                                        console.log('Will give gig with id: ' + gigID + 'refund becuse they cancelled within')
                                        theCharge.refunded=true;
                                        otherCharges.push(theCharge);
                                        stripe.refunds.create({
                                          charge:theCharge.charge_id,
                                          amount: theCharge.amount,
                                        }).then(function(refund){
                                          console.log("REFUND");
                                          console.log('Gave refund to username: ' + req.session.key + ' for amount: '+theCharge.amount);

                                          db.db('users').collection('stripe_customers').updateOne({'username':req.session.key}, {$set:{'charges':otherCharges}}, (update_charges_error, result15)=>{
                                            if (update_charges_error){
                                              console.log('There was an error trying to update stripe user: ' + req.session.key + ' to have charge: '+ theCharge.charge_id + ' be refunded. ' + update_charges_error)
                                              res.status(500).end();
                                              db.close();
                                            }
                                            else{
                                              res.status(200).send('You have been issued a refund for this event! You will see the full amount in your bank account within one week.')
                                              db.close();
                                            }
                                          });

                                        });
                                      }
                                    }
                                    else{
                                      res.status(200).send('There was no charge for that gig recorded');
                                      db.close();
                                    }
                                  }
                                });
                              }
                            }
                            else{
                              db.db('bands').collection('bands').find({$or:applicants}).toArray((err7, result7)=>{
                                if (err7){
                                  console.log('Faild to get the batch of denied bands ' +err7);
                                  res.status(500).end();
                                  db.close();
                                }
                                var on = 0;
                                if (result7.length<=0){
                                  console.log('Applicants had positive legnth but mongo got none out with the supplied ids: ' + JSON.stringify(applicants));
                                  res.status(500).end();
                                  db.close();
                                }
                                else{
                                result7.forEach(bandOn=>{
                                  on+=1;
                                  var nonDeniedGigs=[];
                                  for (var gigAppliedTo in bandOn['appliedGigs']){
                                    if (bandOn['appliedGigs'][gigAppliedTo][0]==gigID){
                                      bandOn['appliedGigs'][gigAppliedTo][1]=false;
                                      nonDeniedGigs.push(bandOn['appliedGigs'][gigAppliedTo]);
                                    }
                                    else{
                                      nonDeniedGigs.push(bandOn['appliedGigs'][gigAppliedTo]);
                                    }
                                  }
                                  var newValues7 = {$set:{'appliedGigs':nonDeniedGigs}};
                                  db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandOn['_id'])}, newValues7, (err8, res8)=>{
                                    if (err8){
                                      console.log('THere was an error updating one of the denied bands: ' + bandOn['_id']+' Error: '+err8);
                                      res.status(500).end();
                                      db.close();
                                    }
                                    else{
                                      console.log('On is...' + on);
                                      if (on>=result7.length){
                                        if (whoCanceled=='gig'){
                                          if (!cancelFee){
                                        //    console.log('Charging fee ($5) to gig with id : ' + gigID + ' becuase cancel came late and was on beahlf of the gig.');
                                            //stripe charge account asscoiated with gig $5 + stripe fee + our fee
                                            //refund
                                            db.db('users').collection('stripe_customers').findOne({'username':req.session.key}, (mongo_customer_error, stripe_customer)=>{
                                              if (mongo_customer_error){
                                                console.log('There was an error in the refund proccess, canceling.')
                                                console.log('mongo_customer_error: ' + mongo_customer_error);
                                                res.status(500).end();
                                              }
                                              else{
                                                var theCharge=null;
                                                console.log('the stripe customer is: ' + JSON.stringify(stripe_customer));
                                                console.log('ThE gigID from req is: ' + gigID);
                                                var otherCharges=[];
                                                for (var charge in stripe_customer.charges){
                                                  if (stripe_customer.charges[charge].gigID == gigID){
                                                      console.log('On charge with gigID: '+ stripe_customer.charges[charge].gigID);
                                                      theCharge=stripe_customer.charges[charge]
                                                  }
                                                  else{
                                                    otherCharges.push(stripe_customer.charges[charge]);
                                                  }
                                                }
                                                if (theCharge){
                                                  console.log('The charge is : ' + JSON.stringify(theCharge));
                                                  if (theCharge.refunded){
                                                    res.status(200).send('You cannot refund a charge that has already been refunded');
                                                    db.close();
                                                  }
                                                  else{
                                                    console.log('Will give gig with id: ' + gigID + 'refund becuse they cancelled within 2 days.');
                                                    theCharge.refunded=true;
                                                    otherCharges.push(theCharge);
                                                    stripe.refunds.create({
                                                      charge:theCharge.charge_id,
                                                      amount: theCharge.amount,
                                                    }).then(function(refund){
                                                      console.log("REFUND");
                                                      console.log('Gave refund to username: ' + req.session.key + ' for amount: '+theCharge.amount);
                                                      db.db('users').collection('stripe_customers').updateOne({'username':req.session.key}, {$set:{'charges':otherCharges}}, (update_charges_error, result15)=>{
                                                        if (update_charges_error){
                                                          console.log('There was an error trying to update stripe user: ' + req.session.key + ' to have charge: '+ theCharge.charge_id + ' be refunded. ' + update_charges_error)
                                                          res.status(500).end();
                                                          db.close();
                                                        }
                                                        else{
                                                          res.status(200).send('You have been issued a refund for this event! You will see the full amount in your bank account within one week.')
                                                          db.close();
                                                        }
                                                      });
                                                    });
                                                  }
                                                }
                                                else{
                                                  res.status(200).send('There was no charge for that gig recorded');
                                                  db.close();
                                                }



                                              }

                                            })

                                          }

                                        }
                                        if (whoCanceled=='band'){
                                          console.log('Band canceled inside of applicant for each loop');
                                          res.status(200).send('You canceled on this band with no penalty, please notify them with our messaging feature.');
                                          db.close();
                                        }
                                        if (whoCanceled != 'band' && whoCanceled != 'gig'){
                                          console.log('Who canceled was not band or gig, error.');
                                          res.status(400).end();
                                          db.close();
                                        }
                                      }
                                    }
                                  });
                                });
                              }
                              });
                            }
                            /*
                            if (whoCanceled=='gig'){
                              if (cancelFee){
                                console.log('Charging fee ($5) to gig with id : ' + gigID + ' becuase cancel came late and was on beahlf of the gig.');
                                //stripe charge account asscoiated with gig $5 + stripe fee + our fee

                                // for now:
                                res.status(200).send('You canceled this gig within 24 hours of its start time and date. The card associated with this account was charged {fee}');
                              //  db.close();
                              }
                              else{
                                console.log('Gig canceled and there was no fee or errors.')
                                res.status(200).send('You canceled the event with no penality.');
                              //  db.close();
                              }
                            }
                            if (whoCanceled=='band'){
                              res.status(200).send('You canceled on this band with no penalty, please notify them with our messaging feature.');
                            //  db.close();
                            }
                            if (whoCanceled != 'band' && whoCanceled != 'gig'){
                              console.log('Who canceled was not band or gig, error.');
                              res.status(400).end();
                              //db.close();
                            }
                            */
                          });
                        }
                      });
                  }
                }
              });
            }
          }
        });
      }, err=>{
        console.log('There was an error connecting to mongo Error: ' + err);
        res.status(500).end();
      });

    }
  });

router.post('/flake', (req, res)=>{
  if (!req.body){
    console.log('Recieved empty req at flake.')
    res.stataus(401).end();
  }
  if (!req.session.key){
    console.log('No logged in user tried to say a band flaked.')
    res.status(404).end();
  }
  else{
    var {gigID, bandID} = req.body;
    database.connect(db=>{
      db.db('gigs').collection('gigs').findOne({'_id':database.objectId(gigID)}, (err2, theGig)=>{
        if (err2){
          console.log('There was an error findng gig with id: ' + gigID);
          res.status(500).end();
          db.close();
        }
        else{
          if (!theGig.isFilled){
            console.log('Gig tried to say it flaked but was not filled. gigID: ' + gigID);
            res.status(200).send('you cannot say a band flaked if the event was unfilled.');
            db.close();
          }
          if (!(theGig.bandFor==bandID)){
            console.log('Gig tried to say band: '+bandID+' flaked but was not this band was not matched with this gig. gigID: ' + gigID);
            res.status(200).send('Sorry, that band could not have flaked as it was not matched with that event.');
            db.close();
          }
          var now = new Date();
          var gigDateStr = theGig.date;
          var gigEndTime = theGig.endTime;
          var dateArr = gigDateStr.split('-');
          dateArr[1]=parseInt(dateArr[1])-1;
          var timeArr = gigEndTime.split(':');
          var gigDate = new Date(dateArr[0], dateArr[1], dateArr[2],timeArr[0], timeArr[1]);
          if (diff_hours(now, gigDate)<0){
            console.log('Gig attempted to say a band flaked but the gig has no ended yet.');
            res.status(200).send('Sorry, a band can only "flake" once the event has ended.');
            db.close();
          }
          else{
            db.db('bands').collection('bands').findOne({'_id':database.objectId(bandID)}, (err3, theBand)=>{
              if (err3){
                console.log("There was an error getting abnd with id: " + bandID + ' Out of mongo. ' + err3);
                res.status(500).end();
                db.close();
              }
              else{
                var gigExistsInBand = false;
                var bandSentConfirm = false;
                var allUpGigs = [];
                for (var upGig in theBand.upcomingGigs){
                  if(theBand.upcomingGigs[upGig].gigID==gigID){
                    if (theBand.upcomingGigs[upGig].confirmed){
                      bandSentConfirm=true;
                    }
                    gigExistsInBand=true;
                  }
                  else{
                    allUpGigs.push(theBand.upcomingGigs[upGig]);
                  }
                }
                if (!gigExistsInBand){
                  console.log('The band:'+bandID+' did not have this gig: '+gigID+' in its array. ');
                  res.status(200).send('Sorry, this band was not aware of your event.');
                  db.close();
                }
                else{
                  if(bandSentConfirm){
                    if(theGig.confirmed){
                      console.log('both sent confrims but gig: '+gigID+' said the band: '+bandID+'flaked, gig is lying or they trying to scam us. No refund, should have transfered.')
                      res.status(200).send('Recived confirms codes, band could not have flaked if our system was followed. Sorry, we will not be giving a refund. Will be proceeding with money transfer of: ' +theGig.price+ 'to the band: ' + theBand.name);
                      db.close();
                    }
                    else{
                      //the band sent its confirm, gig didnt = gig sketch
                      console.log('the band: '+bandID+' sent its confirm, gig: '+gigID+' didnt. Will not being giving refund, should have transfered cash already to band.');
                      res.status(200).send('The band: '+theBand.name+' sent the confirmation code we sent you. They could have only gotten this from you, so we will not be giving s refund. Sorry, do not send bands your confirmation code until they show up for the event.')
                      db.close();
                    }
                  }
                  else{
                    if(theGig.confirmed){
                      //the gig sent band's code but band has not-- band sketch
                      console.log('the gig: '+gigID+' sent its confirm, band: '+bandID+' didnt. Will not being giving refund, will not transfer funds to band.');
                      var noShows = parseInt(theBand.noShows)+1.0;
                      var numRatings = parseInt(theBand.numRatings)+1.0;
                      var percentShows = (numRatings-noShows)/numRatings;

                      var newValues = {$set:{'noShows':noShows, 'numRatings':numRatings, 'upcomingGigs': allUpGigs}, $push:{'finishedGigs':{'gigID':gigID, 'flaked':true, 'paid':false}}};

                      db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)},newValues, (err6, res6)=>{
                        if (err6){
                          console.log('There was an error updating band with id: ' + bandID + ' error was: ' + err6);
                          res.status(500).end();
                          db.close();
                        }
                        else{
                          db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, {$set:{'confirmed':true}}, (err7, res7)=>{
                            if(err7){
                              console.log('Failed to update gigs: '+gigID);
                              res.status(500).end();
                              db.close();
                            }
                            else{
                              console.log('Updated band and gig, no refund.');
                              res.status(200).send('We have adjusted the bands relability rating accordingly with your report. Thank you.');
                              db.close();
                            }
                          });
                        }
                      });

                    }
                    else{
                      //niether sent confirms -- band flaked.
                      //stripe refund
                      //updateBand as flaked
                      console.log('Niether confirmed. Band: '+bandID+' flaked. Will give refund.');
                      db.db('users').collection('stripe_customers').findOne({'username':req.session.key}, (err4, stripe_customer)=>{
                        if (err4){
                          console.log('There was an error finding stripe customer with username: '+req.session.key+ err4);
                          res.status(500).end();
                          db.close();
                        }
                        else{
                          var theCharge = null;
                          var allCharges = [];
                          for (var charge in stripe_customer.charges){
                            if (stripe_customer.charges[charge].gigID == gigID){
                              if (!stripe_customer.charges[charge].refunded){
                                theCharge=stripe_customer.charges[charge];
                                theCharge.refunded=true;
                                allCharges.push(theCharge);
                              }
                              else{
                                allCharges.push(stripe_customer.charges[charge]);
                              }
                            }
                          }
                          if (!theCharge){
                            console.log('we coudl not find the charge');
                            res.status(500).end();
                            db.close();
                          }
                          else{
                            stripe.refunds.create({
                              charge:theCharge.charge_id,
                              amount: theCharge.amount,
                            }).then(refund=>{
                              console.log('Gave refund to user: ' + req.session.key);
                              db.db('users').collection('stripe_users').updateOne({'username':req.session.key}, {$set:{'charges':allCharges}}, (err5, res5)=>{
                                if (err5){
                                  console.log('There was an error updating stripe_user: '+req.session.key+err5);
                                  res.status(500).end();
                                  db.close();
                                }
                                else{
                                  //flake on band
                                  var noShows = parseInt(theBand.noShows)+1.0;
                                  var numRatings = parseInt(theBand.numRatings)+1.0;
                                  var percentShows = (numRatings-noShows)/numRatings;

                                  var newValues = {$set:{'noShows':noShows, 'numRatings':numRatings, 'upcomingGigs': allUpGigs}, $push:{'finishedGigs':gigID}};

                                  db.db('bands').collection('bands').updateOne({'_id':database.objectId(bandID)},newValues, (err6, res6)=>{
                                    if (err6){
                                      console.log('There was an error updating band with id: ' + bandID + ' error was: ' + err6);
                                      res.status(500).end();
                                      db.close();
                                    }
                                    else{
                                      db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(gigID)}, {$set:{'confirmed':true}}, (err7, res7)=>{
                                        if(err7){
                                          console.log('Failed to update gigs: '+gigID);
                                          res.status(500).end();
                                          db.close();
                                        }
                                        else{
                                          console.log('Updated band and gig, gave refund.');
                                          res.status(200).send('We have refunded you: ' + theCharge.amount + ' and adjusted the bands relability rating accordingly with your report. Thank you.');
                                          db.close();
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            });
                          }
                        }
                      });

                    }
                  }
                }
              }
            });
          }


        }
      });

    }, err=>{
      console.log('THere was an error connecting to db: ' + err);
      res.status(500).end();
    });
  }
})
function createBandConfirmCode(gigID, bandID){
  var x = Math.random();
  var y = Math.random();
  var code = Math.random(x).toString(36).replace('0.', '');
  code += "Zk!ks31l"
  code += Math.random(y).toString(36).replace('0.', '');
  console.log('Random Code: ' + code);
  return code;
}

function diff_hours(dt1, dt2) {
  //var dt1 = new Date(dt1Str);
//  var dt2 = new Date(dt2Str);
  console.log("in diff mins on alg page and dt2 is : " + dt2 + "and dt1 is : " + dt1);
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  console.log("diff is : " + diff);
  diff /= 3600;
  console.log("diff is : " + diff);
  return Math.abs(Math.round(diff));
 }

 function sendConfirmEmails(db, band, bandCodeToGig, gig, gigCodeToBand, req, cb){
   console.log('In send confirm email vars: '+band+gig+req);
   db.db('users').collection('users').findOne({'username':req.session.key}, (err_find, accept_user)=>{
     if (err_find){
       console.log('THere was an error finding accept user: ' + req.session.key);
       cb(err_find)
     }
     else{
       var band_creator = band.creator;
       db.db('users').collection('users').findOne({'username':band_creator}, (err_find2, applier_user)=>{
         if (err_find2){
           console.log('There was an error finding band user: ' + band_creator);
           cb(err_find2)
         }
         else{
           var acceptor_email = accept_user.email;
           var applier_email = applier_user.email;
           sendAConfirmEmail(acceptor_email, true, sendind_error=>{
             if (sendind_error){
               console.log('Got callback error from send a confrim: ' + sending_error);
               cb(sendind_error)
             }
             else{
               console.log('A confirm email was sent to: ' + acceptor_email+ ' about to send second email to applier');
               sendAConfirmEmail(applier_email, false, sendind_error2=>{
                 if (sendind_error2){
                   console.log('Got callback error from send a confrim (second call): ' + sending_error2);
                   cb(sendind_error2)
                 }
                 else{
                   console.log('A confirm email was sent to: ' + acceptor_email+ ' about to send second email to applier');
                   cb();
                 }
               });
             }
           });
         }
       });
     }
   });
 }
  function sendAConfirmEmail(address, acceptor, cb){
     console.log('In sendAConfirmEmail and address is:  ' +address);
     let transporter = nodeMailer.createTransport({
         host: 'smtpout.secureserver.net', // go daddy email host port
         port: 465, // could be 993
         secure: true,
         auth: {
             user: 'xxx@xx.com',
             pass: 'xxxxx'
         }
     });
     let mailOptions = {};
     if (acceptor){
        mailOptions = {
           from: OUR_ADDRESS, // our address
           to: address, // who we sending to
           subject: req.body.subject, // Subject line
           text: req.body.body, // plain text body
           html: '<b>TEST TEST TEST</b>' // html body
       };
       transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
              console.log('There was an error sending the email: ' + error);
              cb(error);
           }
           console.log('Message %s sent: %s', info.messageId, info.response);
              cb();
         });
     }
     else{
        mailOptions = {
           from: OUR_ADDRESS, // our address
           to: address, // who we sending to
           subject: req.body.subject, // Subject line
           text: req.body.body, // plain text body
           html: '<b>TEST TEST TEST</b>' // html body
       };
       transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
              console.log('There was an error sending the email: ' + error);
              cb(error);
           }
           console.log('Message %s sent: %s', info.messageId, info.response);
              cb();
        });
     }
  }

}
