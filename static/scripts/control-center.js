this.handle// helpful snippet for later
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

var profileGigs = null;
var bookedGigs = null;
var openGigs = null;
var pastHostedGigs = null;

var mainContent = null;
var profilesList = null;

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

class BookedGig {

  constructor(gig, bookedGigCallback){

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
    this.gigPicFrame.src = "/assets/Home/orangebox.png";
    this.gigDesc = document.createElement("div");
    this.gigDesc.className = "gig-description";
    this.gigDescP = document.createElement("p");
    this.gigDescP.className = "gig-description-p";
    this.gigDescP.innerHTML = gig.description;
    this.gigAct = document.createElement("div");
    this.gigAct.className = "gig-act";
    this.actPic = document.createElement("img");
    this.actPic.className = "act-pic";
    this.actPicFrame = document.createElement("img");
    this.actPicFrame.className = "act-pic-frame";
    this.actPicFrame.src = "/assets/Home/orangebox.png";
    this.actNameplate = document.createElement("div");
    this.actNameplate.className = "act-nameplate";
    this.actName = document.createElement("p");
    this.actName.className = "act-name";
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
    //async
    getBandInfo(gig.bandFor, res=>{
      this.band = res;
      console.log(JSON.stringify(res));
      this.actPic.src = this.band.picture;
      this.actName.innerHTML = this.band.name;

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
          // bookedGigs.append(this.container);
          bookedGigCallback(this);
    });


  }
}

//ABs functions:
function getGigInfo(gigID, cb){
  console.log('getGigINFo gig id is : ' + gigID);
  $.get('/aGig', {'gigID':gigID}, result=>{
    console.log('Got result from get a gig here it is : ' + JSON.stringify(result));
    cb(result);
  });
}
function getBandInfo(bandID, cb){
  console.log('////////////////////');
  console.log(bandID);
  $.get('/aBand', {'id':bandID}, result=>{
    console.log('Got result from get a band here it is : ' + JSON.stringify(result));
    cb(result);
  });
}

//ABS classes:

class GigSection{
  constructor(gigs,identifier){
    switch(identifier){
      case "booked":
      var bookedGigs = document.createElement("div");
      bookedGigs.className = "booked-gigs";
      var bookedGigsH = document.createElement("h2");
      bookedGigsH.innerHTML = "Booked Events";
      bookedGigs.append(bookedGigsH);
      profileGigs.append(bookedGigs);
      for(var gig in gigs){
        if(gigs[gig].isFilled){
          new BookedGig(gigs[gig], res=>{
            bookedGigs.append(res.container);
          });
        }
      }
      break;
      case "open":
      break;
      case "past-hosted":
      break;
    }
  }
}

class BandSection{
  constructor(band, identifier, bandSectionCallback){
     // console.log('band inc Band Section is + :' + JSON.stringify(band));
    switch(identifier){
      case "upcoming":
      if(band.upcomingGigs.length > 0){
        new Carousel(band.upcomingGigs, "upcoming", carCallback =>{
          this.title = document.createElement("p");
          this.title.className = "title-text";
          this.title.innerHTML = "Upcoming Gigs";
          this.container = document.createElement("div");
          this.container.append(this.title);
          this.carousel = carCallback;
          this.container.append(this.carousel.wrapper);
          bandSectionCallback(this);
        });
      }
      break;
      case "applications":
      if(band.appliedGigs.length > 0){
        new Carousel(band.appliedGigs,"applications", carCallback =>{
          this.title = document.createElement("p");
          this.title.className = "title-text";
          this.title.innerHTML = "Applied Gigs";
          this.container = document.createElement("div");
          this.container.append(this.title);
          this.carousel = carCallback;
          this.container.append(this.carousel.wrapper);
          bandSectionCallback(this);
        });
      }
      break;
      case "past":
      if(band.finishedGigs.length > 0){
        new Carousel(band.finishedGigs,"past", carCallback =>{
          this.title = document.createElement("p");
          this.title.className = "title-text";
          this.title.innerHTML = "Past Gigs";
          this.container = document.createElement("div");
          this.container.append(this.title);
          this.carousel = carCallback;
          this.container.append(this.carousel.wrapper);
          bandSectionCallback(this);
        });
      }
      break;
      case "interested-gigs":
      if(band.interestedGigs.length > 0){
        new Carousel(band.interestedGigs,"interested-gigs", carCallback =>{
          this.title = document.createElement("p");
          this.title.className = "title-text";
          this.title.innerHTML = "Interested Gigs";
          this.container = document.createElement("div");
          this.container.append(this.title);
          this.carousel = carCallback;
          this.container.append(this.carousel.wrapper);
          bandSectionCallback(this);
        });
      }
      break;
    }
  }
}

class Carousel{
  constructor(obj,indicator,carCallback){
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
        carCallback(this);
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
        carCallback(this);
      });
      break;
      // upcoming gigs
      case "upcoming":
      //get upcoming data
      this.handleGigs(obj, result=>{
        // console.log(JSON.stringify(result));
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
          if(this.upcomingGigs[gig].hasOwnProperty("picture")){
            newImg.src = this.upcomingGigs[gig].picture;
          }
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
        carCallback(this);
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
          if(this.appliedGigs[gig].hasOwnProperty("picture")){
            newImg.src = this.appliedGigs[gig].picture;
          }
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
        carCallback(this);
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
        this.pastGigs.forEach(function(gig){
          var id = gig._id;
          var name = gig.name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          if(gig.hasOwnProperty("picture")){
            newImg.src = gig.picture;
          }
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig.name;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+gig.price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = gig.name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = gig._id;
          this.AddOverlayEventListeners(newItem);
        },this);
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
        carCallback(this);
      });
      break;
      case "interested-gigs":
      // get past gigs info
      this.handleGigs(obj, result=>{
        this.interestedGigs = result;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.interestedGigs){
          var id = this.interestedGigs[gig]._id;
          var name = this.interestedGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          if(this.interestedGigs[gig].hasOwnProperty("picture")){
            newImg.src = this.interestedGigs[gig].picture;
          }
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
          priceText.innerHTML = "$"+this.interestedGigs[gig].price+"/hr";
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.interestedGigs[gig].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.interestedGigs[gig]._id;
          this.AddOverlayEventListeners(newItem);
        }
        this.carousel.append(this.list);
        if(this.interestedGigs.length > 4){
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
        carCallback(this);
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
      carCallback(this);
      break;
    }
  }

  handleBands(idArr){
    this.handleBandsHelper(idArr, res=>{
      if (res.length==idArr.length){
        cb(res);
      }
    });

  }


  handleGigs(idArr, cb, ){
  //  var gigProxy=[];
    this.handleGigsHelper(idArr, res=>{
      if (res.length==idArr.length){
        cb(res);
      }
    });

  }

  handleGigsHelper(idArr, cb){
    var gigProxy = [];
    idArr.forEach(function(id, i){
      console.log('ID in handle gigs is : ');
      console.log(idArr[i])
      getGigInfo(id, res=>{
        console.log('in get gig info and res is:' + JSON.stringify(res));
        gigProxy.push(res);
        if (gigProxy.lenth==idArr.lenth){
          cb(gigProxy);
        }
      });
    });
  }

  handleBandsHelper(idArr, cb){
    var bands = [];
    idArr.forEach(function(id, i){
      console.log('ID in handle gigs is : ');
      console.log(idArr[i])
      getBandInfo(id, res=>{
        console.log('in get gig info and res is:' + JSON.stringify(res));
        bands.push(res);
        if (bands.lenth==idArr.lenth){
          cb(bands);
        }
      });
    });
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
}

var callbackStepper = 0;


function updateBand(id, query){
  $.post('/updateBand', {'id':id, 'query':query}, result =>{
    alert(JSON.stringify(result));
  });
}

function updateGig(id, query){
  $.post('/updateGig', {'id':id, 'query':query}, result =>{
    alert(JSON.stringify(result));
  });
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
function buildBands(bands){
  // after we have actual bands, not IDs

  // handleGigsHelper(idArr, cb){
  //   var gigProxy = [];
  //   idArr.forEach(function(id, i){
  //     console.log('ID in handle gigs is : ');
  //     console.log(idArr[i])
  //     getGigInfo(id, res=>{
  //       console.log('in get gig info and res is:' + JSON.stringify(res));
  //       gigProxy.push(res);
  //       if (gigProxy.lenth==idArr.lenth){
  //         cb(gigProxy);
  //       }
  //     });
  //   });
  // }

  bands.forEach(function(band){
    var bandTitle = document.createElement("p");
    bandTitle.className = "title-text";
    bandTitle.innerHTML = band.name;
    bandTitle.id = band.name+"-section";
    var newNav = document.createElement("li");
    var newNavA = document.createElement("a");
    newNavA.href = "#"+band.name+"-section";
    var bandContainer = document.createElement("div");
    bandContainer.append(bandTitle);
    //  profilesList.
    mainContent.append(bandContainer);
    new BandSection(band,"upcoming", bandSectionCallback=>{
      bandContainer.append(bandSectionCallback.container);
      setupAction();
    });
    new BandSection(band,"applications", bandSectionCallback=>{
      bandContainer.append(bandSectionCallback.container);
      setupAction();
    });
    new BandSection(band,"past", bandSectionCallback=>{
      bandContainer.append(bandSectionCallback.container);
      setupAction();
    });
    new BandSection(band,"interested-gigs", bandSectionCallback=>{
      bandContainer.append(bandSectionCallback.container);
      setupAction();
    });

  });
}

function buildGigs(gigs){
  if(gigs.hasOwnProperty("isConfirmed")){
    //handle
  }else{
    new GigSection(gigs,"booked");
    // new GigSection(gigs,"open", gigSectionCallback=>{
    //   profileGigs.append(gigSectionCallback.container);
    //   setupAction();
    // });
  }
}

function createWebPage(user){
  console.log(JSON.stringify(user));
  var allBands = user['bands'];
  var allGigs = user['gigs'];
  profileGigs = document.getElementById("profile-gigs");
  mainContent = document.getElementById("main-content-wrapper");
  profilesList = document.getElementById("profiles-list");
  buildBands(allBands);
  buildGigs(allGigs);


  //// IF a profile has booked gigs,
  /*
  for (var i in allBands){
    var theBand = allBands[i];
    for (var upGig in theBand.upcomigGigs){
      new BookedGig(theBand.upcomigGigs[upGig]);
    }
    for (var appGig in )
  }
  bookedGigs = document.createElement("div");
  bookedGigs.className = "booked-gigs";
  var bookedGigsH = document.createElement("h2");
  bookedGigsH.innerHTML = "Booked Events";
  bookedGigs.append(bookedGigsH);
  profileGigs.append(bookedGigs);
  //// then, fill the booked gigs section
  testBookedGigs();

  // IF a profile has open gigs,
  openGigs = document.createElement("div");
  openGigs.className = "open-gigs";
  var openGigsH = document.createElement("h2");
  openGigsH.innerHTML = "Open Events";
  openGigs.append(openGigsH);
  profileGigs.append(openGigs);
  // then, fill the open gigs section
  testOpenGigs();

  // IF a profile has past hosted gigs,
  pastHostedGigs = document.createElement("div");
  pastHostedGigs.className = "open-gigs";
  var pastHostedGigsH = document.createElement("h2");
  pastHostedGigsH.innerHTML = "Past Events";
  pastHostedGigs.append(pastHostedGigsH);
  profileGigs.append(pastHostedGigs);
  // then, fill the open gigs section
  testPastHostedGigs();
*/
}



function init(){
  //loadBands(user);
  getUsername();
}

function loadBands(user){
  console.log("got in load bands");
  console.log("user is: " + JSON.stringify(user));
  for (var i in user['bands']){
    var band = user.bands[i];
    console.log('band is: ' + JSON.stringify(band));
    console.log(band.name);
    buildBandSection(band);
  }
}

// Managing Band data

function makeTitle(string){
  return "<p class='title-text'>"+string+"</p>";
}

function makeDivWithClassAndId(newClass, id){
    return "<div class='"+newClass+"' id='"+id+"'></div>";
}

function makeListWithId(id){
  return "<ul id='"+id+"'></ul>";
}

function makeListItemWithId(id){
  return "<li class='carousel-li' id='carousel-li-"+id+"'></li>";
}

function makeCarouselWithId(id, band, section){
  // Create wrapper divs & the <ul>
  switch(section){
    //
    // upcoming section
    //
    case "upcoming":
    var wrapperString = makeDivWithClassAndId("wrapper","wrapper-"+id);
    var $wrapper = $(wrapperString);
    var carouselWrapperString = makeDivWithClassAndId("jcarousel-wrapper","jcarousel-wrapper-"+id);
    var $carouselWrapper = $(carouselWrapperString);
    var carouselString = makeDivWithClassAndId("jcarousel","jcarousel-"+id);
    var $carousel = $(carouselString);
    var listString = makeListWithId("list-"+id);
    var $list = $(listString);

    for(var gig in band.upcomigGigs){
      console.log("gig: "+gig);
      var gigId = gig.name;
      var newItemString = makeListItemWithId(gigId);
      console.log("li string: "+newItemString);
      //<li class='carousel-li' id='carousel-li-undefined'></li>
      var testNewItem = "<li class='carousel-li' id='carousel-li-"+gig.name+"'></li>";
      var $newItem = $("<li></li>");
      // placeholder images, can be generalized via separate functions.
      var $newImg = $("<img class='carousel-img' src='../static/assets/Home/Art/3.jpeg' alt='Image 3' />");
      var $newFrame = $("<img class='carousel-frame' src='../static/assets/Control-Center/purplebox.png' alt='frame' />");
      $newItem.append($newImg);
      $newItem.append($newFrame);
      $list.append(($newItem));
    }
    $wrapper.append($carouselWrapper);
    $carouselWrapper.append($carousel);
    $carousel.append($list);
    var $prev = $("<a href='#' class='jcarousel-control-prev'></a>")
    var $next = $("<a href='#' class='jcarousel-control-next'></a>")
    $carousel.after($prev, $next);
    //$("#contacts-sidebar").after($wrapper);
    $("#main-content-wrapper").append($wrapper);
    break;
    //
    // applications section
    //
    case "applications":
    var wrapperString = makeDivWithClassAndId("wrapper","wrapper-"+id);
    var $wrapper = $(wrapperString);
    var carouselWrapperString = makeDivWithClassAndId("jcarousel-wrapper","jcarousel-wrapper-"+id);
    var $carouselWrapper = $(carouselWrapperString);
    var carouselString = makeDivWithClassAndId("jcarousel","jcarousel-"+id);
    var $carousel = $(carouselString);
    var listString = makeListWithId("list-"+id);
    var $list = $(listString);
    for(var application in band.appliedGigs){
      var appId = gig.id;
      var newItemString = makeListItemWithId(appId);
      var $newItem = $(newItemString);
      // placeholder images, can be generalized via separate functions.
      var $newImg = $("<img class='carousel-img' src='../static/assets/Home/Art/3.jpeg' alt='Image 3'>");
      var $newFrame = $("<img class='carousel-frame' src='../static/assets/Control-Center/purplebox.png' alt='frame'>");
      $newItem.append($newImg);
      $newItem.append($newFrame);
      $list.append($newItem);
    }
    $wrapper.append($carouselWrapper);
    $carouselWrapper.append($carousel);
    $carousel.append($list);
    var $prev = $("<a href='#' class='jcarousel-control-prev'></a>")
    var $next = $("<a href='#' class='jcarousel-control-next'></a>")
    $carousel.after($prev, $next);
    //$("#contacts-sidebar").after($wrapper);
    $("#main-content-wrapper").append($wrapper);
    break;
    //
    // past section
    //
    case "past":
    var wrapperString = makeDivWithClassAndId("wrapper","wrapper-"+id);
    var $wrapper = $(wrapperString);
    var carouselWrapperString = makeDivWithClassAndId("jcarousel-wrapper","jcarousel-wrapper-"+id);
    var $carouselWrapper = $(carouselWrapperString);
    var carouselString = makeDivWithClassAndId("jcarousel","jcarousel-"+id);
    var $carousel = $(carouselString);
    var listString = makeListWithId("list-"+id);
    var $list = $(listString);
    for(var show in band.finishedGigs){
      var showId = show.name;
      var newItemString = makeListItemWithId(showId);
      var $newItem = $(newItemString);
      // placeholder images, can be generalized via separate functions.
      var $newImg = $("<img class='carousel-img' src='../static/assets/Home/Art/3.jpeg' alt='Image 3'>");
      var $newFrame = $("<img class='carousel-frame' src='../static/assets/Control-Center/purplebox.png' alt='frame'>");
      $newItem.append($newImg);
      $newItem.append($newFrame);
      $list.append($newItem);
    }
    $wrapper.append($carouselWrapper);
    $carouselWrapper.append($carousel);
    $carousel.append($list);
    var $prev = $("<a href='#' class='jcarousel-control-prev'></a>")
    var $next = $("<a href='#' class='jcarousel-control-next'></a>")
    $carousel.after($prev, $next);
    //$("#contacts-sidebar").after($wrapper);
    $("#main-content-wrapper").append($wrapper);
    break;
  }
  setupAction();
}

function buildBandSection(band){
  console.log(band.name);
  var elementId = "band-"+band.name;
  var titleString = makeTitle(band.name);
  var $bandTitle = $(titleString);
  $("#main-content-wrapper").append($bandTitle);
  if (band.upcomingGigs.length > 0){
    var upcomingTitleTag = makeTitle("Upcoming");
    var $upcomingTitle = $(upcomingTitleTag);
    $("#main-content-wrapper").append($upcomingTitle);
    var upcomingId = elementId+"-upcoming";
    makeCarouselWithId(upcomingId, band, "upcoming");
  }
  if (band.appliedGigs.length > 0){
    var applicationsTitleTag = makeTitle("Applications");
    var $applicationsTitle = $(applicationsTitleTag);
    $("#main-content-wrapper").append($applicationsTitle);
    var applicationsId = elementId+"-applications";
    makeCarouselWithId(applicationsId, band, "applications");

  }
  if (band.finishedGigs.length > 0){
    var pastTitleTag = makeTitle("Previous Shows");
    var $pastTitle = $(pastTitleTag);
    $("#main-content-wrapper").append($pastTitle);
    var pastId = elementId+"-past";
    makeCarouselWithId(pastId, band, "past");
  }
  $("#main-content-wrapper").append($("<br><br><br>"));
}

// Managing Event Hosting Data

function buildEventHostingSection(event){

}

function buildApplicants(applicants){

}

function buildPastHostedGigs(pastGigs){

}

function buildCarouselUpcoming(data){
  // Create wrapper divs & the <ul>
  var $wrapper = $("<div class='wrapper'></div>"),
  $carouselWrapper = $("<div class='jcarousel-wrapper'></div>"),
  $carousel = $("<div class='jcarousel'></div>"),
  $list = $("<ul></ul>");

  $wrapper.append($carouselWrapper);
  $carouselWrapper.append($carousel);
  $carousel.append($list);

  // fill the <ul>
  var i = 6;  // number of things to add
  var stepper = 0;
  while(i > 0){
    var $newItem = $("<li class='carousel-li'></li>");
    var $newImg = $("<img class='carousel-img' src='/static/assets/Home/Art/3.jpeg' alt='Image 3'>");
    $newItem.append($newImg);
    switch(stepper){
      case 0:
        var $newFrame = $("<img class='carousel-frame' src='/static/assets/Control-Center/redbox.png' alt='frame'>");
        stepper++;
        break;
      case 1:
        var $newFrame = $("<img class='carousel-frame' src='/static/assets/Control-Center/pinkbox.png' alt='frame'>");
        stepper++;
        break;
      case 2:
        var $newFrame = $("<img class='carousel-frame' src='/static/assets/Control-Center/orangebox.png' alt='frame'>");
        stepper++;
        break;
      case 3:
        var $newFrame = $("<img class='carousel-frame' src='/static/assets/Control-Center/purplebox.png' alt='frame'>");
        stepper=0;
        break;
    }
    $newItem.append($newFrame);
    $list.append($newItem);
    i--;
  }
  var $prev = $("<a href='#' class='jcarousel-control-prev'></a>")
  var $next = $("<a href='#' class='jcarousel-control-next'></a>")
  $carousel.after($prev, $next);
  //$("#contacts-sidebar").after($wrapper);
  $("#main-content-wrapper").append($wrapper);
  setupAction();
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
//Schedule stuff//
var timesRowAdded=0;
var timesRowDeleted=0;
var weeklySched = {'0':['Sunday']};
function addRow() {
  console.log('Add row was cicked');
  timesRowAdded=timesRowAdded+1;
  var rowOn = timesRowAdded-timesRowDeleted;
  console.log('rowOn is ' + rowOn);

  var tableID = "new-band-schedule";
  var table = document.getElementById(tableID);
  if (!table) return;
  var newRow = table.rows[1].cloneNode(true);
  // Now get the inputs and modify their names
  var inputs = newRow.getElementsByTagName('input');
  var sel = newRow.getElementsByTagName('select')[0];
  sel.name=rowOn;
  console.log('Sel in add row is: ')
  console.log(sel);
  for (var input in inputs){
    //input.setAttribute=('name',rowOn.toString());
    inputs[input].name = rowOn.toString();
    console.log('Input Name is : ');
    console.log(inputs[input].name);
  }
  // Add the new row to the tBody (required for IE)
  var tBody = table.tBodies[0];
//  newRow.setAttribute('name', rowOn.toString();)
//  newRow.name = rowOn.toString();
  console.log('Name is : ');
//  console.log(sel.name);
  weeklySched[rowOn]=[];
  tBody.insertBefore(newRow, tBody.lastChild);
}

function deleteRow(el) {
  timesRowDeleted=timesRowDeleted+1;

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
//Band creation section:
function selectOnChange(sel){
  console.log("selectOnSubmit:  sel isss");
  console.log(sel);
  console.log(sel.value);
  console.log(sel.name);
  if(!sel.name){
    console.log("Got in if");
    weeklySched['0'][0]=sel.value;
  }
  else{
    weeklySched[sel.name][0]=sel.value;
  }

}
function startTimeChange(time){
  if (!time.name){
    weeklySched['0'][1]=time.value;
  }
  else{
    weeklySched[time.name][1]=time.value;
  }

  console.log('startTimeChange');
  console.log(time);
  console.log(time.name);
}
function endTimeChange(time){
  if (!time.name){
    weeklySched['0'][2]=time.value;
  }
  else{
    weeklySched[time.name][2]=time.value;
  }
  console.log('endTimeChange');
  console.log(time);
  console.log(time.name);
  console.log("Weekly Sched is :" + JSON.stringify(weeklySched));
}
function createBand(){
  var myNewBand = {
    'name': $('#new-band-title').val(),
    'zipcode':$('#new-band-zip').val(),
    'maxDist':$('#new-band-dist').val(),
    'price': $('#new-band-pay').val(),
    'picture':$('#new-band-pic').val(),
    'audioSample':$('#new-band-clip').val(),
    'audioPic':$('#new-band-clip-pic').val(),
    'description':$('#new-band-description').val(),
    'openDates':weeklySched
  };
  for (var key in myNewBand){
    console.log(myNewBand[key]);
    console.log(key);
    if (myNewBand[key]==null || myNewBand[key]==" " || myNewBand[key]==""){

      alert("Sorry, you must fill out the enitre form with non-empty values");
      return;
    }
  }
  convertZipBand(myNewBand);

}

function sendBandToDB(lat, lng, myBand){
  var name = myBand['name'];
  var zipcode = myBand['zipcode'];
  var maxDist = myBand['maxDist'];
  var price = myBand['price'];
  var picture = myBand['picture'];
  var audioSample = myBand['audioSample'];
  var audioPic = myBand['audioPic'];
  var description = myBand['description'];
  var openDates = myBand['openDates'];
  var qCategories = parseQueryString(description);

  if(!($("#new-band-pic")[0].files || $("#new-band-pic")[0].files[0])){
    alert('Please enter a valid .jpeg, or .png file for bands profile picture');
    return;
  }
  else if($("#new-band-pic")[0].files[0].type != 'image/jpeg'){
    if ($('#new-band-pic')[0].files[0].type != 'image/png'){
      alert('Please enter a valid .jpeg, or .png file for bands sample picture');
      return;
    }
  }
  if(!($("#new-band-clip-pic")[0].files || $("#new-band-clip-pic")[0].files[0])){
    alert('Please enter a valid .jpeg, or .png file for bands profile picture');
    return;
  }
  else if($("#new-band-clip-pic")[0].files[0].type != 'image/jpeg'){
    if ($("#new-band-clip-pic")[0].files[0].type != 'image/png'){
      alert('Please enter a valid .jpeg, or .png file for bands sample picture');
      return;
    }
  }
  if(!($("#new-band-clip")[0].files || $("#new-band-clip")[0].files[0])){
    alert('Please enter a valid .wav, or .mp3 file for bands profile picture');
    return;
  }
  else if($("#new-band-clip")[0].files[0].type != 'audio/wav'){
    if ($("#new-band-clip")[0].files[0].type != 'audio/mp3'){
      alert('Please enter a valid .jpeg, or .png file for bands sample picture');
      return;
    }
  }
  var image = $("#new-band-pic")[0].files[0];
  var formdata = new FormData();
  var bandAvatarPath = null;
  var bandSoundPath = null;
  var bandSamplePicPath = null;
  formdata.append('image', image);
  $.ajax({
      url: '/uploadBandAvatar',
      data: formdata,
      contentType: false,
      processData: false,
      type: 'POST',
      'success':function(data){
          alert(data);
          bandAvatarPath=data;
          var sound = $("#new-band-clip")[0].files[0];
          formdata = new FormData();
          formdata.append('soundByte', sound);
          $.ajax({
              url: '/uploadSoundByte',
              data: formdata,
              contentType: false,
              processData: false,
              type: 'POST',
              'success':function(data){
                  alert(data);
                  bandSoundPath=data;
                  var samplePic = $('#new-band-clip-pic')[0].files[0];
                  formdata = new FormData();
                  formdata.append('audioPic', samplePic);
                  $.ajax({
                      url: '/uploadAudioPic',
                      data: formdata,
                      contentType: false,
                      processData: false,
                      type: 'POST',
                      'success':function(data){
                        bandSamplePicPath=data;
                        var sample = {'audio':bandSoundPath, 'picture':bandSamplePicPath};
                        $.post('/band', {'name':name, 'zipcode':zipcode, 'maxDist':maxDist, 'price':price, 'picture':bandAvatarPath, 'sample':sample,'description':description, 'openDates':openDates, 'categories':qCategories, 'lat':lat, 'lng':lng}, result=>{
                          alert(result);
                        });
                      }
                  });

              }
          });
      }
  });
}
function tesSRC(){
  $('#testPic').src='static/uploads/GigPics/64e8c9ffbee6a8f44f205b50f59a5f3c';
}

function postGig(){
  cleanGigInput();
}
/*
<input id="new-gig-title" class="modal-input" type="text" placeholder="enter a title for your new gig"></input>
<label for="new-gig-date">date</label>
<input id="new-gig-date" class="modal-input" type="date"></input>
<label for="new-gig-start-time">from</label>
<input id="new-gig-start-time" class="modal-input" type="time"></input>
<label for="new-gig-end-time">to</label>
<input id="new-gig-end-time" class="modal-input" type="time"></input>
<label for="new-gig-loc">location</label>
<input id="new-gig-loc" class="modal-input" type="text"></input>
<label for="new-gig-pay">pay rate ($/hr)</label>
<input id="new-gig-pay" class="modal-input" type="text"></input>
<img id="new-gig-pic-preview"/>
<div id="new-gig-spacer"></div>
<label for="new-gig-pic">upload image</label>
<input id="new-gig-pic" class="modal-input"  name="avatar" type="file"></input>
<label id="new-gig-description-label" for="new-gig-description">description</label>
<textarea id="new-gig-description" class="modal-textarea"></textarea>*/
function cleanGigInput(){
  console.log("got into post gig");
  var name = $('#new-gig-title').val();
  console.log("name from gig form is: " + name);
  var address = $('#new-gig-loc').val();
  var price = $('#new-gig-pay').val();
  var description = $('#new-gig-description').val();
  var startDate = $('#new-gig-date').val();
  var startTime = $('#new-gig-start-time').val();
  var endTime = $('#new-gig-end-time').val();
  var date = new Date(startDate);
  var day = date.getDay();
  console.log("Date is: " + date + "day is : " + day);
  //Replace this real endate soon:
  var endDate = endTime;
  ////////
  var zipcode = $('#new-gig-zip').val();
  //var pic = newGigPic;
  console.log(newGigPic);
  var pic = newGigPic;
  var gig = {'name':name,
            'address': address,
            'price': price,
            'startDate': startDate,
            'startTime':startTime,
            'endTime': endDate,
            'zipcode' : zipcode,
            'description': description,
            'picID': pic,
            'day':day,
          };
  for (key in gig){
    if(gig[key]==null || gig[key]==" " || gig[key]==""){
      console.log(key);
      alert("Sorry, you must fill out the enitre form with non-empty values");
      return;
    }
  }

  convertZipGig(gig);

}

function sendGigToDB(lat,lng, myNewGig) {
  //must implment getting user name out of session
  var description =  myNewGig['description'];
  var categoriesFromStr = parseQueryString(description);
  var name = myNewGig['name'];
  var address = myNewGig['address'];
  var zipcode = myNewGig['zipcode'];
  var price = myNewGig['price'];
  var startDate = myNewGig['startDate'];
  var endTime = myNewGig['endTime'];
  var description = myNewGig['description'];
  var startTime = myNewGig['startTime'];
  var day = myNewGig['day'];
  switch (day){
    case 0:
    day = "Sunday";
    break;
    case 1:
    day = "Monday";
    break;
    case 2:
    day = "Tuesday";
    break;
    case 3:
    day = "Wednesday";
    break;
    case 4:
    day = "Thursday";
    break;
    case 5:
    day = "Friday";
    break;
    case 6:
    day = "Saturday";
    break;
    default:
    alert("Please enter a valid date");
    return;
    break;
  }

  //var picID = newGigPic;
  console.log("In send to db and global pic is : " + JSON.stringify(newGigPic));
  console.log(JSON.stringify(myNewGig));
  var image = $("#new-gig-pic")[0].files[0];
  var formdata = new FormData();
  formdata.append('image', image);
  $.ajax({
      url: '/uploadGigPic',
      data: formdata,
      contentType: false,
      processData: false,
      type: 'POST',
      'success':function(data){
          alert(data);
          picPath=data;
          $.post('/gig', {'name':name, 'address':address, 'zipcode': zipcode, 'price': price, 'startDate': startDate, 'startTime':startTime, 'day':day, 'endTime': endTime, 'applications': [], 'lat': lat, 'lng': lng, 'categories':categoriesFromStr, 'isFilled':false, 'bandFor':null, 'description':description, 'picture':picPath}, result => {
              console.log("got cb from post /gig");
              alert('result is ' + JSON.stringify(result));

            });
      }


  });


}

//HELPER functions and messaging///

function convertZipGig(myGig){
  var zipcode = myGig['zipcode'];
  if (!(zipcode.length==5)){
    alert('Please enter a valid zipcode');
    return;
  }
  var success = false;
  setTimeout(function() {
    if (!success)
    {
        // Handle error accordingly
        console.log("Got error with zipcode");
        alert("Please enter a valid zipcode");
        return;
    }
  }, 5000);
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?zip='+zipcode+',us&APPID=f89469b4b424d53ac982adacb8db19f6').done(function(data){
      console.log(JSON.stringify(data));
      var lat = data.coord.lat;
      var lng = data.coord.lon;
      sendGigToDB(lat,lng, myGig);
  });
}
function convertZipBand(myBand){
  var zipcode = myBand['zipcode'];
  if (!(zipcode.length==5)){
    alert('Please enter a valid zipcode');
    return;
  }
  console.log(zipcode);
  var success = false;
  setTimeout(function() {
    if (!success)
    {
        // Handle error accordingly
        console.log("Got error with zipcode");
        alert("Please enter a valid zipcode");
        return;
    }
  }, 5000);
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?zip='+zipcode+',us&APPID=f89469b4b424d53ac982adacb8db19f6').done(function(data){
      console.log(JSON.stringify(data));
      success=true;
      var lat = data.coord.lat;
      var lng = data.coord.lon;
      sendBandToDB(lat,lng, myBand);
    });



}

function parseQueryString(str){
  var categoriesFromStr={};
  var lowerCased = str.toLowerCase();
  lowerCased = lowerCased.replace(',', '""');
  console.log("in parse q str the lower cased str is "+str);
  for (key in categories){
    var type = categories[key]
    categoriesFromStr[type]=[];
    console.log("key is " + key);
    console.log("banks are " + wordBank[type]);
    for (word in wordBank[type]){
      console.log("word is : " + wordBank[type][word]);
      if (lowerCased.includes(wordBank[type][word])){
        console.log("word is in if : " + wordBank[type][word]);
        categoriesFromStr[type].push(wordBank[type][word]);
      }
    }
  }
  console.log("in parse from str, the categories from str are now" + JSON.stringify(categoriesFromStr));
  return categoriesFromStr;
}

//MESSAGING SECTION:

var socket = io();
function sendMessage(){
  //set body to text from box and rec id to the inteded reciver's user ID
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  //replace this with real id from contact menu
  var recID = id;
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


//WORD BANK//
var categories=['genres','insts','gigTypes','vibes'];
var wordBank = {
 genres:["blues","classic rock","country","dance","disco","funk","grunge",
 "hip-hop","hiphop","hip hop","rap","jazz","metal","new age","oldies","other","pop","r&b","r and b","randb",
 "rap","reggae","rock","techno","industrial","alternative","ska",
 "death metal","death-metal","pranks","soundtrack","euro-techno","ambient",
 "trip-hop","triphop","trip hop","vocal","jazz+funk","jazzfunk","funk","fusion","trance","classical",
 "instrumental","acid","house","game","gospel",
 "noise","alternrock","alternative rock","alternative","bass","soul","punk","space","meditative",
 "instrumental pop","instrumental rock","ethnic","gothic",
 "darkwave","techno-industrial","electronic","pop-folk","pop folk",
 "eurodance","dream","southern rock","comedy","cult","gangsta",
 "top 40","christian rap","pop/funk","jungle","native american",
 "cabaret","new wave","psychadelic","rave","showtunes","trailer",
 "lo-fi","tribal","acid punk","acid jazz","polka","retro",
 "musical","rock & roll","rock and roll","hard rock","folk","folk-rock","folk rock",
 "national folk","swing","fast fusion","bebop","latin","revival",
 "celtic","bluegrass","avantgarde","gothic rock","progressive rock",
 "psychedelic rock","symphonic rock","slow rock","big band",
 "chorus","easy listening","acoustic","humour","speech","chanson",
 "opera","chamber music","sonata","symphony","booty bass","primus",
 "porn groove","satire","slow jam","club","tango","samba",
 "folklore","ballad","power ballad","Rrythmic soul","freestyle",
 "duet","punk rock","drum solo","acapella","euro-house","dance hall","edm","grime","dubstep","drum and bass","drum&bass","cover","covers"],

 insts:["accordion","bagpipes","banjo","bass guitar","bass","bassoon","berimbau","dj","d.j.","singer","rapper","mc","bongo","freestyler","cello",
 "clarinet","cornet","cymbal","didgeridoo","double bass","upright","drum kit","drums","percussion","flute","french horn","glass harmonica","gong",
 "guitar","acoustic","electronic","harmonica","harp","harpsichord","hammered dulcimer","synth","tambourine","hurdy gurdy","jew’s harp",
 "lute","lyre","mandolin","marimba","melodica","oboe","ocarina","octobass","organ","sound system","pan pipes","piano","piccolo","recorder","saxophone",
 "sitar","synthesizer","timpani","triangle","trombone","trumpet","theremin","tuba","poet","vocals","viola","violin","whamola","xylophone","zither"],

 gigTypes:["birthday","party","fraternity","frat","bar","concert","corporate","kids","adult","adults","highschool","college","retirement","sorority",
 "gay","pride","festival","radio","hall","dance","bachelor","bachelorette","show","talent","chill","kickback","hangout","mobile","car","house","home","parade",
 "street","theater","exhibition","show","event","wedding","funeral","burial","eccentric","church","synagouge","mosque","temple","circle","meditation","studio session",
 "performance","rally","march","protest","ceremony","holiday","christmas","new years","halloween","valentines","bash","mosh","orgy","date","night out","night in",
 "night-in","service","store","opening","closing","buisness","booth","meeting","introduction","orientation","graduation"],

 vibes:["anthem","aria","ariose","arioso","assonance","atmospheric","background","banging","banger","bangers","baroque","beat","bell-like","bombastic",
 "booming","boomy","bop","breath","breathy","bright","bass","cadence",
 "call","canorous","canticle","cappella","carol","catchy","chamber","chant","cheerful","chime",
 "choral","chorale","classical","clear","consonant","contemporary","danceable","deep","descant","ditty",
 "dramatic","dulcet","dynamic","eclectic","electronic","energetic","entertaining","euphonic","euphonious","evensong",
 "evergreen","experimental","explosive","facile","fast","funky","happy","harmonic","harmonious","headbanging","headbanger","head banging","healing",
 "heroic","high-flown","high-sounding","high","hit","homophonic","honeyed","hook","hymn",
 "flawless","fluid","forte","fresh","fugue","full","full-toned","fuses", "golden","grand","groovy","covers","covers","jazzy","lay",
 "hyped","hype","hypnotic","hi-fi","improvised","in tune","inflection","instrumental","intonation","intricate","intro","jam","jaunty",
 "lied","light","lilt","lilting","liquid","live","lively","lofty","lyric","lyrical",
 "magniloquent","major","masterful","mellifluous","mellow","melodic","melodious","melody","minor","modern","monophonic","musical","musicality",
 "muzak","ode","opera","orchestral","orotund","paean","passionate","percussive",
 "pianissimo","piece","piping","plainsong","playful","pleasant","poetic","polyphonic","pompous",
 "popular","progressive","psalm","recitative","refined","refrain","resonance","resonant","resounding",
 "reverberant","rhythmic","rhythmical","rich","ringing","riveting","rockin’","rockin","rollicking","romantic","round","shout",
 "silver-toned","silvery","sing","soft","song","songful","sonic",
 "session","shrill","singable","singing","soprano","soulful","staccato","stentorian","stentorious","strain","strong","sweet-sounding",
 "sweet-toned","swing","symphonic",
 "sonorous","soothing","sophisticated","symphonious","symphony","tubular","tumid","tuned","tuneful","unison","up-tempo","unified","uplifting",
 "sweet","throbbing","tight","timeless","tonal","atonal","treble","warble","wobble","wavey","warm","wet","dry","wild","woodnote","western",
 "upbeat","vibrant","vocal","high-volume","low-volume","loud","soft","hard","hardcore","west-coast","east-coast","chopper","vibes",
 "angry","melancholy","blue","new","old","young","difuse","nasty","raunchy","ridiculous","real","dumb"
 ,"evil","godly","zealous","functional","stupid","purple","green","gnarly","fun","forceful","fucking","fuck","fucked up","crazy","sloppy","disgusting"]
};
//var fs = require('fs');
var newGigPic = null;
function readURL(input) {

    if (input.files && input.files[0]) {
      console.log(input.files[0]);
      newGigPic=input.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#new-gig-pic-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#new-gig-pic").change(function(){
    readURL(this);
});
var newPicBand = null;
function readURLForB(input) {
    if (input.files && input.files[0]) {
      newPicBand=input.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#new-band-pic-preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#new-band-pic").change(function(){
    readURLForB(this);
});
var newBandSamplePic=null;
function readURLForB2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        newBandSamplePic=input.files[0];
        reader.onload = function (e) {
            $('#new-band-clip-preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#new-band-clip-pic").change(function(){
    readURLForB2(this);
});


// function to create file from base64 encoded string
