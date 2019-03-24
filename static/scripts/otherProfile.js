
//global vars
var user = null;
var otherGig=null;
var otherBand=null;
var myBand=null;
var myGig = null;
class SampleCarousel{
  constructor(sampleCarCallback){
    this.carWrap = document.createElement("div");
    this.carWrap.className = "jcarousel-wrapper";
    this.carousel = document.createElement("div");
    this.carousel.className = "jcarousel";
    this.list = document.createElement("ul");
    for(var sample in otherBand.audioSamples){
      var newItem = document.createElement("li");
      newItem.className = "carousel-li";
      newItem.audio = new Audio();
      newItem.audio.src = otherBand.audioSamples[sample].audio;
      newItem.audio.type = "audio/mp3";
      // img
      var newImg = document.createElement("img");
      newImg.className = "carousel-img";
      newImg.src = otherBand.audioSamples[sample].picture;
      // frame
      var newFrame = document.createElement("img");
      newFrame.className = "carousel-frame";
      newFrame.src = "/assets/Control-Center/purplebox.png";
      newItem.imgObj = newImg;
      newItem.append(newImg);
      newItem.append(newFrame);
      this.list.append(newItem);
      newItem.addEventListener("mouseover",function(){
        newItem.imgObj.style.opacity = "0.8";
        var playPromise = newItem.audio.play();
        if(playPromise != undefined){
          playPromise.then(function () {
          	 // console.log('Playing....');
          }).catch(function (error) {
          	 console.log('Failed to play....' + error);
          });
        }
      },false);
      newItem.addEventListener("mouseout",function(){
        newItem.imgObj.style.opacity = "1.0";
        newItem.audio.pause();
      },false);
    }
    this.carousel.append(this.list);
    if(otherBand.audioSamples.length + 1 > 4){
      // only add arrow controls if the carousel has enough data
      this.prev = document.createElement("a");
      this.prev.className = "jcarousel-control-prev";
      this.prev.href = "#";
      this.next = document.createElement("a");
      this.next.className = "jcarousel-control-next";
      this.next.href = "#";
      this.carWrap.append(this.prev);
      this.carWrap.append(this.next);
    }
    this.carWrap.append(this.carousel);
    sampleCarCallback(this);
  }
}

function parseURL(url){
  var parser = document.createElement('a'),
       searchObject = {},
       queries, split, i;
   // Let the browser do the work
   parser.href = url;
   // Convert query string to object
   queries = parser.search.replace(/^\?/, '').split('&');
   for( i = 0; i < queries.length; i++ ) {
       split = queries[i].split('=');
       searchObject[split[0]] = split[1];
   }
   return {
       protocol: parser.protocol,
       host: parser.host,
       hostname: parser.hostname,
       port: parser.port,
       pathname: parser.pathname,
       search: parser.search,
       searchObject: searchObject,
       hash: parser.hash
   };
}
function getUserInfo(){
  $.get('/user', {'query':'who am i ?'}, result=>{
    console.log("Got result for user and it is : "+JSON.stringify(result));
    var myUser = result;
    $.get('/getBands', {'creator':result['username']}, bandsResult0=>{
      console.log("Got result for getting our user's bands, here it is :" + JSON.stringify(bandsResult0));
      var myBands = bandsResult0;
      $.get('/getGigs', {'creator':myUser['username']}, gigResult0=>{
        console.log("Got result for getting our user's bands, here it is :" + JSON.stringify(gigResult0));
        var myGigs = gigResult0;
        populateDropDown(myUser, myBands, myGigs);
      });
    });
  });
}
function populateDropDown(myUser, myBands, myGigs){
  console.log(" ");
  console.log("In pop drop down");
  console.log(" *** ");
  console.log("USER: "+JSON.stringify(myUser)+" BANDS: "+JSON.stringify(myBands)+"GIGS: "+JSON.stringify(myGigs));
  console.log(" ");
  if(myUser==null || myUser=="" || myUser==" " || myUser=="null"){
    var selectMenu = document.getElementById('selectDrop');
  //  var userDropTitle = document.createElement('<option value="'+myUser._id+'">'+myUser.username+'</option>');
    var userDropTitle=document.createElement('option');
    userDropTitle.innerHTML=myUser.username;
    userDropTitle.setAttribute('value','user');
    userDropTitle.setAttribute('id', 'userDropTitle');
    selectMenu.appendChild(userDropTitle);
    return;
  }
  var selectMenu = document.getElementById('selectDrop');
//  var userDropTitle = document.createElement('<option value="'+myUser._id+'">'+myUser.username+'</option>');
  var userDropTitle=document.createElement('option');
  userDropTitle.innerHTML=myUser.username;
  userDropTitle.setAttribute('value','user');
  userDropTitle.setAttribute('id', 'userDropTitle');
  selectMenu.appendChild(userDropTitle);
  for (band in myBands){
    var bandTitle=document.createElement('option');
    bandTitle.innerHTML=myBands[band].name;
    bandTitle.setAttribute('value','band');
    bandTitle.setAttribute('data-objID', myBands[band]._id);
    bandTitle.setAttribute('id', 'band'+band+'DropTitle');
    selectMenu.appendChild(bandTitle);
  }
  for (gig in myGigs){
    var gigTitle=document.createElement('option');
    gigTitle.innerHTML=myGigs[gig].name;
    gigTitle.setAttribute('value','gig');
    gigTitle.setAttribute('data-objID', myGigs[gig]._id);
    gigTitle.setAttribute('id', 'gig'+gig+'DropTitle');
    selectMenu.appendChild(gigTitle);
  }


}
document.addEventListener('ready', init);
function init(){
  var urlJSON = parseURL(window.location.href);
  var searchObject = urlJSON['searchObject'];
  console.log('Search obj is: ' + JSON.stringify(searchObject));
  alert('Url json is: ' + JSON.stringify(urlJSON));
  if (searchObject['searchingAs']=='undefined' || searchObject['searchingAs']==undefined || searchObject['searchingAs']== null ){
    console.log('seraching as username');
    $.get('/user',{'query':'who am i'}, result=>{
      user=result;
      if (searchObject['mode']=='gig'){
        $.get('/aGig', {'gigID':searchObject['id']}, result=>{
          otherGig=result;
          console.log('The gig is : '+JSON.stringify(otherGig));
          buildWebPage();
        });
      }
      else{
        $.get('/aBand', {'id':searchObject['id']}, result=>{
          otherBand=result;
          console.log('The band is : '+JSON.stringify(otherBand));
          buildWebPage();
        });
      }
    });
  }
  else{
    console.log('Searching as :' + searchObject['searchingAs']+' WHich is of type: ' + searchObject['searchingType']);
    $.get('/user',{'query':'who am i'}, result=>{
      user=result;
      var type = searchObject['searchingType'];
      var searchingAs = searchObject['searchingAs'];
      if (searchObject['mode']=='gig'){
        $.get('/aGig', {'gigID':searchObject['id']}, result=>{
          otherGig=result;
          console.log('The gig is : '+JSON.stringify(otherGig));
          if (type=='band'){
            $.get('/aBand', {'id':searchingAs}, res2=>{
              myBand=res2;
              buildWebPage();
            });
          }
          else{
            $.get('/aGig', {'gigID':searchingAs}, result=>{
              myGig=result;
              buildWebPage();
            });
          }
        });
      }
      else{
        $.get('/aBand', {'id':searchObject['id']}, result=>{
          otherBand=result;
          console.log('The band is : '+JSON.stringify(otherBand));
          if (type=='band'){
            $.get('/aBand', {'id':searchingAs}, res2=>{
              myBand=res2;
              buildWebPage();
            });
          }
          else{
            $.get('/aGig', {'gigID':searchingAs}, result=>{
              myGig=result;
              buildWebPage();
            });
          }
        });
      }
    });
  }
}

function buildWebPage(){
  if (myBand!=null){
    console.log('Viewing as band: ' + JSON.stringify(myBand));
    if (otherBand!=null){
      console.log('Viewing a band: ' + JSON.stringify(otherBand));
      createPageAsBand();
    }
    else{
      console.log('Viewing a gig: ' + JSON.stringify(otherGig));
      createPageAsGig();
    }
  }
  else if(myGig !=null){
    console.log('Viewing as gig: ' + JSON.stringify(myGig));
    if (otherBand!=null){
      console.log('Viewing a band: ' + JSON.stringify(otherBand));
      createPageAsBand();
    }
    else{
      console.log('Viewing a gig: ' + JSON.stringify(otherGig));
      createPageAsGig();
    }
  }
  else{
    console.log('Viewing as user: ' + JSON.stringify(user));
    if (otherBand!=null){
      console.log('Viewing a band: ' + JSON.stringify(otherBand));
      createPageAsBand();
    }
    else{
      console.log('Viewing a gig: ' + JSON.stringify(otherGig));
      createPageAsGig();
    }
  }
}


function hitApply(){
  console.log('Hit apply');
  if (otherGig==null){
    alert('You can only "Apply" to events. Please go to the search page and search for gigs.');
  }
  if (myBand==null){
    alert('You can only "Apply" to events as a band. Please select one from your drop down menu and hit apply again. If you have no bands you can create one on your home page.');
  }
  else{
    $.post('/apply', {'gigID':otherGig['_id'], 'bandID':myBand['_id']}, result=>{
      alert('Congratulations, you have applied to the gig ' +otherGig['name'] + ' as ' +myBand['name'] + '! Hit home on the Banda "b" to go to search and then again to go to your home page. Check your home page regularly to see if the event has moved to your upcoming gigs section.');
    });
  }

}
function hitBook(){
  console.log('Hit book');
  if (otherBand==null){
    alert('You can only "Book" bands. Please go to the search page and search for bands.');
  }
  if (myGig==null){
    alert('You can only "Book" bands as an event. Please select one from your drop down menu and hit book again. If you have no events you can create one on your home page.');
  }
  else{
    $.post('/askBandToPlay', {'gigID':myGig._id, 'bandID':otherBand._id}, result=>{
      alert(result);
    })
  }

}
function hitMessage(){
  console.log('Hit message');

}
// AB SECTION


var box = null;
var mainContent = null;
var profilesList = null;
var globalMessageArray = null;

function createPageAsBand(){
  var mainContent = document.getElementById("main-content-wrapper");
  // load the band name
  var profileTitle = document.getElementById("profile-title");
  profileTitle.innerHTML = otherBand.name;
  var profileCreator = document.getElementById("profile-creator");
  profileCreator.innerHTML = "created by: "+otherBand.creator;

  // load the band rating into the stars
  var newStars = document.getElementById("user-stars");
  var star1 = "user-star-1";
  var star2 = "user-star-2";
  var star3 = "user-star-3";
  var star4 = "user-star-4";
  var star5 = "user-star-5";
  var stars = [star1,star2,star3,star4,star5];
  loadStars(otherBand.rating, stars);

  // add book/message buttons
  var controls = document.getElementById("profile-controls");
  var newLiOne = document.createElement("li");
  var newAOne = document.createElement("a");
  newAOne.innerHTML = "Book";
  newAOne.href = "#";
  newAOne.addEventListener("click",function(){
    hitBook();
  });
  newLiOne.append(newAOne);
  controls.append(newLiOne);
  var newLiTwo = document.createElement("li");
  var newATwo = document.createElement("a");
  newATwo.innerHTML = "Message";
  newATwo.href = "#";
  newATwo.addEventListener("click",function(){
    hitMessage();
  });
  newLiTwo.append(newATwo);
  controls.append(newLiTwo);

  // add band image & price
  var bandImg = document.getElementById("profile-img");
  bandImg.src = otherBand.picture;
  var bandFrame = document.getElementById("profile-img-frame");
  bandFrame.src = "/assets/Home/purplebox.png";
  var bandPriceText = document.getElementById("profile-price-text");
  bandPriceText.innerHTML = "The asking price for this band is";
  var bandPrice = document.getElementById("profile-price");
  bandPrice.innerHTML = "$"+otherBand.price;

  // add band clips section
  var bandSamplesWrapper = document.createElement("div");
  bandSamplesWrapper.className = "wrapper";
  new SampleCarousel(res=>{
    bandSamplesWrapper.append(res.carWrap);
    mainContent.append(bandSamplesWrapper);
  });

  // add band info
  var bandInfoSection = document.createElement("div");
  bandInfoSection.className = "band-info-section";
  var descH = document.createElement("h2");
  descH.innerHTML = "description";
  bandInfoSection.append(descH);
  var descP = document.createElement("p");
  descP.className = "description";
  descP.innerHTML = otherBand.description;
  bandInfoSection.append(descP);

  // band info grid
  if(otherBand.categories != null){
    var detailGrid = document.createElement("div");
    detailGrid.className = "band-detail-grid";
    // genres
    if(otherBand.categories.hasOwnProperty("genres")){
      var div1 = document.createElement("div");
      var genreH = document.createElement("h2");
      genreH.innerHTML = "genres";
      div1.append(genreH);
      var genreP = document.createElement("p");
      genreP.className = "genres";
      var genreString = "";
      for(var genre in otherBand.categories.genres){
        genreString += otherBand.categories.genres[genre];
        if(genre < otherBand.categories.genres.length - 1){
          genreString += ", ";
        }
      }
      genreP.innerHTML = genreString;
      div1.append(genreP);
      detailGrid.append(div1);
    }
    if(otherBand.categories.hasOwnProperty("insts")){
      // insts
      var div2 = document.createElement("div");
      var instH = document.createElement("h2");
      instH.innerHTML = "instruments";
      div2.append(instH);
      var instP = document.createElement("p");
      instP.className = "instruments"; //insts
      var instString = " ";
      for(var inst in otherBand.categories.insts){
        instString += otherBand.categories.insts[inst];
        if(inst < otherBand.categories.insts.length - 1){
          instString += ", ";
        }
      }
      instP.innerHTML = instString;
      div2.append(instP);
      detailGrid.append(div2);
    }
    if(otherBand.categories.hasOwnProperty("vibes")){
      // vibes
      var div3 = document.createElement("div");
      var vibesH = document.createElement("h2");
      vibesH.innerHTML = "vibes";
      div3.append(vibesH);
      var vibesP = document.createElement("p");
      vibesP.className = "vibes";
      var vibesString = " ";
      for(var vibe in otherBand.categories.vibes){
        vibesString += otherBand.categories.vibes[vibe];
        if(vibe < otherBand.categories.vibes.length - 1){
          vibesString += ", ";
        }
      }
      vibesP.innerHTML = vibesString;
      div3.append(vibesP);
      detailGrid.append(div3);
    }
    if(otherBand.categories.hasOwnProperty("gigTypes")){
      // good for
      var div4 = document.createElement("div");
      var goodForH = document.createElement("h2");
      goodForH.innerHTML = "good for these events";
      div4.append(goodForH);
      var goodForP = document.createElement("p");
      goodForP.className = "good-for";
      var goodForString = " ";
      for(var good in otherBand.categories.gigTypes){
        goodForString += otherBand.categories.gigTypes[good];
        if(good < otherBand.categories.gigTypes.length - 1){
          goodForString += ", ";
        }
      }
      goodForP.innerHTML = goodForString;
      div4.append(goodForP);
      detailGrid.append(div4);
    }
    bandInfoSection.append(detailGrid);
  }
  mainContent.append(bandInfoSection);
  setupAction();
  var spacer = document.createElement("div");
  spacer.className = "bottom-spacer";
  mainContent.append(spacer);
}

function createPageAsGig(){
  var mainContent = document.getElementById("main-content-wrapper");

  // load the gig name
  var profileTitle = document.getElementById("profile-title");
  profileTitle.innerHTML = otherGig.name;
  var profileCreator = document.getElementById("profile-creator");
  profileCreator.innerHTML = "created by: "+otherGig.creator;

  // add apply/message buttons
  var controls = document.getElementById("profile-controls");
  var newLiOne = document.createElement("li");
  var newAOne = document.createElement("a");
  newAOne.innerHTML = "Apply";
  newAOne.href = "#";
  newAOne.addEventListener("click",function(){
    hitApply();
  });
  newLiOne.append(newAOne);
  controls.append(newLiOne);
  var newLiTwo = document.createElement("li");
  var newATwo = document.createElement("a");
  newATwo.innerHTML = "Message";
  newATwo.href = "#";
  newATwo.addEventListener("click",function(){
    hitMessage();
  });
  newLiTwo.append(newATwo);
  controls.append(newLiTwo);

  // add gig image and price
  var gigImg = document.getElementById("profile-img");
  gigImg.src = otherGig.picture;
  var gigFrame = document.getElementById("profile-img-frame");
  gigFrame.src = "/assets/Home/purplebox.png";
  var gigPriceText = document.getElementById("profile-price-text");
  gigPriceText.innerHTML = "The asking price for this event is";
  var gigPrice = document.getElementById("profile-price");
  gigPrice.innerHTML = "$"+otherGig.price;

  // add gig info
  var gigInfoSection = document.createElement("div");
  gigInfoSection.className = "gig-info-section";
  var descH = document.createElement("h2");
  descH.innerHTML = "description";
  gigInfoSection.append(descH);
  var descP = document.createElement("p");
  descP.className = "description";
  descP.innerHTML = otherGig.description;
  gigInfoSection.append(descP);

  var addressH = document.createElement("h2");
  addressH.innerHTML = "address";
  var addressP = document.createElement("p");
  addressP.className = "gig-address";
  addressP.innerHTML = otherGig.address;
  gigInfoSection.append(addressP);

  var gigDetailGrid = document.createElement("div");
  gigDetailGrid.className = "gig-detail-grid";
  // date
  var div1 = document.createElement("div");
  var dateH = document.createElement("h2");
  dateH.innerHTML = "date";
  div1.append(dateH);
  var dateP = document.createElement("p");
  dateP.className = "date";
  dateP.innerHTML = otherGig.date;
  div1.append(dateP);
  gigDetailGrid.append(div1);
  // num apps
  var div2 = document.createElement("div");
  var appsH = document.createElement("h2");
  appsH.innerHTML = "number of applicants";
  div2.append(appsH);
  var appsP = document.createElement("p");
  appsP.className = "num-applicants";
  appsP.innerHTML = otherGig.applications.length;
  div2.append(appsP);
  gigDetailGrid.append(div2);
  // date
  var div3 = document.createElement("div");
  var startH = document.createElement("h2");
  startH.innerHTML = "start time";
  div3.append(startH);
  var startP = document.createElement("p");
  startP.className = "start-time";
  startP.innerHTML = otherGig.startTime;
  div3.append(startP);
  gigDetailGrid.append(div3);
  // date
  var div4 = document.createElement("div");
  var endH = document.createElement("h2");
  endH.innerHTML = "end time";
  div4.append(endH);
  var endP = document.createElement("p");
  endP.className = "end-time";
  endP.innerHTML = otherGig.endTime;
  div4.append(endP);
  gigDetailGrid.append(div4);

  gigInfoSection.append(gigDetailGrid);
  mainContent.append(gigInfoSection);
  var spacer = document.createElement("div");
  spacer.className = "bottom-spacer";
  mainContent.append(spacer);
}


function getUsername(){
  console.log("called fucntion getUsername");
  $.get('/user', {query:'nada'}, res=>{
    alert(JSON.stringify(res));
    var user = res;
    id = user['_id'];
    $('#userNameHeader').html(user['username']);
    socket.on(id, (msg)=>{
      alert('recieved message here it is: ' + JSON.stringify(msg));
    });
    getUserInfo(user);
  });
}
function getUserInfo(user){
  console.log('in get info and username is ' + user['username']);
  var username = user['username'];
  $.get('/getBands', {'creator':username}, result => {
    console.log("bands from db are: " + JSON.stringify(result));
    var bands = JSON.parse(JSON.stringify(result));
    user['bands']=bands;
    $.get('/getGigs', {'creator':username}, result => {
      console.log("gigs from db are: " + JSON.stringify(result));
      var gigs = JSON.parse(JSON.stringify(result));
      user['gigs']=gigs;
      createWebPage(user);
  	});
	});
}
function createWebPage(user){
  console.log(JSON.stringify(user));
  // get the stars
  var star1 = "user-star-1";
  var star2 = "user-star-2";
  var star3 = "user-star-3";
  var star4 = "user-star-4";
  var star5 = "user-star-5";
  var stars = [star1,star2,star3,star4,star5];
  // update the html for profile stars
}

function loadStars(rating, stars){
  var star1 = document.getElementById(stars[0]);
  var star2 = document.getElementById(stars[1]);
  var star3 = document.getElementById(stars[2]);
  var star4 = document.getElementById(stars[3]);
  var star5 = document.getElementById(stars[4]);
  star1.src = "/assets/Control-Center/star.png";
  star2.src = "/assets/Control-Center/star.png";
  star3.src = "/assets/Control-Center/star.png";
  star4.src = "/assets/Control-Center/star.png";
  star5.src = "/assets/Control-Center/star.png";

  var starVal = rating / 20.0;
  if(starVal == 5){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "inline-block";
    star4.style.display = "inline-block";
    star5.style.display = "inline-block";
  }
  else if(starVal < 5 && starVal >= 4.5){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "inline-block";
    star4.style.display = "inline-block";
    star5.src = "../static/assets/Control-Center/half-star.png";
    star5.className = "half-star";
    star5.style.display = "inline-block";
  }
  else if(starVal < 4.5 && starVal >= 4.0){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "inline-block";
    star4.style.display = "inline-block";
    star5.style.display = "none";
  }
  else if(starVal < 4.0 && starVal >= 3.5){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "inline-block";
    star4.src = "../static/assets/Control-Center/half-star.png";
    star4.className = "half-star";
    star4.style.display = "inline-block";
    star5.style.display = "none";
  }
  else if(starVal < 3.5 && starVal >= 3.0){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "inline-block";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 3.0 && starVal >= 2.5){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.src = "../static/assets/Control-Center/half-star.png";
    star3.className = "half-star";
    star3.style.display = "inline-block";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 2.5 && starVal >= 2.0){
    star1.style.display = "inline-block";
    star2.style.display = "inline-block";
    star3.style.display = "none";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 2.0 && starVal >= 1.5){
    star1.style.display = "inline-block";
    star2.src = "../static/assets/Control-Center/half-star.png";
    star2.className = "half-star";
    star2.style.display = "inline-block";
    star3.style.display = "none";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 1.5 && starVal >= 1.0){
    star1.style.display = "inline-block";
    star2.style.display = "none";
    star3.style.display = "none";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 1.0 && starVal >= 0.5){
    star1.src = "../static/assets/Control-Center/half-star.png";
    star1.className = "half-star";
    star1.style.display = "inline-block";
    star2.style.display = "none";
    star3.style.display = "none";
    star4.style.display = "none";
    star5.style.display = "none";
  }
  else if(starVal < 0.5 && starVal >= 0.0){
    star1.style.display = "none";
    star2.style.display = "none";
    star3.style.display = "none";
    star4.style.display = "none";
    star5.style.display = "none";
  }
}

function createContacts(contacts, yourUsername){
  contacts.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
  });

  var list = document.getElementById("contacts-content");

  var letters = {
    "a": false,
    "b": false,
    "c": false,
    "d": false,
    "e": false,
    "f": false,
    "g": false,
    "h": false,
    "i": false,
    "j": false,
    "k": false,
    "l": false,
    "m": false,
    "n": false,
    "o": false,
    "p": false,
    "q": false,
    "r": false,
    "s": false,
    "t": false,
    "u": false,
    "v": false,
    "w": false,
    "x": false,
    "y": false,
    "z": false
  };

  for(var person in contacts){
    var id = contacts[person]._id;
    var name = contacts[person].name;
    var lowercaseName = name.toLowerCase();
    if(!letters[lowercaseName.charAt(0)]){
      // add a letter div
      var letterDiv = document.createElement("div");
      letterDiv.className = "contacts-divider";
      var theLetter = document.createElement("h2");
      theLetter.className = "contacts-letter";
      var nameLetter = lowercaseName.charAt(0);
      theLetter.innerHTML = nameLetter;
      letterDiv.append(theLetter);
      var newLine = document.createElement("div");
      newLine.className = "contacts-line";
      letterDiv.append(newLine);
      list.append(letterDiv);
      letters[lowercaseName.charAt(0)] = true;
    }

    new ContactLink(name,id,contactLinkCallBack => {
      contactLinkCallBack.contactLink.addEventListener("click",function(event, ui){
        if(box) {
            box.chatbox("option", "boxManager").toggleBox();
            $(".ui-widget").remove();
            box = null;
            var newDiv = document.createElement("div");
            newDiv.id = "chat-div";
            document.body.append(newDiv);
        }
        else {
            var recipient = contactLinkCallBack.id;
            box = $("#chat-div").chatbox({recID: contactLinkCallBack.id,
                                          user:{ first_name: yourUsername },
                                          title : contactLinkCallBack.name,
                                          messageSent : function(id, user, msg) {
                                              // $("#log").append(id + " said: " + msg + "<br/>");
                                              $("#chat-div").chatbox("option", "boxManager").addMsg(user.first_name, msg);
                                              sendMessage(msg,recipient);
                                          }});
            for(var message in globalMessageArray[recipient]){
              var e = document.createElement('div');
              var newStringB = contactLinkCallBack.name + ": ";
              var newNameB = document.createElement("b");
              newNameB.innerHTML = newStringB;
              e.append(newNameB);
              var msgElement = document.createElement("i");
              msgElement.innerHTML = globalMessageArray[recipient][message].body;
              e.append(msgElement);
              e.className = "ui-chatbox-msg";
              $(e).css("maxWidth", $(".ui-chatbox-log").width());
              $(".ui-chatbox-log").append(e);
            }
        }
        console.log(contactLinkCallBack.contactLink.id);
      });
    });
  }
}

(function($) {
    $.widget("ui.chatbox", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 300, // relative to right edge of the browser window
            width: 300, // width of the chatbox

            messageSent: function(id, user, msg) {
                // override this
                this.boxManager.addMsg(user.first_name, msg);
            },
            boxClosed: function(id) {
              $(".ui-widget").remove();
              var newDiv = document.createElement("div");
              newDiv.id = "chat-div";
              document.body.append(newDiv);
              box = null;
            }, // called when the close icon is clicked
            boxManager: {
                // thanks to the widget factory facility
                // similar to http://alexsexton.com/?p=51
                init: function(elem) {
                    this.elem = elem;
                },
                addMsg: function(peer, msg) {
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.append(e);
                    $(e).hide();

                    var systemMessage = false;

                    if (peer) {
                        var peerName = document.createElement("b");
                        $(peerName).text(peer + ": ");
                        e.appendChild(peerName);
                    } else {
                        systemMessage = true;
                    }

                    var msgElement = document.createElement(
                        systemMessage ? "i" : "span");
                    $(msgElement).text(msg);
                    e.appendChild(msgElement);
                    $(e).addClass("ui-chatbox-msg");
                    $(e).css("maxWidth", $(box).width());
                    $(e).fadeIn();
                    self._scrollToBottom();

                    if (!self.elem.uiChatboxTitlebar.hasClass("ui-state-focus")
                        && !self.highlightLock) {
                        self.highlightLock = true;
                        self.highlightBox();
                    }
                },
                highlightBox: function() {
                    var self = this;
                    self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
                    self.elem.uiChatbox.effect("bounce", {times: 3}, 300, function() {
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });
                },
                toggleBox: function() {
                    this.elem.uiChatbox.toggle();
                },
                _scrollToBottom: function() {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);
                }
            }
        },
        toggleContent: function(event) {
            this.uiChatboxContent.toggle();
            if (this.uiChatboxContent.is(":visible")) {
                this.uiChatboxInputBox.focus();
            }
        },
        widget: function() {
            return this.uiChatbox
        },
        _create: function() {
            var self = this,
            options = self.options,
            title = options.title || "No Title",
            // chatbox
            uiChatbox = (self.uiChatbox = $('<div></div>'))
                .appendTo(document.body)
                .addClass('ui-widget ' +
                          'ui-corner-top ' +
                          'ui-chatbox'
                         )
                .attr('outline', 0)
                .focusin(function() {
                    // ui-state-highlight is not really helpful here
                    //self.uiChatbox.removeClass('ui-state-highlight');
                    self.uiChatboxTitlebar.addClass('ui-state-focus');
                })
                .focusout(function() {
                    self.uiChatboxTitlebar.removeClass('ui-state-focus');
                }),
            // titlebar
            uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
                .addClass('ui-widget-header ' +
                          'ui-corner-top ' +
                          'ui-chatbox-titlebar ' +
                          'ui-dialog-header' // take advantage of dialog header style
                         )
                .click(function(event) {
                    self.toggleContent(event);
                })
                .appendTo(uiChatbox),
            uiChatboxTitle = (self.uiChatboxTitle = $('<span id="chat_title"></span>'))
                .html(title)
                .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarClose = (self.uiChatboxTitlebarClose = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                          'ui-chatbox-icon '
                         )
                .attr('role', 'button')
                .hover(function() { uiChatboxTitlebarClose.addClass('ui-state-hover'); },
                       function() { uiChatboxTitlebarClose.removeClass('ui-state-hover'); })
                .click(function(event) {
                    uiChatbox.hide();
                    self.options.boxClosed(self.options.id);
                    return false;
                })
                .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarCloseText = $('<span id="chat_closer"></span>')
                .addClass('ui-icon ' +
                          'ui-icon-closethick')
                .text('X')
                .appendTo(uiChatboxTitlebarClose),
            uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-content '
                         )
                .appendTo(uiChatbox),
            uiChatboxLog = (self.uiChatboxLog = self.element)
                .addClass('ui-widget-content ' +
                          'ui-chatbox-log'
                         )
                .appendTo(uiChatboxContent),
            uiChatboxInput = (self.uiChatboxInput = $('<div></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-input'
                         )
                .click(function(event) {
                    // anything?
                })
                .appendTo(uiChatboxContent),
            uiChatboxInputBox = (self.uiChatboxInputBox = $('<textarea></textarea>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-input-box ' +
                          'ui-corner-all'
                         )
                .appendTo(uiChatboxInput)
                .keydown(function(event) {
                    if (event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
                      console.log("detected enter");
                        msg = $.trim($(this).val());
                        if (msg.length > 0) {
                            self.options.messageSent(self.options.id, self.options.user, msg);
                        }
                        $(this).val('');
                        return false;
                    }
                })
                .focusin(function() {
                    uiChatboxInputBox.addClass('ui-chatbox-input-focus');
                    var box = $(this).parent().prev();
                    box.scrollTop(box.get(0).scrollHeight);
                })
                .focusout(function() {
                    uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
                });

            // disable selection
            uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();

            // switch focus to input box when whatever clicked
            uiChatboxContent.children().click(function() {
                // click on any children, set focus on input box
                self.uiChatboxInputBox.focus();
            });

            self._setWidth(self.options.width);
            self._position(self.options.offset);

            self.options.boxManager.init(self);

            if (!self.options.hidden) {
                uiChatbox.show();
            }
        },
        _setOption: function(option, value) {
            if (value != null) {
                switch (option) {
                case "hidden":
                    if (value)
                        this.uiChatbox.hide();
                    else
                        this.uiChatbox.show();
                    break;
                case "offset":
                    this._position(value);
                    break;
                case "width":
                    this._setWidth(value);
                    break;
                }
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _setWidth: function(width) {
            this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
            this.uiChatboxInput.width(width + "px");
            // padding:2, boarder:2, margin:5
            this.uiChatboxInputBox.width(width + "px");
        },
        _position: function(offset) {
            this.uiChatbox.css("right", offset);
        }
    });
}(jQuery));

class ContactLink {
  constructor(name,id, contactLinkCallBack){
    var list = document.getElementById("contacts-content");
    console.log("in constructor");
    this.contactLink = document.createElement("a");
    this.contactLink.href = "#";
    this.contactLink.id = "contact-link-"+id;
    this.contactLink.className = "contacts-link";
    this.contactLink.innerHTML = name;
    this.name = name;
    this.id = id;
    list.append(this.contactLink);
    contactLinkCallBack(this);
  }
}

function setupAction(){
  var jcarousel = $('.jcarousel');

  jcarousel
      .on('jcarousel:reload jcarousel:create', function () {
          var carousel = $(this),
              width = carousel.innerWidth();

          if (width >= 600) {
              width = width / 4;
          } else if (width >= 350) {
              width = width / 2;
          }

          carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
      })
      .jcarousel({
          wrap: 'circular'
      });

  $('.jcarousel-control-prev')
      .jcarouselControl({
          target: '-=1'
      });

  $('.jcarousel-control-next')
      .jcarouselControl({
          target: '+=1'
      });

  $('.jcarousel-pagination')
      .on('jcarouselpagination:active', 'a', function() {
          $(this).addClass('active');
      })
      .on('jcarouselpagination:inactive', 'a', function() {
          $(this).removeClass('active');
      })
      .on('click', function(e) {
          e.preventDefault();
      })
      .jcarouselPagination({
          perPage: 1,
          item: function(page) {
              return '<a href="#' + page + '">' + page + '</a>';
          }
      });

  $('.carousel-img').hover(
    //Handler In
    function(){
      console.log("enter-img");
    },
    //Handler Out
    function(){
      console.log("exit-img");
    }
  );

  $('.carousel-li').hover(
    //Handler In
    function(){
      console.log("enter-li");
    },
    //Handler Out
    function(){
      console.log("exit-li");
    }
  );
}

var contactsButton = document.getElementById('contacts-button');
var contactsSidebar = document.getElementById('contacts-sidebar');
var open = false;
contactsButton.addEventListener("click",function(){
  console.log("clicked, "+open);
  if(open){
    document.getElementById('contacts-sidebar').style.display = 'none';
  }else{
    document.getElementById('contacts-sidebar').style.display = 'block';
  }
  open = !open;
});
