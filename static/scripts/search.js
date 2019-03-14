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
function init(){
  var urlJSON = parseURL(window.location.href);
  console.log(JSON.stringify(urlJSON));
  performSearch(urlJSON);

  var theGrid = document.getElementById("grid-container");
  /*
  var images = ["1.jpg","2.jpeg","3.jpeg","4.jpeg","5.jpeg","6.jpeg","7.jpeg","8.jpeg","9.jpeg","10.jpeg","11.jpeg","12.jpeg","13.jpeg","14.jpeg","15.jpeg","16.jpeg","17.jpeg","18.jpeg","19.jpeg","20.jpeg"];
  for(i in images){
    var newDiv = document.createElement("div");
    newDiv.style.backgroundImage = "url(/assets/Home/Art/"+images[i]+")";
    // var newImg = document.createElement("img");
    // newImg.src = "../static/assets/Home/Art/"+images[i];
    // newDiv.appendChild(newImg);
    var nameDiv = document.createElement("div");
    nameDiv.className = "result-name-div";
    var nameP = document.createElement("p");
    nameP.innerHTML = images[i];
    // nameDiv.className = "result-name-p";
    // nameDiv.innerHTML = images[i];
    nameDiv.appendChild(nameP);
    newDiv.appendChild(nameDiv);
    theGrid.appendChild(newDiv);
    console.log("appended");
  }
  */
}

var state = 0;

function changeState(newState){
  if(newState == state){
    // do nothing
  }else{
    var m = document.getElementById("m");
    var mv = document.getElementById("mv");
    var v = document.getElementById("v");

    switch(newState){
      case 0:
        m.src = "/assets/Search/m_filter_selected.png";
        mv.src = "/assets/Search/mv_filter.png"
        v.src = "/assets/Search/v_filter.png"
        state = 0;
        filterResults();
        break;
      case 1:
        m.src = "/assets/Search/m_filter.png";
        mv.src = "/assets/Search/mv_filter_selected.png"
        v.src = "/assets/Search/v_filter.png"
        state = 1;
        filterResults();
        break;
      case 2:
        m.src = "/assets/Search/m_filter.png";
        mv.src = "/assets/Search/mv_filter.png"
        v.src = "/assets/Search/v_filter_selected.png"
        state = 2;
        filterResults();
        break;
    }
  }
}


function filterResults(){
  console.log(state);
}

function doesContainID(id, arr){
  console.log("IN CONATINS ID and id is : "  +  id);
  for (item in arr){
    console.log("IN CONATINS ID and id in for loop is : "  +  arr[item]);
    if (arr[item]==id){
      return true;
    }
  }
  return false;
}

function performSearch(json){
  var mode = json['searchObject']['mode'];
  var searchTxt = json["searchObject"]['query'];
  var gigName = json["searchObject"]['gigName'];
  var bandName = json["searchObject"]['bandName'];
  if (mode==null){
    console.log("Error: there was no mod supplied");
    return;
  }
  if (searchTxt==null){
    console.log("Error: there was no search Text supplied");
    return;
  }
   searchTxt=String(searchTxt);
   searchTxt=searchTxt.replace(/%20/g, " ");
   searchTxt=searchTxt.replace(/%22/g, "");
  if (gigName==null&&bandName==null){
    //serach with no name
  }
  else if(gigName==null){
    bandName = String(bandName);
    bandName=bandName.replace(/%20/g, " ");
    bandName=bandName.replace(/%22/g, "");
    console.log("band name is : " + bandName);
    $.get("/search", { 'mode': "findGigs", 'query': searchTxt, 'bandName': bandName }, result => {
  		  alert(`result is ${JSON.stringify(result)}`);
        showResults(mode, null, result);
  	});
  }
  else{
    gigName = String(gigName);
    gigName=gigName.replace(/%20/g, " ");
    gigName=gigName.replace(/%22/g, "");
    console.log("gig name is : " + gigName);
    $.get("/search", { 'mode': "findBands", 'query': searchTxt, 'gigName': gigName}, result => {
    		alert(`result is ${JSON.stringify(result)}`);
        showResults(mode, result, null);

    	});
  }

}

function showResults(mode, bands, gigs){
  var theGrid = document.getElementById("grid-container");
  if(bands==null){
    var mixedGigArr=[];
    var idsInMix = [];
    var j = 0;
    for (gig in gigs['data']['queryMatchers']){
      if (doesContainID(gigs['data']['queryMatchers'][gig][0]._id, idsInMix)){

      }
      else{
        mixedGigArr.push(gigs['data']['queryMatchers'][gig]);
        idsInMix.push(gigs['data']['queryMatchers'][gig][0]._id);
      }
      if (j<gigs['data']['overallMatchers'].length){
        if (doesContainID(gigs['data']['overallMatchers'][j][0]._id, idsInMix)){

        }
        else{
          mixedGigArr.push(gigs['data']['overallMatchers'][j]);
          idsInMix.push(gigs['data']['overallMatchers'][j][0]._id);
        }
        j=j+1;
      }
    }
    while (j<gigs['data']['overallMatchers'].length){
      mixedGigArr.push(gigs['data']['overallMatchers'][j]);
      j=j+1;
    }
    for (gig in mixedGigArr){
      var newDiv = document.createElement("div");
    //  newDiv.style.backgroundImage = "url(/assets/Home/Art/"+testBands.data.overallMatchers[gig][0].picture+")";
      var nameDiv = document.createElement("div");
      nameDiv.className = "result-name-div";
      var nameP = document.createElement("p");
      nameP.innerHTML = mixedGigArr[gig][0].name;
      nameDiv.appendChild(nameP);
      newDiv.appendChild(nameDiv);
      theGrid.appendChild(newDiv);
      console.log("appended");
    }
  }
  else{
    var mixedBandArr = [];
    var idsInMixBands = [];
    var i = 0;
    for (band in bands['data']['queryMatchers']){
      if (doesContainID(bands['data']['queryMatchers'][band][0]._id, idsInMixBands)){

      }
      else{
      mixedBandArr.push(bands['data']['queryMatchers'][band]);
      idsInMixBands.push(bands['data']['queryMatchers'][band][0]._id);
      }
      if (i<bands['data']['overallMatchers'].length){
        if (doesContainID(bands['data']['overallMatchers'][i][0]._id, idsInMixBands)){

        }
        else{
          mixedBandArr.push(bands['data']['overallMatchers'][i]);
          idsInMixBands.push(bands['data']['overallMatchers'][i][0]._id);
        }
        i=i+1;
      }
    }
    while (i<bands['data']['overallMatchers'].length){
      mixedBandArr.push(bands['data']['overallMatchers'][i]);
      i=i+1;
    }
    for(band in mixedBandArr){
      var newDiv = document.createElement("div");
      //newDiv.style.backgroundImage = "url(assets/Home/Art/"+mixedBandArr[band].picture+")";
      var nameDiv = document.createElement("div");
      nameDiv.className = "result-name-div";
      var nameP = document.createElement("p");
      nameP.innerHTML = mixedBandArr[band][0].name;
      nameDiv.appendChild(nameP);
      newDiv.appendChild(nameDiv);
      theGrid.appendChild(newDiv);
      console.log("appended");
    }
  }
  /*
  var testBandsString = '{'+
    '"success":true,'+
    '"data":{'+
      '"overallMatchers":'+
      '['+
        '[{'+
          '"_id":"5c54ea2d24bd4109a7ed846d",'+
          '"name":"band1",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":null,'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1","lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"1.jpg"'+
        '},null],'+
        '[{'+
          '"_id":"5c55036ba417231025d91fd2",'+
          '"name":"band1",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1","lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"2.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band4",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"3.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band5",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"4.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band6",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"6.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"8.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"9.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"10.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"11.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"12.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"13.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"14.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"15.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"16.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"17.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"18.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"19.jpeg"'+
        '},null],'+
        '[{'+
          '"_id":"5c5504d1b4583f109389e8c7",'+
          '"name":"band7",'+
          '"address":"N27 W5230",'+
          '"zipcode":"53012",'+
          '"price":"10",'+
          '"openDates":["2019-01-26T14:22"],'+
          '"applicationText":"We are a good band",'+
          '"lat":"100.1",'+
          '"lng":"109.2",'+
          '"categories":null,'+
          '"appliedGigs":[],'+
          '"upcomingGigs":[],'+
          '"finishedGigs":[],'+
          '"audioSamples":null,'+
          '"videoSamples":null,'+
          '"picture":"20.jpeg"'+
        '},null]'+
      '],'+
      '"queryMatchers":[]'+
    '}'+
  '}';

  var testBands = JSON.parse(testBandsString);
  var theGrid = document.getElementById("grid-container");

  for(band in resultBands["data"]["overallMatchers"]){
    var newDiv = document.createElement("div");
    newDiv.style.backgroundImage = "url(/assets/Home/Art/"+testBands.data.overallMatchers[band][0].picture+")";
    var nameDiv = document.createElement("div");
    nameDiv.className = "result-name-div";
    var nameP = document.createElement("p");
    nameP.innerHTML = testBands.data.overallMatchers[band][0].name;
    nameDiv.appendChild(nameP);
    newDiv.appendChild(nameDiv);
    theGrid.appendChild(newDiv);
    console.log("appended");
  }
  */
}
