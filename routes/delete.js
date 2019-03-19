module.exports = router => {

const database = require('../database.js')

  router.post('/delete' ,(req, res)=>{
    var {mode} = req.body;
    database.connect(db=>{
      if (mode=='gigs'){
        db.db('gigs').collection('gigs').drop();
        res.status(200).send("Deleted gigs");
      }
      else{
        db.db('bands').collection('bands').drop();
        res.status(200).send("Deleted bands");
      }

    }, err=>{
      console.log("THERE WAS AN ERROR DELete EVERYTHING : " + err);
      res.status(500).end();
    });
  });
}
