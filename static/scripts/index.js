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

// AB Brooks Zone

var rain = null,
drops = [],
rainTimer = null,
maxDrops = 15;

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

	rainTimer = setInterval(addDrop, 1000);
	setInterval(animate, 30);
	//alert(window.location.href);
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


function addDrop(){
	if (drops.length == maxDrops){
		// do nothing
	}else{
		drops[drops.length] = new Drop();
		drops[drops.length-1].id = drops.length;
	}
}

var pausedDrop = null;
var lastX = 99999;

class Drop {

	constructor(){
		//console.log("creating drop")
		this.id = 0;
		this.theDiv = document.createElement("div");
		this.theDiv.className = "rainDrop";
		this.width = 120;
		this.height = 120;
		this.x = checkProximity();
		this.y = -120;
		this.UpdateDiv();

		// var r = RandColor();
		// var g = RandColor();
		// var b = RandColor();
		// this.theDiv.style.backgroundColor = "rgba("+r+","+g+","+b+",1.0)";
		var colorString = RandColorRange();
		this.theDiv.style.backgroundColor = colorString;
		this.theDiv.paused = false;
		this.theDiv.dropRef = this;
		this.audio = new Audio();
		this.audio.src = "../static/assets/Home/transvertion.mp3";
		this.audio.type='audio/mp3';
		// this.theButton = document.createElement("p");
		// this.theButton.innerHTML = "text";
		// this.theDiv.appendChild(this.theButton);
    this.theImg = document.createElement("img");
    this.theImg.style.width = "110px"
    this.theImg.style.height = "110px"
    this.theImg.style.margin = "5px"
    this.theImg.style.borderRadius = "6px"
    this.theImg.style.backgroundColor = "white";
    var img = RandImg();
    this.theImg.src = "../static/assets/Home/Art/" + img;
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
			 }
		else{
			this.audio.pause();
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
	var x = Math.random()*(window.innerWidth-120);
	while(x <= lastX+120 && x >= lastX-120){
		//console.log("recalculating");
		x = Math.random()*(window.innerWidth-120);
	}
	lastX = x;
	return x;
}

function RandColor(){
	return Math.random() * 255;
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

// Sam Westerhack Zone

// $("#search_button").addEventListener('click', searchHit);
// $("#login_button").addEventListener('click',loginHit);
// $("#sign_in_button").addEventListener('click',signInHit);
// var searchField=$('#searchText');

(function($) {
	$(function() {
		$('#login_button').click(loginHit);
		$('#sign_in_button').click(signInHit);
	});
})(jQuery);

//classes
class User{
	constructor(){
		this.name="";
		this.password="";
		this.type="";
		this.bandID="";
		this.events=[];
		this.email="";
		this.phone="";
		this.sessionID="";
		this.lat=0.0;
		this.lng=0.0;
		this.address="";
	}
}
class Sample{
	constructor(pic,audio){
		this.pic=pic;
		this.audio=audio;
	}
}
class Band{
	constructor(json){
		this.memebers=json["members"];
		this.name=json["name"];
		this.id=json["id"];
		this.gigs=json["gigs"];
		this.instruments=json["instruments"];
		this.rating=json["rating"];
		this.genres=json["genres"];
		this.samples=json["samples"]
		this.profPic=json["profPic"];
	}

}
class Gig{
	constructor(json){
		this.date=json["date"];
		this.price=json["price"];
		this.isOpen=json["open"];
		this.id=json["id"];
		this.bandID=json["bandID"];
		this.posterID=json["posterID"];
		this.genres=json["genres"];
		this.type=json["type"];
		this.isDone=json["done"];
		this.isAlc=json["isAlc"];
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
	$.get("/search", { type: "musicians", query: $("#search_input").val() }, result => {
		alert(`result is ${result}`);
	});
}

function search_gigs() {
	$.get("/search", { type: "gigs", query: $("#search_input").val() }, result => {
		alert(`result is ${result}`);
	});
}

function post_gig() {
	$.post("/post_gig", { query: $("#search_input").val() }, result => {
		alert(`result is ${result}`);
	});
}

function flipTicker(){
	console.log("got into flip ticker func");
	$("#flip-box-inner0").flip({
		 trigger: 'manual',
		 axis:'x'
	});
	$('#flip-box-inner0').flip('toggle');
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

/*
//this is the function to handle the search bar
function searchHit(type){
	var content = { type: type, query: $("#search_input").val() };
	var method;
	switch(type) {
		case "find_musicians": case "find_gigs":
			method = $.get;
			break;
		case "post_gig":
			method = $.post;
			break
	}

	(method)("/search", content, result => {
		if (result.success) {
			alert(`success! result: ${result.result}.`)
		} else {
			alert(`failure! cause: ${result.cause}.`)
		}
	});

	/*
	alert("search was hit!");
	var bands=[];
	var gigs=[];
	searchText=searchField.value;
	switch(searchMode){
		case "bands":
		$.get('/bands', {query:searchText}, function(data){
			$.each(data, function(key,val){
				var band = new Band(val);
				bands.push(band);
			});
		});
		//Now we gotta take this the bands a pass them to the next page, and display them
		break;
		case "gigs":
		$.get('/gigs', {query:searchText}, function(data){
			$.each(data, function(key,val){
				var gig = new Gig(val);
				gigs.push(gig);
			});
		});
		//Now we gotta take this the gigs a pass them to the next page, and display them
		break;
		case "postEvent":
		$.post('/gigs', {query:searchText});
		break;
	}
};*/
