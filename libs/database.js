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
'use strict'

module.exports = {
	connect: connect,
	objectId: foo => ObjectID(foo),
	usernameFromId: usernameFromId,
	idFromUsername: idFromUsername,
}

// The port that mongodb runs on. This should be the same as in `db/mongod.conf`
const MONGO_PORT = 27017;
// The protocol and url to connect to. When we go to production, we might want to change this.
const MONGO_URL = `mongodb://localhost:${MONGO_PORT}/banda`;
const { MongoClient, ObjectID } = require('mongodb');

// connect to mongodb
function connect (cbOk, cbErr) {
	MongoClient.connect(MONGO_URL, { useNewUrlParser : true}, (err, db) => {
		if (err) {
			cbErr('An internal error occured');
		} else {
			cbOk(db);
		}
	})
}

function usernameFromId (id, cbOk, cbErr, cbNotFound, db=null) {
	function exec(db) {
		db.db('users').collection('users').findOne({_id: ObjectID(id)}, (err, res) => {
			console.log('a');
			if (err)
				cbErr(err)
			else if (!res)
				cbNotFound()
			else
				cbOk(res.username)
		});
	}

	if (db)
		exec(db) // if we have the database, just execute exec directly
	else
		connect(exec) // if we don't have a database, pass exec to be called when we do
}

function idFromUsername (username, cbOk, cbErr, cbNotFound, db=undefined) {
	function exec(db) {
		db.db('users').collection('users').findOne({username: username}, (err, res) => {
			if (err)
				cbErr(err)
			else if (!res)
				cbNotFound()
			else
				cbOk(res._id)
		});
	}

	if (db)
		exec(db) // if we have the database, just execute exec directly
	else
		connect(exec) // if we don't have a database, pass exec to be called when we do
}
