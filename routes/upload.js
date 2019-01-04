module.exports = router => {

const database = require('../database.js'),
      multer = require('multer');

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

function upload_user_file(basedir, collection, which) {
	return [
		(req, res, next) => {
			if (!req.session.key) {
				console.info(`User from ${req.ip} tried to upload a(n) ${which} whilst not logged in`);
				res.status(401).send('Not logged in').end();
			} else {
				next()
			}
		},
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
				var collection = db.db('users').collection(collection);

				collection.deleteMany({ owner: database.object_id(id) }, (err, _obj) => {
					if (err) {
						console.error(`Couldn't delete ${which} with user id ${id}: ${err}`);
						res.status(500).end()
						db.close()
					} else {
						collection.insertOne({ filename: filename, owner: database.object_id(id) }, (err, _result) => {
							if (err) {
								console.error(`Couldn't insert ${which} with owner '${id}', filename '${filename}': ${err}`)
								res.status(500).end()
							} else {
								res.status(200).end()
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

router.post('/upload/avatar', upload_user_file('/avatars', 'avatars', 'avatar'));
router.post('/upload/soundbyte', upload_user_file('/soundbytes', 'soundbytes', 'soundbyte'));


} /* end module.exports */