module.exports = router => {
  router.get('/control-center', (req, res)=>{
    res.render('control-center.html');
  });
  router.get('/otherProfile', (req,res)=>{
    res.render('otherProfile.html');
  });

}
