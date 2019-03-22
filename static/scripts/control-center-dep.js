// helpful snippet for later
// jQuery('<div/>', {
//     id: 'some-id',
//     class: 'some-class',
//     title: 'now this div has a title!'
// }).appendTo('#mySelector');

// 1. Loads in all bands and events created by user
// 2. Loads in upcoming gigs accepted, applications, and past gigs
// 3. Loads in accepted bands and applications for each event
// 4. Loads in favorites/old text conversations
// 5. Uses firebase to allow for messaging.
// 6. can book/accept/message/favorite a profile
// 7. Can create new bands/events
// 8. Can add media and edit any information about existing bands/gigs/media

//must implement getting the session data;
//var username = getusernamefromsession;
// var got = require('./chatbox.mjs');

function getBandInfo(bandID){
  // var exampleBand =
  // "{+
  //   "'name':'Deadulus',"+
  //   "'creator':'xxx',"+
  //   "'address':'N27 W5230',"+
  //   "'zipcode': 53012,"+
  //   "'price': 33,"+
  //   "'rating':null,"+
  //   "'openDates':'[2019-01-26T14:22]'," +
  //   "'application':'We are a good band',"+
  //   "'lat': 100.1,"+
  //   "'lng': 109.2,"+
  //   "'audioSamples':[],"+
  //   "'videoSamples':[],"+
  //   "'picture':'../static/assets/Home/Art/9.jpeg',"+
  //   "'appliedGigs':["+
  //     "'gigneat23',"+
  //     "'gigawesome12'"+
  //   "],"+
  //   "'categories':{"+
  //     "'genres':[],"+
  //     "'vibes':[],"+
  //     "'insts':[],"+
  //     "'gigTypes':[]"+
  //   "}"+
  // "}";
  // actually get a band info
  var exampleBand = {'name':'Deadalus', '_id': 'ab18110asadafds', 'creator':'xxx', 'address':"N27 W5230", 'zipcode': 53012, 'price': 26, 'rating':null, 'openDates':["2019-01-26T14:22"], 'application':"We are a good band", 'lat': 100.1, 'lng': 109.2, 'audioSamples':[], 'videoSamples':[], 'picture':"../static/assets/Home/Art/9.jpeg", 'appliedGigs':['gigneat23', 'gigawesome12'], 'categories':{'genres':[],'vibes':[],'insts':[],'gigTypes':[]}};
  return exampleBand;
}

function getGigInfo(gigID){
  // actually get a gig info
  var exampleGig = {"name": "the rum house","_id":"3289rwedsfjl", "pay":"24","address": "4487 big street, St. Louis, MO 63112","picture": "../static/assets/Home/Art/6.jpeg","description": "we are a very cool venue, looking for jazzy vibes and cool cats :)","applications": ["bandID1","bandID2","bandID3","bandID4","bandID5"],"bandFor": {}};
  return exampleGig;
}

class Carousel{
  constructor(obj,indicator){
    switch(indicator){
      case "hosted-applications":
      // obj will contain band IDs
      // get applicant data
      this.handleBands(obj, result=>{
        this.applicants = result;
        // create generic carousel elements
        // we can handle ID assignment later
        this.wrapper = document.createElement("div");
        this.wrapper.className = "app-wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.carList = document.createElement("ul");
        // fill the list
        for(var band in this.applicants){
          // container li
          var itemId = "applicantions-carousel-li-"+this.applicants[band]._id;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          newItem.id = itemId;
          // image
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.applicants[band].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/purplebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+band;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.applicants[band].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.applicants[band].name;
          // appends
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.carList.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.applicants[band]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.carList);
        if(this.applicants.length > 4){
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
        this.wrapper.append(this.carWrap);
      });
      break;
      case "past-hosted":
      this.handleGigs(obj, result=>{
        this.pastGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.wrapper.style.marginLeft = "0px";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.pastGigs){
          var id = this.pastGigs[gig]._id;
          var name = this.pastGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.pastGigs[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.pastGigs[gig].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.pastGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.pastGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.pastGigs.length > 4){
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
        this.wrapper.append(this.carWrap);
        profileGigs.append(this.wrapper);
      });
      break;
      // upcoming gigs
      case "upcoming":
      //get upcoming data
      this.handleGigs(obj, result=>{
        this.upcomingGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.upcomingGigs){
          var id = this.upcomingGigs[gig]._id;
          var name = this.upcomingGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.upcomingGigs[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/purplebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var confirmP = document.createElement("p");
          confirmP.className = "result-overlay-confirm-p";
          confirmP.innerHTML = "confirm payment of $"+this.upcomingGigs[gig].price+"/hr";
          var confirmInput = document.createElement("input");
          confirmInput.className = "gig-confirm-input";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.upcomingGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(confirmP);
          newOverlay.append(confirmInput);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.upcomingGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.upcomingGigs.length > 4){
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
        this.wrapper.append(this.carWrap);
      });
      break;
      // applications
      case "applications":
      // get applied gigs info
      this.handleGigs(obj, result=>{
        this.appliedGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.appliedGigs){
          var id = this.appliedGigs[gig]._id;
          var name = this.appliedGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.appliedGigs[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.appliedGigs[gig].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.appliedGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.appliedGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.appliedGigs.length > 4){
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
        this.wrapper.append(this.carWrap);
      });
      break;
      case "past":
      // get past gigs info
      this.handleGigs(obj, result=>{
        this.pastGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.pastGigs){
          var id = this.pastGigs[gig]._id;
          var name = this.pastGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.pastGigs[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.pastGigs[gig].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.pastGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.pastGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.pastGigs.length > 4){
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
        this.wrapper.append(this.carWrap);
      });
      break;
      case "interested-gigs":
      // get past gigs info
      this.handleGigs(obj, result=>{
        this.interstedGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.interstedGigs){
          var id = this.interstedGigs[gig]._id;
          var name = this.interstedGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.interstedGigs[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.interstedGigs[gig].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.interstedGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.interstedGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.interstedGigs.length > 4){
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
        this.wrapper.append(this.carWrap);
      });
      break;
      case "band-samples":
      // get sample info
      this.wrapper = document.createElement("div");
      this.wrapper.className = "wrapper";
      this.carWrap = document.createElement("div");
      this.carWrap.className = "jcarousel-wrapper";
      this.carousel = document.createElement("div");
      this.carousel.className = "jcarousel";
      this.list = document.createElement("ul");
      console.log("before looP");
      for(var sample in obj){
        console.log('within loop');
        var name = obj[sample].name;
        var newItem = document.createElement("li");
        newItem.className = "carousel-li";
        // img
        var newImg = document.createElement("img");
        newImg.className = "carousel-img";
        newImg.src = obj[sample].picture;
        // frame
        var newFrame = document.createElement("img");
        newFrame.className = "carousel-frame";
        newFrame.src = "../static/assets/Control-Center/purplebox.png";
        // overlay
        var newOverlay = document.createElement("div");
        newOverlay.className = "result-overlay";
        var overlayID = "result-overlay-"+sample;
        newOverlay.setAttribute("id",overlayID);
        var priceText = document.createElement("p");
        priceText.className = "result-overlay-p";
        priceText.innerHTML = "";
        // nameplate
        var nameDiv = document.createElement("div");
        nameDiv.className = "result-name-div";
        var nameP = document.createElement("p");
        nameP.className = "result-name-p";
        nameP.innerHTML = obj[sample].name;
        newItem.append(newImg);
        newOverlay.append(priceText);
        newItem.appendChild(newOverlay);
        newItem.append(newFrame);
        nameDiv.append(nameP);
        newItem.append(nameDiv);
        this.list.append(newItem);
        //event listener data preprocessing
        newItem.newOverlay = newOverlay;
        this.AddOverlayEventListeners(newItem);
      }
      // add the default 'add clip' item
      var newItem = document.createElement("li");
      newItem.className = "carousel-li";
      // icon
      var newIcon = document.createElement("h1");
      newIcon.className = "carousel-clip-plus";
      newIcon.innerHTML = "+";
      // frame
      var newFrame = document.createElement("img");
      newFrame.className = "carousel-frame";
      newFrame.src = "../static/assets/Control-Center/purplebox.png";
      newFrame.id = "add-sample-div";

      newItem.append(newIcon);
      newItem.append(newFrame);
      this.list.append(newItem);
      this.AddSampleEventListener(newItem);
      this.carousel.append(this.list);
      if(obj.length + 1 > 4){
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
      this.wrapper.append(this.carWrap);
      break;
    }
  }

  AddOverlayEventListeners(obj){
    obj.addEventListener("mouseover",function(){
      obj.newOverlay.style.zIndex = "8";
      obj.newOverlay.style.opacity = "1.0";
    },false);
    obj.addEventListener("mouseout",function(){
      obj.newOverlay.style.zIndex = "-8";
      obj.newOverlay.style.opacity = "0";
    },false);
    obj.addEventListener("click",function(){
      console.log(obj._id);
    },false);
  }

  AddSampleEventListener(obj){
    obj.addEventListener("click",function(){
      document.getElementById('modal-wrapper-new-sample').style.display='block';
    });
  }

  handleBands(idArr){
    var appProxy = {
      "apps": []
    };
    for(var bandID in idArr){
      var aBand = getBandInfo(idArr[bandID]);
      appProxy["apps"].push(aBand);
    }
    return appProxy;
  }

  handleGigs(idArr){
    var gigProxy = {
      "gigs":[]
    };
    for(var gigID in idArr){
      var aGig = getGigInfo(idArr[gigID]);
      gigProxy["gigs"].push(aGig);
    }
    return gigProxy;
  }
}

class BookedGig {

  constructor(gig){
    this.container = document.createElement("div");
    this.container.className = "booked-gig";
    this.titleEl = document.createElement("h3");
    this.titleEl.innerHTML = gig.name;
    this.locEl = document.createElement("h3");
    this.locEl.innerHTML = gig.address;
    this.gigContent = document.createElement("div");
    this.gigContent.className = "gig-content";
    this.gigImg = document.createElement("div");
    this.gigImg.className = "gig-image";
    this.gigPic = document.createElement("img");
    this.gigPic.className = "gig-pic";
    this.gigPic.src = gig.picture;
    this.gigPicFrame = document.createElement("img");
    this.gigPicFrame.className = "gig-pic-frame";
    this.gigPicFrame.src = "../static/assets/Home/orangebox.png";
    this.gigDesc = document.createElement("div");
    this.gigDesc.className = "gig-description";
    this.gigDescP = document.createElement("p");
    this.gigDescP.className = "gig-description-p";
    this.gigDescP.innerHTML = gig.description;
    this.gigAct = document.createElement("div");
    this.gigAct.className = "gig-act";
    this.actPic = document.createElement("img");
    this.actPic.className = "act-pic";
    this.actPic.src = gig.bandFor.picture;
    this.actPicFrame = document.createElement("img");
    this.actPicFrame.className = "act-pic-frame";
    this.actPicFrame.src = "../static/assets/Home/orangebox.png";
    this.actNameplate = document.createElement("div");
    this.actNameplate.className = "act-nameplate";
    this.actName = document.createElement("p");
    this.actName.className = "act-name";
    this.actName.innerHTML = gig.bandFor.name;
    this.gigConfirm = document.createElement("div");
    this.gigConfirm.className = "gig-confirm";
    this.gigConfirmP = document.createElement("p");
    this.gigConfirmP.className = "gig-confirm-p";
    this.gigConfirmP.innerHTML = "upon completion of this event, enter the confirmation code:";
    this.gigConfirmInput = document.createElement("input");
    this.gigConfirmInput.className = "gig-confirm-input";
    this.gigConfirmA = document.createElement("a");
    this.gigConfirmA.className = "gig-confirm-a";
    this.gigConfirmA.href = "#"; // can be changed to a javascript function for code submission
    this.gigConfirmA.innerHTML = "confirm";

// tier 4
    this.actNameplate.append(this.actName);
// tier 3
    this.gigImg.append(this.gigPic);
    this.gigImg.append(this.gigPicFrame);

    this.gigDesc.append(this.gigDescP);

    this.gigAct.append(this.actPic);
    this.gigAct.append(this.actPicFrame);
    this.gigAct.append(this.actNameplate);

    this.gigConfirm.append(this.gigConfirmP);
    this.gigConfirm.append(this.gigConfirmInput);
    this.gigConfirm.append(this.gigConfirmA);
// tier 2
    this.gigContent.append(this.gigImg);
    this.gigContent.append(this.gigDesc);
    this.gigContent.append(this.gigAct);
    this.gigContent.append(this.gigConfirm);
// tier 1
    this.container.append(this.titleEl);
    this.container.append(this.locEl);
    this.container.append(this.gigContent);
// tier 0
    bookedGigs.append(this.container);
  }
}

function testBookedGigs(){
  var aGig = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var testingBooked = new BookedGig(aGig);
}

class OpenGig{
  constructor(gig){
    this.container = document.createElement("div");
    this.container.className = "open-gig";
    this.info = document.createElement("div");
    this.info.className = "open-gig-info";
    this.gigImg = document.createElement("div");
    this.gigImg.className = "open-gig-image";
    this.title = document.createElement("h3");
    this.title.innerHTML = gig.name;
    this.gigPic = document.createElement("img");
    this.gigPic.className = "gig-pic";
    this.gigPic.src = gig.picture;
    this.gigPicFrame = document.createElement("img");
    this.gigPicFrame.className = "gig-pic-frame";
    this.gigPicFrame.src = "../static/assets/Home/orangebox.png";
    this.gigDesc = document.createElement("div");
    this.gigDesc.className = "open-gig-description";
    this.gigDescH = document.createElement("h3");
    this.gigDescH.innerHTML = "Description";
    this.gigDescT = document.createElement("textarea");
    this.gigDescT.className = "open-gig-textarea";
    this.gigDescT.innerHTML = gig.description;
    this.gigDT = document.createElement("div");
    this.gigDT.className = "open-gig-date-time";
    this.gigDTH = document.createElement("h3");
    this.gigDTH.innerHTML = "Date";
    this.gigDate = document.createElement("input");
    this.gigDate.className = "open-gig-date";
    this.gigDate.type = "date";
    // this.gigDate.value = gig.date;
    this.gigTimeL = document.createElement("h3");
    this.gigTimeL.id = "open-gig-time-label";
    this.gigTimeL.innerHTML = "Time";
    this.gigSTL = document.createElement("label");
    this.gigSTL.for = "open-gig-start-time";
    this.gigSTL.innerHTML = "from"
    this.gigST = document.createElement("input");
    this.gigST.className = "open-gig-start-time";
    this.gigST.type = "time";
    // this.gigST.value = gig.startTime;
    this.gigETL = document.createElement("label");
    this.gigETL.for = "open-gig-end-time";
    this.gigETL.innerHTML = "to";
    this.gigET = document.createElement("input");
    this.gigET.className = "open-gig-end-time";
    this.gigET.type = "time";
    // this.gigET.value = gig.endTime;
    this.gigLP = document.createElement("div");
    this.gigLP.className = "open-gig-loc-pay";
    this.gigLPH = document.createElement("h3");
    this.gigLPH.innerHTML = "Location";
    this.gigLoc = document.createElement("input");
    this.gigLoc.className = "open-gig-loc";
    this.gigLoc.value = gig.address;
    this.gigPL = document.createElement("h3");
    this.gigPL.id = "open-gig-pay-label";
    this.gigPL.innerHTML = "Max Pay ($/hr)";
    this.gigPay = document.createElement("input");
    this.gigPay.className = "max-pay-input";
    // this.gigPay.value = gig.payment;
    this.gigConfirm = document.createElement("a");
    this.gigConfirm.href = "#";
    this.gigConfirm.className = "open-gig-confirm";
    this.gigConfirm.innerHTML = "confirm changes";
    this.gigAppH = document.createElement("h3");
    this.gigAppH.innerHTML = "applicants";
    this.applicantCarousel = new Carousel(gig.applications,"hosted-applications");
    this.carEl = this.applicantCarousel.wrapper;

    // tier 3
    this.gigImg.append(this.title);
    this.gigImg.append(this.gigPic);
    this.gigImg.append(this.gigPicFrame);

    this.gigDesc.append(this.gigDescH);
    this.gigDesc.append(this.gigDescT);

    this.gigDT.append(this.gigDTH);
    this.gigDT.append(this.gigDate);
    this.gigDT.append(this.gigTimeL);
    this.gigDT.append(this.gigSTL);
    this.gigDT.append(this.gigST);
    this.gigDT.append(this.gigETL);
    this.gigDT.append(this.gigET);

    this.gigLP.append(this.gigLPH);
    this.gigLP.append(this.gigLoc);
    this.gigLP.append(this.gigPL);
    this.gigLP.append(this.gigPay);
    this.gigLP.append(this.gigConfirm);
    // tier 2
    this.info.append(this.gigImg);
    this.info.append(this.gigDesc);
    this.info.append(this.gigDT);
    this.info.append(this.gigLP);
    // tier 1
    this.container.append(this.info);
    this.container.append(this.gigAppH);
    this.container.append(this.carEl);
    // tier 0
    openGigs.append(this.container);
    setupAction();
  }
}


function yellow(){
  var application =
  "{"+
    "'name':'Deadulus',"+
    "'_id': '75757399adlafj3',"+
    "'creator':'xxx',"+
    "'address':'N27 W5230',"+
    "'zipcode': 53012,"+
    "'price': 33,"+
    "'rating':null,"+
    "'openDates':'[2019-01-26T14:22]'," +
    "'application':'We are a good band',"+
    "'lat': 100.1,"+
    "'lng': 109.2,"+
    "'audioSamples':[],"+
    "'videoSamples':[],"+
    "'picture':'no jpeg yet',"+
    "'appliedGigs':["+
      "'gigneat23',"+
      "'gigawesome12'"
    "],"+
    "'categories':{"+
      "'genres':[],"+
      "'vibes':[],"+
      "'insts':[],"+
      "'gigTypes':[]"+
    "}"+
  "}";
}

function testOpenGigs(){
  var aGig = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    applications: ["bandID1","bandID2","bandID3","bandID4","bandID5"],
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var testingOpen = new OpenGig(aGig);
}

function testPastHostedGigs(){
  var aGig = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var aGig2 = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var aGig3 = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var aGig4 = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var aGig5 = {
    name: "the rum house",
    address: "4487 big street, St. Louis, MO 63112",
    picture: "../static/assets/Home/Art/6.jpeg",
    description: "we are a very cool venue, looking for jazzy vibes and cool cats :)",
    bandFor: {
      name: "king gizzard and the lizard wizard",
      picture: "../static/assets/Home/Art/9.jpeg"
    }
  };
  var title = document.createElement("h2");
  var testGigs = [aGig,aGig2,aGig3,aGig4,aGig5];
  var proxy = {};
  proxy.gigs = testGigs;
  var testingPastHosted = new Carousel(proxy,"past-hosted");
  setupAction();
}

class BandSection{
  constructor(band, identifier, bandSectionCallback){
    switch(identifier){
      case "info":
      this.title = document.createElement("p");
      this.title.className = "title-text";
      this.title.innerHTML = "Band Info";
      this.container = document.createElement("div");
      this.container.append(this.title);
      this.stars = document.createElement("div");
      this.stars.className = "band-stars";
      this.star1 = document.createElement("img");
      this.star1.className = "star";
      this.star1.id = band.name+"-star-1";
      this.star2 = document.createElement("img");
      this.star2.className = "star";
      this.star2.id = band.name+"-star-2";
      this.star3 = document.createElement("img");
      this.star3.className = "star";
      this.star3.id = band.name+"-star-3";
      this.star4 = document.createElement("img");
      this.star4.className = "star";
      this.star4.id = band.name+"-star-4";
      this.star5 = document.createElement("img");
      this.star5.className = "star";
      this.star5.id = band.name+"-star-5";
      this.stars.append(this.star1);
      this.stars.append(this.star2);
      this.stars.append(this.star3);
      this.stars.append(this.star4);
      this.stars.append(this.star5);
      this.container.append(this.stars);
      this.editButton = document.createElement("input");
      this.editButton.type = 'button';
      this.editButton.value = "edit band";
      this.editButton.className = "edit-band-button";
      this.editButton.addEventListener('click',function(){
        var modalWrapCurrent = document.getElementById('modal-wrapper-current-band');
        document.getElementById("current-band-title").value = band.name;
        document.getElementById("current-band-zip").value = band.zipcode;
        // document.getElementById("current-band-dist").value = band.maxDist;
        document.getElementById("current-gig-pay").value = band.price;
        document.getElementById("current-band-description").value = band.description;
        document.getElementById("current-band-pic-preview").src = band.picture;
        modalWrapCurrent.style.display='block';
      });
      this.container.append(this.editButton);
      bandSectionCallback(this);
      break;
      case "upcoming":
      if(band.upcomingGigs.length > 0){
        this.title = document.createElement("p");
        this.title.className = "title-text";
        this.tite.innerHTML = "Upcoming Gigs";
        mainContent.append(this.title);
        this.carousel = new Carousel(band.upcomingGigs,"upcoming");
        mainContent.append(this.carousel);
      }
      break;
      case "applications":
      if(band.appliedGigs.length > 0){
        this.title = document.createElement("p");
        this.title.className = "title-text";
        this.tite.innerHTML = "Applied Gigs";
        mainContent.append(this.title);
        this.carousel = new Carousel(band.appliedGigs,"applications");
        mainContent.append(this.carousel);
      }
      break;
      case "past":
      if(band.pastGigs.length > 0){
        this.title = document.createElement("p");
        this.title.className = "title-text";
        this.tite.innerHTML = "Past Gigs";
        mainContent.append(this.title);
        this.carousel = new Carousel(band.pastGigs,"past");
        mainContent.append(this.carousel);
      }
      break;
      case "interested-gigs":
      if(band.interstedGigs.length > 0){
        this.title = document.createElement("p");
        this.title.className = "title-text";
        this.tite.innerHTML = "Interested Gigs";
        mainContent.append(this.title);
        this.carousel = new Carousel(band.interstedGigs,"interested-gigs");
        mainContent.append(this.carousel);
      }
      break;
    }
  }
}

function buildBand(bands){
  // after we have actual bands, not IDs
  for(band in bands){
    var bandTitle = document.createElement("p");
    bandTitle.className = "title-text";
    bandTitle.innerHTML = bands[band].name;
    bandTitle.id = bands[band].name+"-section";
    var newNav = document.createElement("li");
    var newNavA = document.createElement("a");
    newNavA.href = "#"+bands[band].name+"-section";
    profilesList.
    mainContent.append(bandTitle);
    // var infoSection = new BandSection(bands[band],"info");
    // var upcomingSection = new BandSection(bands[band],"upcoming");
    // var applicationsSection = new BandSection(bands[band],"applications");
    // var pastSection = new BandSection(bands[band],"past");
    // var interestedSection = new BandSection(bands[band],"interested-gigs");
  }
}



function updateBand(id, query){
  $.post('/updateBand', {'_id':id, 'query':query}, result =>{
    alert(JSON.stringify(result));
  });

}
function updateGig(id, query){
  $.post('/updateGig', {'_id':id, 'query':query}, result =>{
    alert(JSON.stringify(result));
  });
}
function getUsername(){
  console.log("called fucntion getUsername");
  $.get('/user', {query:'nada'}, res=>{
    alert(JSON.stringify(res));
    var user = res;
    id = user['_id'];
    console.log('username fro res is: ' + user['username']);
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
  loadBands(user);
  //loadGigs(user);
}

// AB EDIT
function loadStars(rating, stars){
  var star1 = document.getElementById(stars[0]);
  var star2 = document.getElementById(stars[1]);
  var star3 = document.getElementById(stars[2]);
  var star4 = document.getElementById(stars[3]);
  var star5 = document.getElementById(stars[4]);
  star1.src = "../static/assets/Control-Center/star.png";
  star2.src = "../static/assets/Control-Center/star.png";
  star3.src = "../static/assets/Control-Center/star.png";
  star4.src = "../static/assets/Control-Center/star.png";
  star5.src = "../static/assets/Control-Center/star.png";

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

var profileGigs = null;
var bookedGigs = null;
var openGigs = null;
var pastHostedGigs = null;

var mainContent = null;
var profilesList = null;



function init(){
  profileGigs = document.getElementById("profile-gigs");
  mainContent = document.getElementById("main-content-wrapper");
  profilesList = document.getElementById("profiles-list");

  var star1 = "user-star-1";
  var star2 = "user-star-2";
  var star3 = "user-star-3";
  var star4 = "user-star-4";
  var star5 = "user-star-5";
  var stars = [star1,star2,star3,star4,star5];

  loadStars(50, stars);
  var aBand = {"_id":"5c90d769c697a21f8e0d2145","name":"jimi Hendrix","creator":"xxx","address":null,"zipcode":"53012","price":"22","rating":40,"openDates":[["Sunday","14:22","03:33"]],"applicationText":null,"lat":"43.3","lng":"-87.99","categories":{"genres":["jazz","rock"],"gigTypes":["bar"],"vibes":["lay"]},"description":"jazz rock bar play bars","appliedGigs":[],"upcomingGigs":["5c90d7a7c697a21f8e0d2146"],"finishedGigs":[],"interestedGigs":[],"audioSamples":[{"audio":"/uploads/SoundBytes/4cae01f7e8744f96a287d73562e41904","picture":"/uploads/AudioPics/1c06066a8932b23f887057b5a04085b3"}],"videoSample":[],"picture":"/uploads/BandPics/b4a67a22e1fe3af4f99c8304ebed87a4"};
  var bandTitle = document.createElement("p");
  bandTitle.className = "title-text";
  bandTitle.innerHTML = aBand.name;
  bandTitle.id = aBand.name+"-section";
  mainContent.append(bandTitle);
  new BandSection(aBand,"info",bandSectionCallback=>{
    mainContent.append(bandSectionCallback.container);
    var starArr = [bandSectionCallback.star1.id,bandSectionCallback.star2.id,bandSectionCallback.star3.id,bandSectionCallback.star4.id,bandSectionCallback.star5.id];
    loadStars(aBand.rating,starArr);
  });

  //// IF a profile has booked gigs,
  // bookedGigs = document.createElement("div");
  // bookedGigs.className = "booked-gigs";
  // var bookedGigsH = document.createElement("h2");
  // bookedGigsH.innerHTML = "Booked Events";
  // bookedGigs.append(bookedGigsH);
  // profileGigs.append(bookedGigs);
  //// then, fill the booked gigs section
  // testBookedGigs();

  // IF a profile has open gigs,
  // openGigs = document.createElement("div");
  // openGigs.className = "open-gigs";
  // var openGigsH = document.createElement("h2");
  // openGigsH.innerHTML = "Open Events";
  // openGigs.append(openGigsH);
  // profileGigs.append(openGigs);
  // then, fill the open gigs section
  // testOpenGigs();

  // IF a profile has past hosted gigs,
  // pastHostedGigs = document.createElement("div");
  // pastHostedGigs.className = "open-gigs";
  // var pastHostedGigsH = document.createElement("h2");
  // pastHostedGigsH.innerHTML = "Past Events";
  // pastHostedGigs.append(pastHostedGigsH);
  // profileGigs.append(pastHostedGigs);
  // then, fill the past gigs section
  // testPastHostedGigs();

  // var empty = [];
  // var clipCar = new Carousel(empty, "band-samples");
  // mainContent.append(clipCar.wrapper);


  // getUsername();
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
            }, // called when the close icon is clicked
            boxManager: {
                // thanks to the widget factory facility
                // similar to http://alexsexton.com/?p=51
                init: function(elem) {
                    this.elem = elem;
                    console.log("got in init");
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
            // uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
            //     .addClass('ui-corner-all ' +
            //               'ui-chatbox-icon'
            //              )
            //     .attr('role', 'button')
            //     .hover(function() { uiChatboxTitlebarMinimize.addClass('ui-state-hover'); },
            //            function() { uiChatboxTitlebarMinimize.removeClass('ui-state-hover'); })
            //     .click(function(event) {
            //         self.toggleContent(event);
            //         return false;
            //     })
            //     .appendTo(uiChatboxTitlebar),
            // uiChatboxTitlebarMinimizeText = $('<span></span>')
            //     .addClass('ui-icon ' +
            //               'ui-icon-minusthick')
            //     .text('minimize')
            //     .appendTo(uiChatboxTitlebarMinimize),
            // content
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

$(document).ready(function(){
          var box = null;
          console.log("document ready");
          $("#chat-a").click(function(event, ui) {
              if(box) {
                  box.chatbox("option", "boxManager").toggleBox();
              }
              else {
                  box = $("#chat-div").chatbox({id:"chat_div",
                                                user:{key : "value"},
                                                title : "test chat",
                                                messageSent : function(id, user, msg) {
                                                    // $("#log").append(id + " said: " + msg + "<br/>");
                                                    $("#chat-div").chatbox("option", "boxManager").addMsg(id, msg);
                                                }});
              }
          });
});



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

//MESSAGING SECTION:

var socket = io();
function recMessage(message){
  console.log('recieved message here it is: ' + JSON.stringify(message));
}
function sendMessage(){
  //set body to text from box and rec id to the inteded reciver's user ID
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  //replace this with real id from contact menu
  var recID = 3232323323;
  //////
  var body = "hello world"

  var myMessage = {
    'senderID':id,
    'recieverID': recID,
    'body': body,
    'timeStamp' : dateTime
  };
  $.post('/messages', {'senderID':id, 'recieverID':recID, 'body':body, 'timeStamp':dateTime}, result=>{
    console.log("got result from positn message it is :" + JSON.stringify(result));
  });
}

socket.on('message, recID:' + id + '', recMessage);

function addRow(flag) {
  switch(flag){
    case "new":
    var tableID = "new-band-schedule";
    var table = document.getElementById(tableID);
    if (!table) return;
    var newRow = table.rows[1].cloneNode(true);
    // Now get the inputs and modify their names
    var inputs = newRow.getElementsByTagName('input');
    for (var i=0, iLen=inputs.length; i<iLen; i++) {
      // Update inputs[i]
    }
    // Add the new row to the tBody (required for IE)
    var tBody = table.tBodies[0];
    tBody.insertBefore(newRow, tBody.lastChild);
    break;
    case "current":
    var tableID = "current-band-schedule";
    var table = document.getElementById(tableID);
    if (!table) return;
    var newRow = table.rows[1].cloneNode(true);
    // Now get the inputs and modify their names
    var inputs = newRow.getElementsByTagName('input');
    for (var i=0, iLen=inputs.length; i<iLen; i++) {
      // Update inputs[i]
    }
    // Add the new row to the tBody (required for IE)
    var tBody = table.tBodies[0];
    tBody.insertBefore(newRow, tBody.lastChild);
  }
}

function deleteRow(el) {

  // while there are parents, keep going until reach TR
  while (el.parentNode && el.tagName.toLowerCase() != 'tr') {
    el = el.parentNode;
  }

  // If el has a parentNode it must be a TR, so delete it
  // Don't delte if only 3 rows left in table
  if (el.parentNode && el.parentNode.rows.length > 1) {
    el.parentNode.removeChild(el);
  }
}
