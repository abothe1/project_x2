module.exports = router => {

const database = require('../database.js'),
      multer = require('multer'),
      fs = require('fs');

const UPLOADS_VIRTUAL_BASE_DIR = '/uploads',
      UPLOADS_BASE_DIR = 'static' + UPLOADS_VIRTUAL_BASE_DIR;


router.get('/_upload', (req, res) => {
	var id = req.session.key;
	if (!id) {
		res.status(403).send('Not logged in').end();
	} else {
		database.username_from_id(id, username => {
			res.render('_upload.html', {username: username})
		}, err => {
			console.error(`Username find request from ${req.ip} (for ${id}) returned error: ${err}`)
			res.status(500).end();
		}, () => {
			console.error(`Username find request from ${req.ip} (for ${id}) couldn't find a username`);
			res.status(500).end();			
		})
	}
})

function get_user_file(basedir, collection) {
	return (req, res) => {
		database.connect(db => {
			database.id_from_username(req.params.username, id => {
				db.db('users').collection(collection).findOne({ owner: id }, (err, obj) => {
					if (err) {
						console.error(`${collection} request ${req.url} (from ${req.ip}) caused an error when finding: ${err}`);
						res.status(500).end()
					} else if (obj === null) {
						res.status(404).end()
					} else {
						res.redirect(UPLOADS_VIRTUAL_BASE_DIR + basedir + '/' + obj.filename)
					}
				})
				}, err => {
					console.error(`${collection} request ${req.url} (from ${req.ip}) caused an error when getting id: ${err}`);
					res.status(500).end()
				}, () => {
					res.status(404).end()
				}, db
			)
		})
	}
}

router.get('/users/:username/avatar', get_user_file('/avatars', 'avatars'));
router.get('/users/:username/soundbyte', get_user_file('/soundbytes', 'soundbytes'));

function require_logged_in(which) {
	return (req, res, next) => {
		if (!req.session.key) {
			console.info(`User from ${req.ip} tried to upload a(n) ${which} whilst not logged in`);
			res.status(401).send('Not logged in').end();
		} else {
			next()
		}
	};
}

function upload_user_file(basedir, collection, which) {
	return [
		require_logged_in(which),
		multer({ dest: UPLOADS_BASE_DIR + basedir }).single(which),
		(req, res) => {
			console.log(`[${req.ip}] File uploaded: ` + req.file.path);

			var id = req.session.key;
			var filename = req.file.filename;

			if (!id) {
				console.error("User wasn't logged in, but got past `login_required`");
				return res.status(500).end();
			}

			database.connect(db => {
				var coll = db.db('users').collection(collection);

				coll.deleteMany({ owner: database.object_id(id) }, (err, _obj) => {
					if (err) {
						console.error(`Couldn't delete ${which} with user id ${id}: ${err}`);
						res.status(500).end()
						db.close()
					} else {
						// note that since it deletes any previous ones, the old avatars are removed
						coll.insertOne({ filename: filename, owner: database.object_id(id) }, (err, _result) => {
							if (err) {
								console.error(`Couldn't insert ${which} with owner '${id}', filename '${filename}': ${err}`)
								res.status(500).end()
							} else {
								res.status(200).json({ success: true }).end()
							}
							db.close()
						})
					}
				})
			}, err => {
				console.error(`Error with connecting to databse: ${err}`);
				res.status(500).end();
			})
		}
	];
}

function delete_user_file(basedir, collection, which) {
	return [
		require_logged_in(which),
		(req, res) => {
			var id = req.session.key;

			if (!id) {
				console.error("User wasn't logged in, but got past `login_required`");
				return res.status(500).end();
			}

			database.connect(db => {
				var coll = db.db('users').collection(collection);
				coll.findOne({ owner: database.object_id(id) }, (err, obj) => {
					if (err) {
						console.warn(`Couldn't find ${which} for user ${id}: ${err}`);
						res.status(500).end()
					} else {
						var file = UPLOADS_BASE_DIR + basedir + '/' + obj.filename;
						coll.deleteMany({ owner: database.object_id(id) }, (err, _obj) => {
							if (err) {
								console.warn(`Couldn't delete ${which} with user id ${id}: ${err}`);
								res.status(500).end()
							db.close();
							} else if (!obj) {
								console.warn(`Couldn't delete ${which} corresponding to user ${id}`);
								res.status(500).end()
							db.close();
							} else {
								console.log(JSON.stringify(obj));
								fs.unlink(file, err => {
									if (err) {
										console.warn(`Couldn't delete ${which} file '${file}' for user ${id}: ${err}`);
									} else {
										console.log(`Deleted file ${which} file ${file} for user ${id}`);
									}
							db.close();
									res.status(200).json({ success: true }).end(); // users doesn't need to know there was an error
								})
							}
						})
					}
				})
			}, err => {
				console.error(`Error with connecting to databse: ${err}`);
				res.status(500).end();
			})
		}
	];
}

router.route('/settings/avatar')
	.post(upload_user_file('/avatars', 'avatars', 'avatar'))
	.delete(delete_user_file('/avatars', 'avatars', 'avatar'));

router.route('/settings/soundbyte')
	.post(upload_user_file('/soundbytes', 'soundbytes', 'soundbyte'))
	.delete(delete_user_file('/soundbytes', 'soundbytes', 'soundbyte'));

} /* end module.exports */





