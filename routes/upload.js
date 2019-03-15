module.exports = router => {

const database = require('../database.js'),
      multer = require('multer'),
      fs = require('fs');

//picUploader = multer({limits: {fileSize: 2000000 },dest:'static/uploads/'})

/*

router.post('/uploadPhoto', picUploader.single('picture'), (req, res)=>{
  if (!req.session.key){
    console.log("No logged in user tried to upload a file");
    res.status(403).end();
    return;
  }
  if (!req.body){
    res.status(400).send('No body was sent in request');
    console.log("No body sent for upload band photo");
    return;
  }
  var {mode, file, idFor} = req.body;
  var encImg = newImg.toString('base64');
  var newItem = {
      idFor: idFor,
      type: mode,
      creator: req.session.key,
      contentType: req.file.mimetype,
      size: req.file.size,
      img: Buffer(encImg, 'base64')
   };
  if (!mode){
    res.status(400).send('No mode was sent in request');
    console.log("No mode sent for upload band photo");
    return;
  }
  if (!req.file){
    res.status(400).send('No file was sent in request');
    console.log("No file sent for upload band photo");
    return;
  }

  switch(mode){
    case 'user':
    database.connect(db=>{
      db.db('uploads').collection('uploads').insertOne(newItem, (err3, result3)=>{
          if (err3){
            console.log("There was an error inserting image from: " + req.session.key + " Error: " + err3);
            res.status(500).end();
            return;
          }
          console.log(JSON.stringify(result3));

          fs.remove(req.file.path, function(err) {
            if (err) {
              console.log("There was an error wuth fs remove Error: " + err);
            }
          });
        console.log('inserted ID of picture jsut inserted is :' + result3['insertedId'])
        var newvalues = {$set: {picture:result3['insertedId']}};
        db.close();
        db.db('users').collection('users').updateOne({'username':req.session.key}, newvalues, result4=>{
          console.log("Result from uploads db: " + JSON.stringify(result3) + "Result from user db " + JSON.stringify(result4));
          db.close();
          res.status(200).send("Result from uploads db: " + JSON.stringify(result3) + "Result from user db " + JSON.stringify(result4));;
        });
      }
    }, err=>{
      console.log("There was an error connecting to mongo, err: " + err);
      res.status(500).end();
      return;
    });
    break;

    case 'band':
    database.connect(db=>{
      db.db('uploads').collection('uploads').insertOne(newItem, (err3, result3)=>{
          if (err3){
            console.log("There was an error inserting image from: " + req.session.key + " Error: " + err3);
            res.status(500).end();
            return;
          }
          console.log(JSON.stringify(result3));

          fs.remove(req.file.path, function(err) {
            if (err) {
              console.log("There was an error wuth fs remove Error: " + err);
            }
          });
        console.log('inserted ID of picture jsut inserted is :' + result3['insertedId'])
        var newvalues = {$set: {'picture':result3['insertedId']}};
        db.close();
        db.db('bands').collection('bands').updateOne({'creator':req.session.key}, newvalues, result4=>{
          console.log("Result from uploads db: " + JSON.stringify(result3) + "Result from bands db " + JSON.stringify(result4));
          db.close();
          res.status(200).send("Result from uploads db: " + JSON.stringify(result3) + "Result from bands db " + JSON.stringify(result4));;
        });
      }
    }, err=>{
      console.log("There was an error connecting to mongo, err: " + err);
      res.status(500).end();
      return;
    });

    break;
    case 'gig':
    database.connect(db=>{
      db.db('uploads').collection('uploads').insertOne(newItem, (err3, result3)=>{
          if (err3){
            console.log("There was an error inserting image from: " + req.session.key + " Error: " + err3);
            res.status(500).end();
            return;
          }
          console.log(JSON.stringify(result3));

          fs.remove(req.file.path, function(err) {
            if (err) {
              console.log("There was an error wuth fs remove Error: " + err);
            }
          });
        console.log('inserted ID of picture jsut inserted is :' + result3['insertedId'])
        var newvalues = {$set: {'picture':result3['insertedId']}};
        db.close();
        db.db('gigs').collection('gigs').updateOne({'creator':req.session.key}, newvalues, result4=>{
          console.log("Result from uploads db: " + JSON.stringify(result3) + "Result from gigs db " + JSON.stringify(result4));
          db.close();
          res.status(200).send("Result from uploads db: " + JSON.stringify(result3) + "Result from GIGS db " + JSON.stringify(result4));;
        });
      }
    }, err=>{
      console.log("There was an error connecting to mongo, err: " + err);
      res.status(500).end();
      return;
    });
    break;
    default:
    res.status(500).end()
    return;
    break;
  }
});

router.get('/picture', (req, res)=>{
  if (!req.query){
    res.status(400).send('No body was sent in request');
    console.log("No body sent for upload band photo");
    return;
  }
  var {picID} = req.query;
    database.connect(db=>{
      db.db('uploads').collection('uploads').findOne({'_id':picID}, (err2, result2)=>{
        if (err2){
          console.log('Could not find pic with id : ' + picID + 'Error: ' + err2);
          res.status(500).end();
          return;
        }
        else{
          console.log('RESULT FOR GET upload/pic with ID: ' + picID + 'is : ' + JSON.stringify(result2));
          res.setHeader('content-type', results.contentType);
          db.close();
          res.status(200).send(result2.img.buffer);
        }
      });
    }, err =>{
      console.log("There was an error connecting to mongo, err: " + err);
      res.status(500).end();
      return;
    });
});
*/


const UPLOADS_VIRTUAL_BASE_DIR = '/uploads',
      UPLOADS_BASE_DIR = 'static' + UPLOADS_VIRTUAL_BASE_DIR;


router.get('/_upload', (req, res) => {
	var id = req.session.key;
	if (!id) {
		res.status(403).send('Not logged in').end();
	} else {
		database.usernameFromId(id, username => {
			res.render('_upload.html', {username: username})
		}, err => {
			console.warn(`Username find request from ${req.ip} (for ${id}) returned error: ${err}`)
			res.status(500).end();
		}, () => {
			console.warn(`Username find request from ${req.ip} (for ${id}) couldn't find a username`);
			res.status(500).end();
		})
	}
})

function getUserFile(basedir, collection) {
	return (req, res) => {
		database.connect(db => {
			database.idFromUsername(req.params.username, id => {
				db.db('users').collection(collection).findOne({ owner: id }, (err, obj) => {
					if (err) {
						console.warn(`${collection} request ${req.url} (from ${req.ip}) caused an error when finding: ${err}`);
						res.status(500).end()
					} else if (obj === null) {
						res.status(404).end()
					} else {
						res.redirect(UPLOADS_VIRTUAL_BASE_DIR + basedir + '/' + obj.filename)
					}
				})
				}, err => {
					console.warn(`${collection} request ${req.url} (from ${req.ip}) caused an error when getting id: ${err}`);
					res.status(500).end()
				}, () => {
					res.status(404).end()
				}, db
			)
		}, err => {
			console.warn("Couldn't connect to database: " + err)
			res.status(500).end()
		})
	}
}

router.get('/users/:username/avatar', getUserFile('/avatars', 'avatars'));
router.get('/users/:username/soundbyte', getUserFile('/soundbytes', 'soundbytes'));

function requireLoggedIn(which) {
	return (req, res, next) => {
		if (!req.session.key) {
			console.info(`User from ${req.ip} tried to upload a(n) ${which} whilst not logged in`);
			res.status(401).send('Not logged in').end();
		} else {
			next()
		}
	};
}

function uploadUserFile(basedir, collection, which) {
	return [
		requireLoggedIn(which),
		multer({ dest: UPLOADS_BASE_DIR + basedir }).single(which),
		(req, res) => {
			console.log(`[${req.ip}] File uploaded: ` + req.file.path);

			var id = req.session.key;
			var filename = req.file.filename;

			if (!id) {
				console.warn("User wasn't logged in, but got past `requireLoggedIn`");
				return res.status(500).end();
			}

			database.connect(db => {
				var coll = db.db('users').collection(collection);

				coll.deleteMany({ owner: database.objectId(id) }, (err, _obj) => {
					if (err) {
						console.warn(`Couldn't delete ${which} with user id ${id}: ${err}`);
						res.status(500).end()
						db.close()
					} else {
						// note that since it deletes any previous ones, the old files are removed
						coll.insertOne({ filename: filename, owner: database.objectId(id) }, (err, _result) => {
							if (err) {
								console.warn(`Couldn't insert ${which} with owner '${id}', filename '${filename}': ${err}`)
								res.status(500).end()
							} else {
								res.status(200).json({ success: true }).end()
							}
							db.close()
						})
					}
				})
			}, err => {
				console.warn("Couldn't connect to database: " + err);
				res.status(500).end()
			})
		}
	];
}

function deleteUserFile(basedir, collection, which) {
	return [
		requireLoggedIn(which),
		(req, res) => {
			var id = req.session.key;

			if (!id) {
				console.warn("User wasn't logged in, but got past `requireLoggedIn`");
				return res.status(500).end();
			}

			database.connect(db => {
				var coll = db.db('users').collection(collection);
				coll.findOne({ owner: database.objectId(id) }, (err, obj) => {
					if (err) {
						console.warn(`Couldn't find ${which} for user ${id}: ${err}`);
						res.status(500).end()
					} else {
						var file = UPLOADS_BASE_DIR + basedir + '/' + obj.filename;
						coll.deleteMany({ owner: database.objectId(id) }, (err, _obj) => {
							db.close();
							if (err) {
								console.warn(`Couldn't delete ${which} with user id ${id}: ${err}`);
								res.status(500).end()
							} else if (!obj) {
								console.warn(`Couldn't delete ${which} corresponding to user ${id}`);
								res.status(500).end()
							} else {
								console.log(JSON.stringify(obj));
								fs.unlink(file, err => {
									if (err) {
										console.warn(`Couldn't delete ${which} file '${file}' for user ${id}: ${err}`);
									} else {
										console.log(`Deleted file ${which} file ${file} for user ${id}`);
									}
									res.status(200).json({ success: true }).end(); // users doesn't need to know there was an error
								})
							}
						})
					}
				})
			}, err => {
				console.warn("Couldn't connect to database: " + err);
				res.status(500).end()
			})
		}
	];
}

router.route('/settings/avatar')
	.post(uploadUserFile('/avatars', 'avatars', 'avatar'))
	.delete(deleteUserFile('/avatars', 'avatars', 'avatar'));

router.route('/settings/soundbyte')
	.post(uploadUserFile('/soundbytes', 'soundbytes', 'soundbyte'))
	.delete(deleteUserFile('/soundbytes', 'soundbytes', 'soundbyte'));
} /* end module.exports */
