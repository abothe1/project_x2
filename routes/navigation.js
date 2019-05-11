module.exports = router => {

  router.get('/control-center', (req, res)=>{
    console.log("In control nav and req key is : " + req.session.key);
    if(!req.session.key){
      res.status(401).send("You must be logged in to access your home page");
      return;
    }
    res.render('control-center.html');
  });

  router.get('/otherProfile', (req,res)=>{
    if(!req.session.key){
      console.log('A user tried to view profiles without loggin in');
      res.status(200).send('Sorry, you must login to view profiles.')
    }
    if(!req.query){
      console.log("No query sent with request in other profile router page.");
      res.status(400).end();
    }
    else{
      res.render('otherProfile.html');
    }

  });

  router.get('/studio',(req,res)=>{
    if(!req.session.key){
      console.log('A user tried to view profiles without loggin in');
      res.status(200).send('Sorry, you must login to view profiles.')
    }
    if(!req.query){
      console.log("No query sent with request in other profile router page.");
      res.status(400).end();
    }
    else{
      res.render('studio.html');
    }
  });

  router.get('/search_page', (req,res) => {
    res.render('search.html');
  });
}
