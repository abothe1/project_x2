module.exports = router =>{
  const database = require('../database.js');
  const allowed_users = {"alexander_bothe":'N5gdakxq9!', "eli_levin":"akira2016", "max_schmitz":"Blue12#$", "miccah_round":"cheese12345", "AB_Brooks":"ABTheTeaBandit"}
  router.get('/count', (req, res)=>{
    console.log('Got count request')
    if (!req.query){
      res.status(401).end();
    }
    var {username, password, data_type, filter, filter_crit} = req.query
    console.log('Query: ' + JSON.stringify(req.query));
    if (!allowed_users.hasOwnProperty(username)){
      res.status(404).end();
    }
    else{
      if (allowed_users[username] != password){
        res.status(404).end();
      }
      else{
        database.connect(db=>{
          switch(data_type){
            case "gigs":
            findGigCount(db, filter, filter_crit, (count_error, res3)=>{
              if(count_error){
                res.status(500).end();
                db.close();
              }
              else{
                res.status(200).send({body:res3});
                db.close();
              }
            });
            break
            case "bands":
            findBandCount(db, filter, filter_crit, (count_error, res3)=>{
              if(count_error){
                res.status(500).end();
                db.close();
              }
              else{
                res.status(200).send({body:res3});
                db.close();
              }
            });
            break
            case "transactions":
            findTransCount(db, filter, filter_crit, (count_error, res3)=>{
              if(count_error){
                res.status(500).end();
                db.close();
              }
              else{
                res.status(200).send({body:res3});
                db.close();
              }
            });
            break
            case "users":
            findUserCount(db, filter, filter_crit, (count_error, res3)=>{
              if(count_error){
                res.status(500).end();
                db.close();
              }
              else{
                console.log('Res is: ' + res3)
                res.status(200).send({body:res3});
                db.close();
              }
            });
            break
            default:
            res.status(401).send("The data type you submitted, does not match any of database we have.");
            db.close();
            break;
          }
        }, err=>{
          console.log('There was an error connectiong to mongo: ' + err);
        })
      }
    }
  });

  function findGigCount(db, filter, filter_crit, cb){
    switch(filter){
      case "none":
      db.db('gigs').collection('gigs').count().then(count=>{
        console.log('Number of gigs is: ' + count);
        cb(null,count)
      });
      break;
      case "price":
      db.db('gigs').collection('gigs').find({'price':{$gt:filter_crit}}).toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding gigs with '+filter+' = '+filter_crit);
          cb(err2, null);
        }
        else{
          console.log('Got gigs out of db with filter: ' +filter+' = ' +filter_crit);
          cb(null, res2.length);
        }
      });
      break;
      case "zipcode":
      db.db('gigs').collection('gigs').find({'zipcode':filter_crit}).toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding gigs with '+filter+' = '+filter_crit);
          cb(err2, null);
        }
        else{
          console.log('Got gigs out of db with filter: ' +filter+' = ' +filter_crit);
          cb(null, res2.length);
        }
      });
      break;

      case "description":
      db.db('gigs').collection('gigs').find().toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding bands with confirmed true: ' + err2);
          cb(err2, null);
        }
        else{
          var allMatchers = [];
          for (var gig in res2){
            var aGig = res2[gig];
            if (aGig.description.includes(filter_crit)){
              allMatchers.append(aGig);
            }
          }
          cb(null, allMatchers.length);
        }
      });
      break;

      default:
      console.log('Unrecongized filter');
      cb("Unrecongized filter", null);
      break;
    }
  }
  function findBandCount(db, filter, filter_crit, cb){
    switch(filter){
      case "none":
      db.db('bands').collection('bands').count().then(count=>{
        console.log('Number of bands is: ' + count);
        cb(null,count)
      });
      break;
      case "price":
      db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding bands with '+filter+' = '+filter_crit);
          cb(err2, null);
        }
        else{
          console.log('Got bands out of db with filter: ' +filter+' = ' +filter_crit);
          cb(null, res2.length);
        }
      });
      break;
      case "zipcode":
      db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding bands with '+filter+' = '+filter_crit);
          cb(err2, null);
        }
        else{
          console.log('Got bands out of db with filter: ' +filter+' = ' +filter_crit);
          cb(null, res2.length);
        }
      });
      break;
      case "maxDist":
      db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding bands with '+filter+' = '+filter_crit);
          cb(err2, null);
        }
        else{
          console.log('Got bands out of db with filter: ' +filter+' = ' +filter_crit);
          cb(null, res2.length);
        }
      });
      break;
      case "description":
      db.db('bands').collection('bands').find().toArray((err2, res2)=>{
        if (err2){
          console.log('There was an error finding bands with confirmed true: ' + err2);
          cb(err2, null);
        }
        else{
          var allMatchers = [];
          for (var band in res2){
            var aBand = res2[band];
            if (aBand.description.includes(filter_crit)){
              allMatchers.append(aBand);
            }
          }
          cb(null, allMatchers.length);
        }
      });
      break;
      default:
      console.log('Unrecongized filter');
      cb("Unrecongized filter", null);
      break;
    }
  }
  function findTransCount(db, filter, filter_crit, cb){
    if (filter=="none"){
      db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray(function(err2, res2){
        if(err2){
          console.log('There was an error finding filled gigs');
          cb(err2,null);
        }
        else{
          console.log('Number of confirmed gigs is: ' + res2.length);
          cb(null, res2.legnth)
        }
      });
    }
    else{
      switch(filter){
        case "price":
        db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}, 'price':{$gt:filter_crit}}).toArray((err2, res2)=>{
          if (err2){
            console.log('There was an error trying to find gigs with confirmed true and price >' + filter_crit);
            cb(err2, null)
          }
          else{
            cb(null, res2.length);
          }
        });
        break;

        case "zipcode":
        db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}, 'zipcode':filter_crit}).toArray((err2, res2)=>{
          if (err2){
            console.log('There was an error trying to find gigs with confirmed true and price >' + filter_crit);
            cb(err2, null)
          }
          else{
            cb(null, res2.length);
          }
        });
        break;

        case "description":
        db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray((err2, res2)=>{
          if (err2){
            console.log('There was an error finding bands with confirmed true: ' + err2);
            cb(err2, null);
          }
          else{
            var allMatchers = [];
            for (var gig in res2){
              var aGig = res2[gig];
              if (aGig.description.includes(filter_crit)){
                allMatchers.append(aGig);
              }
            }
            cb(null, allMatchers.length);
          }
        });
        break;

        default:
        console.log('User submitted a filter we dont recognize');
        cb("We do not recognize that fitler", null);
        break;
      }
    }
  }


  function findUserCount(db, filter, filter_crit, cb){
    if (filter=="none"){
      db.db('users').collection('users').count().then(count=>{
        console.log('Number of users is: ' + count);
        cb(null, count);
      });
    }
    else{
      cb("Filter: " + filter+" not currenlty supported.", null);
    }

  }

  router.get('/average', (req, res)=>{
    if (!req.query){
      res.status(401).end();
    }
    var {username, password, data_type, data_to_avg, filter, filter_crit} = req.query
    if (!allowed_users.hasOwnProperty(username)){
      res.status(404).end();
    }
    else{
      if (allowed_users[username] != password){
        res.status(404).end();
      }
      else{
        database.connect(db=>{
          switch(data_type){
            case "users":
              getAvgUsers(db, data_to_avg, filter, filter_crit, (avg_error, avg)=>{
                if(avg_error){
                  res.status(500).end()
                  db.close();
                }
                else{
                  res.status(200).send({body:avg})
                  db.close();
                }
              });
            break;
            case "gigs":
            getAvgGigs(db, data_to_avg, filter, filter_crit, (avg_error, avg)=>{
              if(avg_error){
                res.status(500).end()
                db.close();
              }
              else{
                res.status(200).send({body:avg})
                db.close();
              }
            });
            break;
            case "bands":
            getAvgBands(db, data_to_avg, filter, filter_crit, (avg_error, avg)=>{
              if(avg_error){
                res.status(500).end()
                db.close();
              }
              else{
                res.status(200).send({body:avg})
                db.close();
              }
            });
            break;
            case "transactions":
            getAvgTransactions(db, data_to_avg, filter, filter_crit, (avg_error, avg)=>{
              if(avg_error){
                res.status(500).end()
                db.close();
              }
              else{
                res.status(200).send({body:avg})
                db.close();
              }
            });
            break;
            default:
            console.log('Unrecongized data type: ' + data_type)
            res.status(401).end();
            db.close();
            break;
          }
        }, err=>{
          console.log('There was an error connectiong to mongo: ' + err);
          res.status(500).end();
        });

      }
    }
  });

  function getAvgUsers(db, data_to_avg, filter, filter_crit, cb){
    switch(data_to_avg){
      case "bands":
        if(filter=="none"){
          db.db('users').collection('users').count(count=>{
            db.db('bands').collection('bands').count(band_count=>{
              var avg_bands_per_user = band_count/count;
              cb(null, avg_bands_per_user)
            });
          });
        }
        else{
          cb("Sorry we do not support filters for users yet.", null)
        }
      break;
      case "gigs":
      if(filter=="none"){
        db.db('users').collection('users').count(count=>{
          db.db('gigs').collection('gigs').count(band_count=>{
            var avg_bands_per_user = band_count/count;
            cb(null, avg_bands_per_user)
          });
        });
      }
      else{
        cb("Sorry we do not support filters for users yet.", null)
      }
      break;
      case "completed_gigs":
      if(filter=="none"){
        db.db('users').collection('users').count(count=>{
          db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray((err2, res2)=>{
            var avg_bands_per_user = res2.length/count;
            cb(null, avg_bands_per_user)
          });
        });
      }
      else{
        cb("Sorry we do not support filters for users yet.", null)
      }
      break;
      case "revenue":
      if(filter=="none"){
        db.db('users').collection('users').count(count=>{
          db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray((err2, res2)=>{
            var total_price=0
            for (var g in res2){
              total_price+=res2[g].price
            }
            var banda_rev = total_price*.05
            var avg_rev_user = banda_rev/count;
            cb(null, avg_rev_user)
          });
        });
      }
      else{
        cb("Sorry we do not support filters for users yet.", null)
      }
      break;

      default:
      cb("Sorry we do not support that type of average yet", null);
      break;
    }
  }
  function getAvgTransactions(db, data_to_avg, filter, filter_crit, cb){
    findTransCount(db, filter, filter_crit, (count_error, count)=>{
      if (count_error){
        cb(count_error, null)
      }
      else{
        switch(data_to_avg){
          case "price":
          switch(filter){
            case "price":
            db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}, 'price':{$gt:filter_crit}}).toArray((err4, res4)=>{
              if (err4){
                console.log('There was an error finding confirmed gigs: ' + err4);
                cb(err4, null)
              }
              else{
                var total_price = 0;
                for (var gig in res4){
                  total_price+=parseInt(res4[gig].price)
                }
                var avg_price = total_price/count;
                cb(null, avg_price);
              }
            });
            break;
            case "zipcode":
            db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}, 'zipcode':filter_crit}).toArray((err4, res4)=>{
              if (err4){
                console.log('There was an error finding confirmed gigs: ' + err4);
                cb(err4, null)
              }
              else{
                var total_price = 0;
                for (var gig in res4){
                  total_price+=parseInt(res4[gig].price)
                }
                var avg_price = total_price/count;
                cb(null, avg_price);
              }
            });
            break;
            case "description":
            db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray((err4, res4)=>{
              if (err4){
                console.log('There was an error finding confirmed gigs: ' + err4);
                cb(err4, null)
              }
              else{
                var total_price = 0;
                for (var gig in res4){
                  if (res4[gig].description.includes(filter_crit)){
                    total_price+=parseInt(res4[gig].price)
                  }
                }
                var avg_price = total_price/count;
                cb(null, avg_price);
              }
            });
            break;
            case "none":
            db.db('gigs').collection('gigs').find({'confirmed':{$eq:true}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb("We did not recognize that filter", null)
            break;

          }
          break;
          default:
          cb("We did not recognize that avg", null);
          break;
        }
      }
    });
  }
  function getAvgGigs(db, data_to_avg, filter, filter_crit, cb){
    findGigCount(db, filter, filter_crit, (count_error, count)=>{
      if(count_error){
        cb(count_error, null);
      }
      else{
        switch(data_to_avg){
          case "price":
          switch(filter){
            case "price":
            db.db('gigs').collection('gigs').find({'price':{$gt:filter_crit}}).toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  totalPrice+=parseInt(res5[gig].price)
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "zipcode":
            db.db('gigs').collection('gigs').find({'zipcode':filter_crit}).toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  totalPrice+=parseInt(res5[gig].price)
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "description":
            db.db('gigs').collection('gigs').find().toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  if (res5[gig].description.inlcudes(filter_crit)){
                    totalPrice+=parseInt(res5[gig].price)
                  }
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "none":
            db.db('gigs').collection('gigs').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry, we do not support that filter currently', null)
            break;

          }
          break;
          case "applicants":
          switch(filter){
            case "price":
            db.db('gigs').collection('gigs').find({'price':{$gt:filter_crit}}).toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  totalPrice+=res5[gig].applications.length
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "zipcode":
            db.db('gigs').collection('gigs').find({'zipcode':filter_crit}).toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  totalPrice+=res5[gig].applications.length
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "description":
            db.db('gigs').collection('gigs').find().toArray((err5, res5)=>{
              if (err5){
                console.log('There was an error finding gigs with price filter: ' + err5);
              }
              else{
                var totalPrice = 0
                for (var gig in res5){
                  if (res5[gig].description.inlcudes(filter_crit)){
                    totalPrice+=res5[gig].applications.length
                  }
                }
                 var avg_price = totalPrice/count;
                 cb(null, avg_price)
              }
            });
            break;
            case "none":
            db.db('gigs').collection('gigs').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].applications.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry, we do not support that filter currently', null)
            break;
          }
          break;
          default:
          cb('Sorry we do not support that avg.', null)
          break;
        }
      }
    })

  }
  function getAvgBands(db, data_to_avg, filter, filter_crit, cb){
    findBandCount(db, filter, filter_crit, (count_error, count)=>{
      if (count_error){
        cb(count_error, null)
      }
      else{
        switch(data_to_avg){
          case "appliedGigs":
          switch(filter){
            case "maxDist":
            db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].appliedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "zipcode":
            db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].appliedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;

            case "description":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  if (res6[b].description.inlcudes(filter_crit)){
                    total_count+=res6[b].appliedGigs.length
                  }
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "price":
            db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].appliedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "none":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].appliedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry we dont support that filter', null)
            break;

          }
          break;
          case "finishedGigs":
          switch(filter){
            case "maxDist":
            db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].finishedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "zipcode":
            db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].finishedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;

            case "description":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  if (res6[b].description.inlcudes(filter_crit)){
                    total_count+=res6[b].finishedGigs.length
                  }
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "price":
            db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].finishedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "none":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].finishedGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry we dont support that filter', null)
            break;

          }
          break;
          case "upcomingGigs":
          switch(filter){
            case "maxDist":
            db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].upcomigGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "zipcode":
            db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].upcomigGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;

            case "description":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  if (res6[b].description.inlcudes(filter_crit)){
                    total_count+=res6[b].upcomigGigs.length
                  }
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "price":
            db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].upcomigGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "none":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=res6[b].upcomigGigs.length
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry we dont support that filter', null)
            break;

          }
          break;
          case "maxDist":
          switch(filter){
            case "maxDist":
            db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].maxDist)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "zipcode":
            db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].maxDist)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;

            case "description":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  if (res6[b].description.inlcudes(filter_crit)){
                    total_count+=parseInt(res6[b].maxDist)
                  }
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "price":
            db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].maxDist)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "none":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].maxDist)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry we dont support that filter', null)
            break;

          }
          break;
          case "price":
          switch(filter){
            case "maxDist":
            db.db('bands').collection('bands').find({'maxDist':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "zipcode":
            db.db('bands').collection('bands').find({'zipcode':filter_crit}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;

            case "description":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  if (res6[b].description.inlcudes(filter_crit)){
                    total_count+=parseInt(res6[b].price)
                  }
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "price":
            db.db('bands').collection('bands').find({'price':{$gt:filter_crit}}).toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            case "none":
            db.db('bands').collection('bands').find().toArray((err6, res6)=>{
              if(err6){
                cb(err6, null);
              }
              else{
                var total_count = 0
                for (var b in res6){
                  total_count+=parseInt(res6[b].price)
                }
                var avg = total_count/count
                cb(null, avg);
              }
            });
            break;
            default:
            cb('Sorry we dont support that filter', null)
            break;

          }
          break;
          default:
          cb('Sorry we do not suppor that type of avg.', null)
          break;
        }
      }
    });
  }
} // end of exports
