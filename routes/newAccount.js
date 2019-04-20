module.exports = router =>{
  stripe_private_key = 'sk_test_t6hlsKu6iehEdJhV9KzITmxm00flbTdrG5';
  stripe = require('stripe')(stripe_private_key);
  const database = require('../database.js');

  router.post('/newConnectedAccount', (req, res)=>{
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
      console.log('At newCreateAccount req body is: ' + JSON.stringify(req.body));
      //stripe variables from req
      var {dateOfBrith, firstName, lastName, acct_number, routing_number, holder_name, external_account_token} = req.body;
      var indie = {};
      indie['first_name']=firstName;
      indie['last_name']=lastName;
      indie['dob']={};
      var birthDate = new Date(dateOfBrith);
      indie['dob']['day']=birthDate.getDay();
      indie['dob']['month']=birthDate.getMonth();
      indie['dob']['year']=birthDate.getFullYear();
      var business_profile = {};
      business_profile['product_description']='A musical act on the Banda network.';
      var today = new Date();
      var ip = req.session.ip;
      console.log('IP IS: ' + ip);
      console.log('Today is: ' + today.toString());
      tos_acceptance={};
      console.log('session: ' + req.connection.remoteAddress);
      tos_acceptance.ip=req.connection.remoteAddress;
      tos_acceptance.date=today
      console.log("TOKEN " + JSON.stringify(external_account_token));

      console.log('Indie is: ' + JSON.stringify(indie));
      stripe.accounts.create({
        country: country,
        type: 'custom',
        business_type: 'individual',
        requested_capabilities: ['platform_payments'],
        business_profile: business_profile,
        tos_acceptance:tos_acceptance,
        external_account:external_account_token,
        individual:indie

        }).then(res2=>{
            console.log('got result froms tripe in create connected account. '+JSON.stringify(res2));
            var stripe_id = res2['id'];
            var requirements = res2['requirements'];
            console.log('Requirments to verify account are: ' + JSON.stringify(requirements));
            database.connect(db=>{
                db.db('users').collection('stripe_users').insertOne({'username':req.session.key, 'stripe_connected_account_id':stripe_id, 'payouts':[]}, (res4)=>{
                    res.status(200).send('Good job!');
                    db.close();
                });
              }, err3=>{
                  console.log('Couldnt connect to mongo. Error: ' + err3);
                  res.status(500).end();
                });
                //add id to db
              }).catch(err=>{
                console.log('Error from stripe: ' + err);
              });
    }
  });


}


// stripe created account returned json:
/*
 {"id":"acct_1EO7UHK89PQKNDyG","object":"account",
 "business_profile":{"mcc":null,"name":null,"product_description":null,"support_address":null,"support_email":null,"support_phone":null,"support_url":null,"url":null},
 "business_type":"individual","capabilities":{"platform_payments":"pending"},
 "charges_enabled":false,"country":"US","created":1555006742,"default_currency":"usd","details_submitted":false,"email":null,
 "external_accounts":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/accounts/acct_1EO7UHK89PQKNDyG/external_accounts"},

 "individual":
 {"id":"person_ErrCCj6G09lrAT","object":"person","account":"acct_1EO7UHK89PQKNDyG",
 "address":{"city":null,"country":"US","line1":null,"line2":null,"postal_code":null,"state":null},
 "created":1555006741,"dob":{"day":6,"month":2,"year":1990},"first_name":"alex","id_number_provided":false,"last_name":"bothe","metadata":{},"relationship":{"account_opener":true,"director":false,"owner":false,"percent_ownership":null,"title":null},"requirements":{"currently_due":[],"eventually_due":["id_number"],"past_due":[]},"ssn_last_4_provided":false,"verification":{"details":null,"details_code":null,"document":{"back":null,"details":null,"details_code":null,"front":null},"status":"pending"}},

 "metadata":{},"payouts_enabled":false,"requirements":{"current_deadline":null,"currently_due":["business_profile.url","external_account","tos_acceptance.date","tos_acceptance.ip"],"disabled_reason":"requirements.past_due","eventually_due":["business_profile.url","external_account","individual.id_number","tos_acceptance.date","tos_acceptance.ip"],"past_due":["business_profile.url","external_account","tos_acceptance.date","tos_acceptance.ip"]},"settings":{"branding":{"icon":null,"logo":null,"primary_color":null},"card_payments":{"decline_on":{"avs_failure":false,"cvc_failure":false}},"dashboard":{"display_name":null,"timezone":"Etc/UTC"},"payments":{"statement_descriptor":""},"payouts":{"debit_negative_balances":false,"schedule":{"delay_days":2,"interval":"daily"},"statement_descriptor":null}},"tos_acceptance":{"date":null,"ip":null,"user_agent":null},"type":"custom"}
*/
