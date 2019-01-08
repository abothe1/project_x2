/*************************************************************************
 *
 * BANDA CONFIDENTIAL
 * __________________
 *
 *  Copyright (C) 2019
 *  Banda Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Banda Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Banda Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Banda Incorporated.
 *
*************************************************************************/

module.exports = {
	connect: connect,
	object_id: object_id,
	username_from_id: username_from_id,
	id_from_username: id_from_username,
}

const PORT = 27017,
      MONGO_URL = `mongodb://localhost:${PORT}/banda`;

const mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;


// function create_mongodb() {
// 	connect(db => {
// 		db.collection.createIndex(
// 	}, console.error)
// }


function object_id(id) {
	return mongodb.ObjectID(id);
}

function connect (cb_ok, cb_err) {
	MongoClient.connect(MONGO_URL, { useNewUrlParser : true}, (err, db) => {
		if (err) {
			console.error(`Error occrued: ${err}`);
			cb_err('An internal error occured');
		}
		else
			cb_ok(db);
	})
}

function username_from_id (id, cb_ok, cb_err, cb_not_found, db=undefined) {
	function exec(db) {
		db.db('users').collection('users').findOne({_id: object_id(id)}, (err, res) => {
			if (err) {
				cb_err(err)
			} else if (!res) {
				cb_not_found()
			} else {
				cb_ok(res.username)
			}
		});
	}

	if (db) {
		exec(db)
	} else {
		connect(exec)
	}
}

function id_from_username (username, cb_ok, cb_err, cb_not_found, db=undefined) {
	function exec(db) {
		db.db('users').collection('users').findOne({username: username}, (err, res) => {
			if (err) {
				cb_err(err)
			} else if (!res) {
				cb_not_found()
			} else {
				cb_ok(res._id)
			}
		});
	}

	if (db) {
		exec(db)
	} else {
		connect(exec)
	}
}


// function connect (database, collection, cb_ok, cb_err) {
// 	connect_to_database(db => {
// 		cb_ok(db.db(database).collection(collection))
// 		db.close();
// 	}, cb_err)
// }


// function filter_fields(json) {
// 	var result = {};
// 	for (var i = 1; i < arguments.length; i++) {
// 		var field = arguments[i];

// 		if (!(result[field] = json[field]))
// 			return [false, `missing field '${field}'`];
// 	}
// 	return [true, result]
// }

// function login_user(user, cb_ok, cb_err) {
//     [ok, filtered] = filter_fields(user, 'user', 'pwd');
//     if(!ok)
//     	return cb_err(filtered);

// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').find(query).toArray((err, user) => {
// 			if (err) throw err;
// 			callback(user);
// 			db.close()
// 		})
// 	});

//     if(!ok)
//     	return cb_err(filtered);
//     cb_ok('<logged in but not actually cause i havent done that yet>');

// // router.post('/login',function(req,res){
// //     handle_database(req,"login",function(response){
// //         if(response === null) {
// //             res.json({"error" : "true","message" : "Database error occured"});
// //         } else {
// //             if(!response) {
// //               res.json({
// //                              "error" : "true",
// //                              "message" : "Login failed ! Please register"
// //                            });
// //             } else {
// //                req.session.key = response;
// //                    res.json({"error" : false,"message" : "Login success."});
// //             }
// //         }
// //     });
// // });

// }

// function register_user(user, cb_ok, cb_err) {
//     [ok, user] = filter_fields(user, 'username', 'password', 'email');
//     if(!ok)
//     	return cb_err(user);

// function get_user(username, callback) {
// 	var query = { username: username };
// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').find(query).toArray((err, user) => {
// 			if (err) throw err;
// 			callback(user);
// 			db.close()
// 		})
// 	});
// }

// function del_user(username, callback) {
// 	// TODO: authenticate this
// 	var query = { username: username }
// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').deleteOne(query, (err, obj) => {
// 			if (err)
// 				throw err;
// 			console.log('Deleted: ' + username);
// 			console.log(obj.result.n + ' document(s) deleted');
// 			callback(obj);
// 			db.close();
// 		});
// 	})
// }


// // module.exports = {
// // 	login_user: login_user,
// // 	register_user: register_user
// // }
