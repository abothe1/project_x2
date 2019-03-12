module.exports = router => {
  router.get('/control-center', (req, res)=>{
    res.render('control-center.html');
  });

}
