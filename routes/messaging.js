module.exports = router => {
  const database = require('../database.js');
  router.post('/messages', (req, res)=>{
    if (!req.body) {
       console.log("No body recived for messaging");
  		 res.status(400).send('No body sent').end();
  	}
    var {senderID, recieverID, body, timeStamp} = req.body;
    database.connect(db=>{
      let messages = db.db('messages').collection('messages');
      messages.insertOne({'senderID':senderID, 'recieverID':recieverID, 'body':body, 'timeStamp': timeStamp}, (err2, res)=>{
        if (err2){
          consoel.log("There was an error adding the message from " + senderID + "Error was: " + err2);
          res.status(500).end();
  				db.close();
        }
        else{
          console.log("Message with body: "+ body +"was instered into db");
          io.emit('message, recID:'+recieverID+'', {'senderID':senderID, 'recieverID':recieverID, 'body':body, 'timeStamp': timeStamp});
          res.status(200).end();
  				db.close();
        }
      });
    }, err=>{
      console.log("Couldn't connec to mongo with error: "+err);
      db.close();
      res.status(500).end();
    });

  });

  router.get('/messages', (req, res)=>{
    if (!req.query) {
       console.log("No body recived for messaging");
       res.status(400).send('No body sent').end();
    }
    var {recieverID} = req.query;
      database.connect(db=>{
        let messages = db.db('messages').collection('messages');
        messages.find({'recieverID':recieverID}).toArray(function(err2, result) {
          if (err2){
            console.warn("Couldnt get messages: " + err2);
            db.close();
            res.status(500).end();

          }
          else{
            console.log("Got messages out!");
            res.status(200).send(result);
            db.close();

          }
        });
      }, err=>{
        console.log("Couldn't connec to mongo with error: "+err);
        db.close();
        res.status(500).end();
      });
  });
}
