module.exports = router => {

  router.get('/control-center', (req, res)=>{
    console.log("In control nav and req key is : " + req.session.key);
    if(!req.session.key){
      res.status(401).end();
      return;
    }
    res.render('control-center.html');
  });

  router.get('/otherProfile', (req,res)=>{
    res.render('otherProfile.html');
  });

  router.get('/search_page', (req,res) => {
    res.render('search.html');
  });

}
