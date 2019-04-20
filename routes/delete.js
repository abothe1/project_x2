module.exports = router => {

const database = require('../database.js')

  router.post('/delete' ,(req, res)=>{
    var {mode} = req.body;
    database.connect(db=>{
      if (mode=='gigs'){
        db.db('gigs').collection('gigs').drop();
        res.status(200).send("Deleted gigs");
        db.close();
      }
      if (mode=='bands'){
        db.db('bands').collection('bands').drop();
        res.status(200).send("Deleted bands");
        db.close();
      }
      if (mode=='accounts'){
        db.db('users').collection('stripe_users').drop();
        res.status(200).send("Deleted user_stripe_accounts");
        db.close();
      }
      if (mode=='customers'){
        db.db('users').collection('stripe_customers').drop();
        res.status(200).send("Deleted stripe_customers");
        db.close();
      }
      else{
        res.status(401).end();
        db.close();
      }

    }, err=>{
      console.log("THERE WAS AN ERROR DELete EVERYTHING : " + err);
      res.status(500).end();
    });
  });

}
