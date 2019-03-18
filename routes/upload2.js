module.exports = router => {

const database = require('../database.js'),
      multer = require('multer'),
    //  logger = require('../logger.js'),
      fs = require('fs');
      var uploadingGigPics = multer({
          dest: './public/uploads/GigPics/'
      });

      var uploadingBandPic = multer({
        dest: './public/uploads/BandPics/'
      });

      var uploadingAudioSample = multer({
        dest: './public/uploads/SoundBytes/'
      });
      var uploadingAudioPic = multer({
        dest: './public/uploads/AudioPics/'
      });

  router.post('/uploadGigPic', uploadingGigPics.single('image'), function(req, res) {
      if (!req.session.key){
        console.log('User tried to upload gig pic while not logged in');
        res.status(401).end();
      }
      console.log(req.file);      //res.send(req.file);
      res.send(req.file.path);
  });

  router.post('/uploadBandAvatar', uploadingBandPic.single('image'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
      }
    console.log(req.file);
    res.send(req.file.path);
  });


  router.post('/uploadSoundByte', uploadingAudioSample.single('soundByte'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
      }
    console.log(req.file);
    res.send(req.file.path);
  });

  router.post('/uploadAudioPic', uploadingAudioPic.single('audioPic'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
    }
    console.log(req.file);
    res.send(req.file.path);
  });

}
