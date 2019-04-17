module.exports = router =>{
  stripe_private_key = 'sk_test_t6hlsKu6iehEdJhV9KzITmxm00flbTdrG5';
  var stripe = require('stripe')(stripe_private_key);
  const database = require('../database.js');
  router.post('/createStripeCustomer', (req, res)=>{
    var country = 'US';
    if (!req.session.key){
      console.log('No logged in user tried to create an account');
      res.status(404).end();
    }
    if (!req.body){
      console.log('no req body sent');
      res.status(401).end();
    }
    else{
      console.log('REQ body:' + JSON.stringify(req.body));
      var {card_token, email} = req.body;
      var username = req.session.key;
      var description = 'Event owner with username:  ' + username;
      console.log('CUSTOMER EMAIL: '+ email);
      stripe.customers.create({
        description: description,
        email:email,
        source: card_token
      }, (err2, customer)=>{
        if (err2){
          console.log('There was an error creating the customer for username: ' + username);
          console.log('STRIPE ERROR WAS: ' + err2);
          res.status(500).end();
        }
        else{
          console.log(' Craeeted customer: ' + JSON.stringify(customer));
          var cus_id = customer['id'];

          database.connect(db=>{
            db.db('users').collection('stripe_customers').insertOne({'username':username, 'stripe_id':cus_id, 'charges':[], 'src_id':card_token}, (res4)=>{
              console.log('Added user ' + username+ 'to stripe_customers woth cus_id: ' + cus_id);
              res.status(200).end();
              db.close();
            })
          }, err3=>{
            console.log('There was an error conencting to mongo: ' + err3);
          });

        }
      });
      // create customer

    }
  });
}

/*
var stripe = require("stripe")("sk_test_t6hlsKu6iehEdJhV9KzITmxm00flbTdrG5");

stripe.customers.create({
  description: 'Customer for jenny.rosen@example.com',
  source: "tok_amex" // obtained with Stripe.js
}, function(err, customer) {
  // asynchronously called
});
*/
