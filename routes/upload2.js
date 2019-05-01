module.exports = router => {

const database = require('../database.js'),
      multer = require('multer'),
    //  logger = require('../logger.js'),
      fs = require('fs');
      var uploadingGigPics = multer({
          dest: './public/tmp/'
      });

      var uploadingBandPic = multer({
        dest: './public/tmp/'
      });

      var uploadingAudioSample = multer({
        dest: './public/tmp/'
      });
      var uploadingAudioPic = multer({
        dest: './public/tmp/'
      });

      // ysvnxtgi

  router.post('/uploadGigPic', uploadingGigPics.single('image'), function(req, res) {
      if (!req.file){
        console.log('No file sent');
        res.status(400).end();
      }
      if (!req.session.key){
        console.log('User tried to upload gig pic while not logged in');
        res.status(401).end();
      }
      if (!(req.file.mimetype=='image/jpeg' || req.file.mimetype=='image/png')){
        console.log('Wrong mimetype')
        res.status(200).send("Wrong mimeType");
        return;
      }
      var fileName = 'static/uploads/GigPics/'+req.file.filename;
      console.log(req.file);      //res.send(req.file);
      fs.rename(req.file.path, fileName, err2=>{
        if(err2){
          console.log('Could not rename file, error: ' + err2);
          res.status(500).end();
        }
        else{
          var finalName = fileName.replace('static', "");
          res.status(200).send(finalName);
        }
      });
  });

  router.post('/uploadBandAvatar', uploadingBandPic.single('image'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
      }
      if (!req.file){
        console.log('No file sent');
        res.status(400).end();
      }
      if (!(req.file.mimetype=='image/jpeg' || req.file.mimetype=='image/png')){
        console.log('Wrong mimetype')
        res.status(200).send("Wrong mimeType");
        return;
      }
    console.log(req.file);
    var fileName = 'static/uploads/BandPics/'+req.file.filename;
    console.log(req.file);      //res.send(req.file);
    fs.rename(req.file.path, fileName, err2=>{
      if(err2){
        console.log('Could not rename file, error: ' + err2);
        res.status(500).end();
      }
      else{
        var finalName = fileName.replace('static', "");
        res.status(200).send(finalName);
      }

    });
  });


  router.post('/uploadSoundByte', uploadingAudioSample.single('soundByte'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
      }
      if (!req.file){
        console.log('No file sent');
        res.status(400).end();
      }
      if (!(req.file.mimetype=='audio/mp3' || req.file.mimetype=='audio/wav')){
        console.log('Wrong mimetype')
        res.status(200).send("Wrong mimeType");
        return;
      }

    console.log(req.file);
    var fileName = 'static/uploads/SoundBytes/'+req.file.filename;
    console.log(req.file);      //res.send(req.file);
    fs.rename(req.file.path, fileName, err2=>{
      if(err2){
        console.log('Could not rename file, error: ' + err2);
        res.status(500).end();
      }
      else{
        var finalName = fileName.replace('static', "");
        res.status(200).send(finalName);
      }
    });
  });

  router.post('/uploadAudioPic', uploadingAudioPic.single('audioPic'), function(req, res){
    if (!req.session.key){
      console.log('User tried to upload gig pic while not logged in');
      res.status(401).end();
    }
    if (!req.file){
      console.log('No file sent');
      res.status(400).end();
    }
    if (!(req.file.mimetype=='image/jpeg' || req.file.mimetype=='image/png')){
      console.log('Wrong mimetype')
      res.status(200).send("Wrong mimeType");
      return;
    }

    console.log(req.file);
    var fileName = 'static/uploads/AudioPics/'+req.file.filename;
    console.log(req.file);      //res.send(req.file);
    fs.rename(req.file.path, fileName, err2=>{
      if(err2){
        console.log('Could not rename file, error: ' + err2);
        res.status(500).end();
      }
      else{
        var finalName = fileName.replace('static', "");
        res.status(200).send(finalName);
      }

    });
  });

}
