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
  	});
  }
  else{
    gigName = String(gigName);
    gigName=gigName.replace(/%20/g, " ");
    gigName=gigName.replace(/%22/g, "");
    console.log("gig name is : " + gigName);
    $.get("/search", { 'mode': "findBands", 'query': searchTxt, 'gigName': gigName}, result => {
    		alert(`result is ${JSON.stringify(result)}`);
    	});
  }

}
