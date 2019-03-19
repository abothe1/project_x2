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
var categories = {};
// AB Brooks Zone

var rain = null,
drops = [],
rainTimer = null,
maxDrops = 15;
getLocation();
getCurrentEvents();
var categories = {};
var debugLayout = false;
var isLoggedIn=false;
//setInterval(getCurrentEvents, 60000);
$.getScript('assets/banks.js', function(data, status)
{
  console.log("dtata from loading banks is : " + data);
  //banks = data.BANKS;
  if (BANKS){
    console.log(BANKS);
    for (var key in BANKS){
      console.log(key);
        console.log("banks are " + BANKS[key]);
        categories[key]={'wordBank' : BANKS[key]};
      //  categoires[key]={'fromQueryStr' : []};
    }
  }
  else{
    console.log("banks from the script was null");
  }

});

// AB document stuff//
function init(){

	container = document.getElementById("container");
	container.width = window.innerWidth;
	container.height = window.innerHeight;

	rain = document.getElementById("rain");
	rain.width  = window.innerWidth;
	rain.height  = window.innerHeight;

	window.addEventListener('resize', function(){
		console.log("resized");
		rain.width  = window.innerWidth;
		rain.height  = window.innerHeight;
	});

  if(!debugLayout){
    rainTimer = setInterval(addDrop, 1600);
  	setInterval(animate, 40);
  }
}

function animate() {
		Update();
}

function Update(){
	for(var i = 0; i < drops.length; i++){
		if(drops[i].paused){
			// pause

		}else{
			if (drops[i].y < window.innerHeight){
				drops[i].UpdatePosition(3);
			}else{
				//Remove the drop
				var drop = drops[i].theDiv;
				drop.parentNode.removeChild(drop);
				drops.splice(i, 1);
			}
		}
	}
}

var stepper = 0;

function addDrop(){
	if (drops.length == maxDrops){
		// do nothing
	}else{
		drops[drops.length] = new Drop(stepper);
    if(stepper < 2){
      stepper++;
    }else{
      stepper = 0;
    }
		drops[drops.length-1].id = drops.length;
	}
}

var pausedDrop = null;
var lastX = 99999;

class Drop {

	constructor(stepper){
		//console.log("creating drop")
		this.id = 0;
		this.theDiv = document.createElement("div");
		this.theDiv.className = "rainDrop";
    this.theDiv.style.backgroundImage = RandFrame();
    this.theDiv.style.backgroundSize = "contain";
    console.log("Stepper:",stepper);

    this.theImg = document.createElement("img");
    this.theImg.style.opacity = "0.6";
    this.theImg.style.borderRadius = "4px"
    this.theImg.style.backgroundColor = "white";
    var img = RandImg();
    this.theImg.src = "/assets/Home/Art/" + img;

    switch(stepper){
      case 0:
        this.width = 200;
        this.height = 200;
        this.x = checkProximity();
        this.y = -200;
        this.theImg.style.width = "194px"
        this.theImg.style.height = "194px"
        this.theImg.style.margin = "3px"
        break;
      case 1:
        this.width = 160;
        this.height = 160;
        this.x = checkProximity();
        this.y = -160;
        this.theImg.style.width = "154px"
        this.theImg.style.height = "154px"
        this.theImg.style.margin = "3px"
        break;
      case 2:
        this.width = 120;
        this.height = 120;
        this.x = checkProximity();
        this.y = -120;
        this.theImg.style.width = "116px"
        this.theImg.style.height = "116px"
        this.theImg.style.margin = "2px"
        break;
    }

		this.UpdateDiv();

		// var r = RandColor();
		// var g = RandColor();
		// var b = RandColor();
		// this.theDiv.style.backgroundColor = "rgba("+r+","+g+","+b+",1.0)";
		//var colorString = RandColorRange();
		//this.theDiv.style.backgroundColor = colorString;
		this.theDiv.paused = false;
		this.theDiv.dropRef = this;
		this.audio = new Audio();
		this.audio.src = "/assets/Home/transvertion.mp3";
		this.audio.type='audio/mp3';
		// this.theButton = document.createElement("p");
		// this.theButton.innerHTML = "text";
		// this.theDiv.appendChild(this.theButton);

    // this.theBg = document.createElement("img");
    // this.theBg.style.width = "120px"
    // this.theBg.style.height = "120px"

    this.theDiv.appendChild(this.theImg);
		rain.appendChild(this.theDiv);
		this.AddClickToDiv();
	}

	playAudio() {
		 var playPromise = this.audio.play();

		 if (playPromise !== undefined) {
				 playPromise.then(function () {
						 console.log('Playing....');
				 }).catch(function (error) {
						 console.log('Failed to play....' + error);
				});
		}
	}

	TogglePaused(){
		this.paused = !this.paused;
		 if(this.paused){
			 this.playAudio();
       this.theImg.style.opacity = "1.0";
       this.theDiv.style.zIndex = "1";
			 }
		else{
			this.audio.pause();
      this.theImg.style.opacity = "0.6";
      this.theDiv.style.zIndex = "0";
			}
	}

	AddClickToDiv(){
		this.theDiv.addEventListener('click',function(){
			this.dropRef.TogglePaused();
		},false);
	}

	UpdateDiv(){
		this.xString = this.x+"px";
		this.yString = this.y+"px";
		this.widthString = this.width+"px";
		this.heightString = this.height+"px";
		this.idString = "drop"+this.id;
		this.theDiv.id = this.idString;
		this.theDiv.style.width = this.widthString;
		this.theDiv.style.height = this.widthString;
		this.theDiv.style.left = this.xString;
		this.theDiv.style.top = this.yString;
	}

	UpdatePosition(speed){
		this.y += speed;
		this.UpdateDiv();
	}

}

function checkProximity(){
	var x = Math.random()*(window.innerWidth-200);
	while(x <= lastX+200 && x >= lastX-200){
		//console.log("recalculating");
		x = Math.random()*(window.innerWidth-200);
	}
	lastX = x;
	return x;
}

function RandColor(){
	return Math.random() * 255;
}

function RandFrame(){
  min = Math.ceil(1);
	max = Math.floor(4);
	num = Math.floor(Math.random() * (max - min + 1)) + min;
  switch(num){
    case 1:
      return "url('/assets/Home/orangebox.png')";
      break;
    case 2:
      return "url('/assets/Home/pinkbox.png')";
      break;
    case 3:
      return "url('/assets/Home/purplebox.png')";
      break;
    case 4:
      return "url('/assets/Home/redbox.png')";
      break;
  }
}

function RandColorRange(){
	min = Math.ceil(1);
	max = Math.floor(3);
	num = Math.floor(Math.random() * (max - min + 1)) + min;
	switch(num){
		//rising blue
		case 1:
			newMin = 105;
			newMax = 255;
			blue = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
			return "rgba(255,0,"+blue+",1.0)";
			break;
		//diminishing red
		case 2:
			newMin = 0;
			newMax = 255;
			red = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
			return "rgba("+red+",0,255,1.0)";
			break;
		//rising green
		case 3:
			newMin = 0;
			newMax = 156;
			green = Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
			return "rgba(0,"+green+",255,1.0)";
			break;
	}
}

var imgIndex = 0;
var images = ["1.jpg","2.jpeg","3.jpeg","4.jpeg","5.jpeg","6.jpeg","7.jpeg","8.jpeg","9.jpeg","10.jpeg","11.jpeg","12.jpeg","13.jpeg","14.jpeg","15.jpeg","16.jpeg","17.jpeg","18.jpeg","19.jpeg","20.jpeg"];

function RandImg(){
  if(imgIndex == 0){
    var array = images;
    // Shuffle the array via Fisher–Yates Shuffle
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    images = array;
  }
  var img = images[imgIndex];
  if(imgIndex < 19){
    imgIndex++;
  }else{
    imgIndex = 0;
  }
  return img;
}


(function($) {
	$(function() {
		$('#login_button').click(loginHit);
		$('#sign_in_button').click(signInHit);
	});
})(jQuery);

//classes

class Sample{
	constructor(pic,audio){
		this.pic=pic;
		this.audio=audio;
	}
}



//global vars
var samples = [];
var musicBlocks = [];
var searchMode="bands";

console.log("script was loaded int the htmllll!");
//register goes here
function loginHit(){
	console.log("got into login hit");
};
function signInHit(){
	console.log("got into signInHit");
};
//sessions go here

// this is the code for getting our bands, then converitng them into music blocks
$.get('/bands', function(data){
	$.each(data, function(key,val){
		samples.push(val['samples']);
	});
});
for (var s in samples){
	var musicBlock = {
	 pic:s["pic"],
	 audio:s["audio"]
 };
	musicBlocks.push(musicBlock);
}


function search_musicians() {
  var query = $("#search_input").val();
  window.location.href='search_page?query='+query+'&mode=findBands&gigName="null"';
}

function search_gigs() {
  var query = $("#search_input").val();
  window.location.href='search_page?query="'+query+'&mode=findGigs&bandName="null"';
}


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("browser doesnt support geolocator api");
  }
}

function showPosition(position) {
	console.log(position);
	currLat=position["coords"]["latitude"];
	currLng=position["coords"]["longitude"];
	console.log("curr Lat is: " + currLat);
	console.log("curr lng is: " + currLng);
}

function parseQueryString(str){
  var categoriesFromStr={};
  var lowerCased = str.toLowerCase();
  console.log("in parse q str the lower cased str is "+str);
  for (key in categories){
    categoriesFromStr[key]=[];
    console.log("key is " + key);
    console.log("banks are " + categories[key]['wordBank']);
    for (word in categories[key]['wordBank']){
      console.log("word is : " + categories[key]['wordBank'][word]);
      if (lowerCased.includes(categories[key]['wordBank'][word])){
        console.log("word is in if : " + categories[key]['wordBank'][word]);
        categoriesFromStr[key].push(categories[key]['wordBank'][word]);
      }
    }
  }
  console.log("in parse from str, the categories from str are now" + categoriesFromStr);
  return categoriesFromStr;
}

// current events stuff//
function getCurrentEvents(){
  $.get('/current_events', {}, result => {
    console.log("events from db are: " + JSON.stringify(result));
    handleEventsWithTicker(result);
	});
}

function handleEventsWithTicker(result){
  console.log("Events in handle events wth ticker are " + events);
  var events = JSON.parse(JSON.stringify(result));
  $("#frontText").html("Live Booking Feed");
  $("#backText").html("");
  var sortedEventsAndDates = sortEventsByDate(events);
  var sortedEvents=[];
  for (e in sortedEventsAndDates){
    var evnt = sortedEventsAndDates[e];
    sortedEvents.push(evnt[0]);
  }
  console.log("in handleEventsWithTicker and sorted events is : " + JSON.stringify(sortedEvents));
  var i = -1;
  var internalTicker = setInterval(function(){
    ++i;
    if (i >= sortedEvents.length) {
       i = 0;
    }
    var evt = sortedEvents[i];
    console.log(" for x in sorted evetns evt is : " + JSON.stringify(evt));
    var genre = evt.categories.genres[0];
    var type = evt.categories.gigTypes[0];
    var price = evt["price"];
    $("#frontText").html("A(n) " + genre + " artist was just booked for a(n) " + type + ", for $" + price);
    $("#backText").html("A(n) " + genre + " artist was just booked for a(n) " + type + ", for $" + price);
    flipTicker();
  }, 5000);
}

function sortEventsByDate(events){
  var today = new Date();
  var eventsToDateDiff = [];
  for (e in events){
    var evnt = events[e];
    console.log("e is in sort events by date" + JSON.stringify(evnt));
    var dateDiff = diff_minutes(stringToDate(evnt.startDate), today);
    eventsToDateDiff.push([evnt,dateDiff]);
  }
  var sortedEvents = sortDict(eventsToDateDiff);
  console.log("sorted events in sort events by date is : " + JSON.stringify(sortedEvents));
  return sortedEvents;
}

function diff_minutes(dt2, dt1) {
	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= 60;
  console.log("in diff minutes and the diff in minutes is : " + diff);
	return Math.abs(Math.round(diff));
 }

 function sortDict(dict){
   console.log('dict in sort dict is : ' + JSON.stringify(dict));
 	 dict.sort(function(first, second) {
 		 return first[1]-second[1];
 	 });
 	 return dict;
 }

 function flipTicker(){
 	console.log("got into flip ticker func");
 	$("#flip-box-inner0").flip({
 		 trigger: 'manual',
 		 axis:'x'
 	});
 	$('#flip-box-inner0').flip('toggle');
 }


//login and register stuff//

	function login() {
    console.log("got into login function on frontend");
		var content = {
			username: $("#loginUsername").val(),
			password: $("#loginPassword").val(),
		}
    $.post('/login', content, res=>{
      console.log("Got res from login herre it is: " + JSON.stringify(res));
      if(res.success){
        isLoggedIn=true;
      }
      else{
        isLoggedIn=false;
      }
    });
	}


  function register() {
    console.log("got into register func");
    var content = {
    username: $("#reg_username").val(),
    email: $("#reg_email").val(),
    password: $("#reg_password").val()
    };

    $.post('/register', content, res=>{
      alert(JSON.stringify(res));
    });
  }
  function stringToDate(str){
    var date = new Date(str);
    console.log("in string to date and adate is " + date);
    return date;
  }

  function deleteCol(mode){
    $.post('/delete', {'mode':mode}, result=>{
      alert(result);
    });
  }
