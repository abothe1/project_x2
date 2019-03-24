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

var userMessages = {};
var userContacts = [];

//CHNAGE GIGS SECTION:?////////

var changingGigs = {};
function gigDateChanged(input){
  console.log(" ");
  //console.log('In descritpt changed the gig id is: ' + theGig._id);
  console.log("The input value is: " + input.value);
}
function gigStartTimeChanged(input){
  console.log(" ");
  //console.log('In descritpt changed the gig id is: ' + theGig._id);
  console.log("The input value is: " + input.value);
}
function gigEndTimeChanged(input){
  console.log(" ");
//  console.log('In descritpt changed the gig id is: ' + theGig._id);
  console.log("The input value is: " + input.value);
}
function gigPayChanged(input){
  console.log(" ");
//  console.log('In descritpt changed the gig id is: ' + theGig._id);
  console.log("The input value is: " + input.value);
}
function gigDescriptChanged(input){
  console.log(" ");
//  console.log('In descritpt changed the gig id is: ' + theGig._id);
  console.log("The input value is: " + input.value);
}
function gigConfirmHit(input){
  console.log(" ");
  console.log('In descritpt changed the gig id is: ' + input);
}

///////////////
class OpenGig{
  constructor(gig, openGigCallback){
    this.titleDiv = document.createElement("div");
    this.titleReal = document.createElement("h3");
    this.titleReal.innerHTML = gig.name;
    this.titleDiv.append(this.titleReal);
    this.container = document.createElement("div");
    this.container.className = "open-gig";
    this.info = document.createElement("div");
    this.info.className = "open-gig-info";
    this.gigImg = document.createElement("div");
    this.gigImg.className = "open-gig-image";
    this.title = document.createElement("h3");
    this.title.innerHTML = "Gig Image";
    this.title.className = "gig-title";
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
    // this.gigDescT.onchange = gigDescriptChange(this.gigDescT);
    this.gigDescT.innerHTML = gig.description;
    this.gigDT = document.createElement("div");
    this.gigDT.className = "open-gig-date-time";
    this.gigDTH = document.createElement("h3");
    this.gigDTH.innerHTML = "Date";
    this.gigDate = document.createElement("input");
    this.gigDate.className = "open-gig-date";
    this.gigDate.onchange = 'gigDateChanged(this)';
    this.gigDate.name=gig._id;
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
    this.gigST.onchange = gigStartTimeChanged(this.gigST);
    this.gigST.name=gig._id;
    // this.gigST.value = gig.startTime;
    this.gigETL = document.createElement("label");
    this.gigETL.for = "open-gig-end-time";
    this.gigETL.innerHTML = "to";
    this.gigET = document.createElement("input");
    this.gigET.className = "open-gig-end-time";
    this.gigET.type = "time";
    this.gigET.onchange = 'gigEndTimeChanged(this)';
    this.gigET.name=gig._id;
    // this.gigET.value = gig.endTime;
    this.gigLP = document.createElement("div");
    this.gigLP.className = "open-gig-loc-pay";
    this.gigLPH = document.createElement("h3");
    this.gigLPH.innerHTML = "Location";
    this.gigLoc = document.createElement("input");
    this.gigLoc.className = "open-gig-loc";
    this.gigLoc.value = gig.address;
    this.gigLoc.onchange = 'gigLocChanged(this)';
    this.gigLoc.name=gig._id;

    this.gigPL = document.createElement("h3");
    this.gigPL.id = "open-gig-pay-label";
    this.gigPL.innerHTML = "Max Pay ($)";
    this.gigPay = document.createElement("input");
    this.gigPay.className = "max-pay-input";
    this.gigPay.onchange = 'gigPayChanged(this)';
    this.gigPay.name=gig._id;

    // this.gigPay.value = gig.payment;
    this.gigConfirm = document.createElement("button");
    this.gigConfirm.onclick = 'gigConfirmHit(this)';
    this.gigConfirm.name=gig._id;
    this.gigConfirm.className = "open-gig-confirm";
    this.gigConfirm.innerHTML = "confirm changes";
    this.gigAppH = document.createElement("h3");
    this.gigAppH.innerHTML = "applicants";

    if(gig.hasOwnProperty("applications")){
      if(gig.applications != null){
        var newObj = {
          "apps":gig.applications,
          "gigID": gig._id
        }
        new Carousel(newObj,"hosted-applications",carCallback=>{
          this.applicantCarousel = carCallback;
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
          this.titleDiv.append(this.container);
          // tier 0
          // openGigs.append(this.container);
          openGigCallback(this);
        });
      }
      else{
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
        this.titleDiv.append(this.container);
        // tier 0
        // openGigs.append(this.container);
        openGigCallback(this);
      }
    }
    else{
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
      this.titleDiv.append(this.container);
      // tier 0
      // openGigs.append(this.container);
      openGigCallback(this);
    }

  }
}

class BookedGig {

  constructor(gig, bookedGigCallback){
    this.container = document.createElement("div");
    this.container.className = "booked-gig";
    this.titleEl = document.createElement("h3");
    this.titleEl.innerHTML = gig.name;
    this.titleEl.className = "gig-title";
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
    this.actPicFrame = document.createElement("img");
    this.actPicFrame.className = "act-pic-frame";
    this.actPicFrame.src = "../static/assets/Home/orangebox.png";
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
  // test function
  if(bandID == "test"){
    console.log("got in get band info clause");
    var aBand = {
      "_id": "2807893jfdskalf",
      "name":"jimmy hendrix",
      "rating":"89",
      "picture":"../static/assets/Home/Art/20.jpeg",
      "upcomingGigs":["test","test","test","test"],
      "appliedGigs":["test","test","test","test"],
      "finishedGigs":["test","test","test","test"],
      "interestedGigs":["test","test","test","test"]
    };
    cb(aBand);
  }else{
    console.log('////////////////////');
    console.log(bandID);
    $.get('/aBand', {'id':bandID}, result=>{
      console.log('Got result from get a band here it is : ' + JSON.stringify(result));
      cb(result);
    });
  }
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
        if(gigs[gig].isFilled && !(gigs[gig].confirmed)){
          new BookedGig(gigs[gig], res=>{
            bookedGigs.append(res.container);
          });
        }
      }
      break;
      case "open":
      var openGigs = document.createElement("div");
      openGigs.className = "booked-gigs";
      var openGigsH = document.createElement("h2");
      openGigsH.innerHTML = "Open Events";
      openGigs.append(openGigsH);
      profileGigs.append(openGigs);
      for(var gig in gigs){
        if( !(gigs[gig].isFilled) && !(gigs[gig].confirmed) ){
          new OpenGig(gigs[gig], res=>{
            openGigs.append(res.titleDiv);
            setupAction();
          });
        }
      }
      break;
      case "past-hosted":
      var pastGigs = document.createElement("div");
      pastGigs.className = "past-gigs";
      var pastGigsH = document.createElement("h2");
      pastGigsH.innerHTML = "Past Booked Bands";
      pastGigs.append(pastGigsH);
      profileGigs.append(pastGigs);
      var pastGigsArr = [];
      console.log("got in past-hosted");
      for(var gig in gigs){
        if(gigs[gig].confirmed && gigs[gig].isFilled){
          pastGigsArr.push(gigs[gig]);
        }
      }
      if(pastGigsArr.length > 0){

        new Carousel(pastGigsArr, "past-hosted", res=>{
          pastGigs.append(res.wrapper);
          setupAction();
        });
      }
      break;
    }
  }
}

class BandSection{
  constructor(band, identifier, bandSectionCallback){
     // console.log('band inc Band Section is + :' + JSON.stringify(band));
    switch(identifier){
      case "info":
      this.container = document.createElement("div");
      this.stars = document.createElement("div");
      this.stars.className = "band-stars";
      this.star1 = document.createElement("img");
      this.star1.className = "star";
      this.star1.id = band._id+"-star-1";
      this.star2 = document.createElement("img");
      this.star2.className = "star";
      this.star2.id = band._id+"-star-2";
      this.star3 = document.createElement("img");
      this.star3.className = "star";
      this.star3.id = band._id+"-star-3";
      this.star4 = document.createElement("img");
      this.star4.className = "star";
      this.star4.id = band._id+"-star-4";
      this.star5 = document.createElement("img");
      this.star5.className = "star";
      this.star5.id = band._id+"-star-5";
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

        this.editBandTitle = document.getElementById("current-band-title");
        this.editBandTitle.value = band.name;
        this.editBandTitle.addEventListener("change",function(){

        });
        this.editBandZip = document.getElementById("current-band-zip");
        this.editBandZip.value = band.zipcode;
        this.editBandZip.addEventListener("change",function(){

        });
        this.editBandPrice = document.getElementById("current-band-pay");
        this.editBandPrice.value = band.price;
        this.editBandPrice.addEventListener("change",function(){

        });
        this.editBandDesc = document.getElementById("current-band-description");
        this.editBandDesc.value = band.description;
        this.editBandDesc.addEventListener("change",function(){

        });
        this.editScheduleTable = document.getElementById("current-band-schedule");
        this.editScheduleTableBody = document.getElementById("current-band-schedule-tbody");
        for(var day in band.openDates){
          var dayOfWeek = band.openDates[day][0];
          var startTime = band.openDates[day][1];
          console.log("start: "+startTime);
          var endTime = band.openDates[day][2];
          console.log("end: "+endTime);
          var newRow = document.createElement("tr");
          var colOne = document.createElement("td");
          var selectionEl = document.createElement("select");
          selectionEl.className = "current-band-schedule-select";
          var optionSun = document.createElement("option");
          optionSun.innerHTML = "Sunday";
          selectionEl.append(optionSun);
          var optionMon = document.createElement("option");
          optionMon.innerHTML = "Monday";
          selectionEl.append(optionMon);
          var optionTue = document.createElement("option");
          optionTue.innerHTML = "Tuesday";
          selectionEl.append(optionTue);
          var optionWed = document.createElement("option");
          optionWed.innerHTML = "Wednesday";
          selectionEl.append(optionWed);
          var optionThu = document.createElement("option");
          optionThu.innerHTML = "Thursday";
          selectionEl.append(optionThu);
          var optionFri = document.createElement("option");
          optionFri.innerHTML = "Friday";
          selectionEl.append(optionFri);
          var optionSat = document.createElement("option");
          optionSat.innerHTML = "Saturday";
          selectionEl.append(optionSat);
          selectionEl.value = dayOfWeek;
          colOne.append(selectionEl);
          var colTwo = document.createElement("td");
          var startTimeInput = document.createElement("input");
          startTimeInput.type = "time";
          startTimeInput.className = "current-band-schedule-start-time";
          startTimeInput.value = startTime;
          colTwo.append(startTimeInput);
          var colThree = document.createElement("td");
          var endTimeInput = document.createElement("input");
          endTimeInput.type = "time";
          endTimeInput.className = "current-band-schedule-end-time";
          endTimeInput.value = endTime;
          colThree.append(endTimeInput);
          var colFour = document.createElement("td");
          var removeButton = document.createElement("input");
          removeButton.type = "button";
          removeButton.value = "remove";
          removeButton.className = "current-band-schedule-remove";
          removeButton.addEventListener("click",function(){
            console.log("remove row clicked");
            deleteRow(removeButton);
          });
          colFour.append(removeButton);
          newRow.append(colOne);
          newRow.append(colTwo);
          newRow.append(colThree);
          newRow.append(colFour);
          this.editScheduleTableBody.append(newRow);
        }
        this.editScheduleTableFoot = document.getElementById("current-band-schedule-tfoot");
        var footRow = document.createElement("tr");
        var colOne = document.createElement("td");
        this.addDayButton = document.createElement("a");
        this.addDayButton.className = "current-band-schedule-add";
        this.addDayButton.href = "#";
        this.addDayButton.innerHTML = "add another day";
        this.addDayButton.addEventListener("click",function(){
          var editScheduleTableBody = document.getElementById("current-band-schedule-tbody");
          var newRow = document.createElement("tr");
          var colOne = document.createElement("td");
          var selectionEl = document.createElement("select");
          selectionEl.className = "current-band-schedule-select";
          var optionSun = document.createElement("option");
          optionSun.innerHTML = "Sunday";
          selectionEl.append(optionSun);
          var optionMon = document.createElement("option");
          optionMon.innerHTML = "Monday";
          selectionEl.append(optionMon);
          var optionTue = document.createElement("option");
          optionTue.innerHTML = "Tuesday";
          selectionEl.append(optionTue);
          var optionWed = document.createElement("option");
          optionWed.innerHTML = "Wednesday";
          selectionEl.append(optionWed);
          var optionThu = document.createElement("option");
          optionThu.innerHTML = "Thursday";
          selectionEl.append(optionThu);
          var optionFri = document.createElement("option");
          optionFri.innerHTML = "Friday";
          selectionEl.append(optionFri);
          var optionSat = document.createElement("option");
          optionSat.innerHTML = "Saturday";
          selectionEl.append(optionSat);
          colOne.append(selectionEl);
          var colTwo = document.createElement("td");
          var startTimeInput = document.createElement("input");
          startTimeInput.type = "time";
          startTimeInput.className = "current-band-schedule-start-time";
          colTwo.append(startTimeInput);
          var colThree = document.createElement("td");
          var endTimeInput = document.createElement("input");
          endTimeInput.type = "time";
          endTimeInput.className = "current-band-schedule-end-time";
          colThree.append(endTimeInput);
          var colFour = document.createElement("td");
          var removeButton = document.createElement("input");
          removeButton.type = "button";
          removeButton.value = "remove";
          removeButton.className = "current-band-schedule-remove";
          removeButton.addEventListener("click",function(){
            console.log("remove row clicked");
            deleteRow(removeButton);
          });
          colFour.append(removeButton);
          newRow.append(colOne);
          newRow.append(colTwo);
          newRow.append(colThree);
          newRow.append(colFour);
          editScheduleTableBody.append(newRow);
        });
        colOne.append(this.addDayButton);
        var colTwo = document.createElement("td");
        var colThree = document.createElement("td");
        var colFour = document.createElement("td");
        this.editScheduleTableFoot.append(colOne);
        this.editScheduleTableFoot.append(colTwo);
        this.editScheduleTableFoot.append(colThree);
        this.editScheduleTableFoot.append(colFour);
        // document.getElementById("current-band-dist").value = band.maxDist;
        document.getElementById("current-band-pic-preview").src = band.picture;

        document.getElementById("close-edit-band").addEventListener("click",function(){
          var tb = document.getElementById("current-band-schedule-tbody");
          while(tb.hasChildNodes()){
             tb.removeChild(tb.firstChild);
          }
          var tf = document.getElementById("current-band-schedule-tfoot");
          while(tf.hasChildNodes()){
            tf.removeChild(tf.firstChild);
          }
          document.getElementById('modal-wrapper-current-band').style.display='none';
        });

        document.getElementById("current-band-edit").addEventListener("click",function(){
          // edit stuff
        });


        modalWrapCurrent.style.display='block';
      });
      this.container.append(this.editButton);
      bandSectionCallback(this);
      break;
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
    }
  }
}

class Carousel{
  constructor(obj,indicator,carCallback){
    switch(indicator){
      case "hosted-applications":
      // obj will contain band IDs
      // get applicant data
      this.handleBands(obj.apps, result=>{
        this.applicants = result;
        this.gigID = obj.gigID;
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
          newFrame.src = "../static/assets/Control-Center/purplebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+band;
          newOverlay.setAttribute("id",overlayID);

          var viewBtn = document.createElement("input");
          viewBtn.type = "button";
          viewBtn.className = "car-view-button";
          viewBtn.bandID = this.applicants[band]._id;
          viewBtn.gigID = this.gigID;
          viewBtn.value = "view";
          var bookBtn = document.createElement("input");
          bookBtn.type = "button";
          bookBtn.className = "car-book-button";
          bookBtn.bandID = this.applicants[band]._id;
          bookBtn.gigID = this.gigID;
          bookBtn.value = "book";
          var declineBtn = document.createElement("input");
          declineBtn.type = "button";
          declineBtn.className = "car-decline-button";
          declineBtn.bandID = this.applicants[band]._id;
          declineBtn.gigID = this.gigID;
          declineBtn.value = "decline";

          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.applicants[band].name;
          // appends
          newItem.append(newImg);
          newOverlay.append(viewBtn);
          newOverlay.append(bookBtn);
          newOverlay.append(declineBtn);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.carList.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem.viewBtn = viewBtn;
          newItem.bookBtn = bookBtn;
          newItem.declineBtn = declineBtn;
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
      this.pastGigs = obj;
      this.wrapper = document.createElement("div");
      this.wrapper.className = "wrapper";
      this.wrapper.style.marginLeft = "0px";
      this.carWrap = document.createElement("div");
      this.carWrap.className = "jcarousel-wrapper";
      this.carousel = document.createElement("div");
      this.carousel.className = "jcarousel";
      this.list = document.createElement("ul");
      this.bandIdArr = [];
      for(var gig in this.pastGigs){
        this.bandIdArr.push(this.pastGigs[gig].bandFor);
      }
      this.handleBands(this.bandIdArr,res=>{
        this.bandsObj = res;
        for(var gig in this.pastGigs){
          var bandName = this.bandsObj[gig].name;
          var id = this.pastGigs[gig]._id;
          var name = this.pastGigs[gig].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          newImg.src = this.bandsObj[gig].picture;
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "../static/assets/Control-Center/pinkbox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var rateP = document.createElement("p");
          rateP.innerHTML = "rate " + bandName + " from 0 to 100";
          rateP.className = "rate-p";
          var rateInput = document.createElement("input");
          rateInput.className = "rate-input";
          rateInput.type = "number";
          rateInput.max = "100";
          rateInput.min = "0";
          rateInput.value = 50;
          var rateButton = document.createElement("input");
          rateButton.type = "button";
          rateButton.className = "rate-button";
          rateButton.value = "give rating";
          rateButton.bandID = this.bandsObj[gig]._id;
          rateButton.gigID = this.pastGigs[gig]._id;
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.bandsObj[gig].name;
          newItem.append(newImg);
          newOverlay.append(rateP);
          newOverlay.append(rateInput);
          newOverlay.append(rateButton);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem.rateInput = rateInput;
          newItem.rateButton = rateButton;
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
          newFrame.src = "../static/assets/Control-Center/purplebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var confirmP = document.createElement("p");
          confirmP.className = "result-overlay-confirm-p";
          confirmP.innerHTML = "confirm payment of $"+this.upcomingGigs[gig].price;
          var confirmInput = document.createElement("input");
          confirmInput.className = "gig-confirm-input-upcoming";
          confirmInput.placeholder = "code from venue"
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
      this.handleAppliedGigs(obj, result=>{
        this.appliedGigs = result; //index 0 is a gig, index 1 is bool
        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";
        this.carWrap = document.createElement("div");
        this.carWrap.className = "jcarousel-wrapper";
        this.carousel = document.createElement("div");
        this.carousel.className = "jcarousel";
        this.list = document.createElement("ul");
        for(var gig in this.appliedGigs){
          var id = this.appliedGigs[gig][0]._id;
          var name = this.appliedGigs[gig][0].name;
          var newItem = document.createElement("li");
          newItem.className = "carousel-li";
          // img
          var newImg = document.createElement("img");
          newImg.className = "carousel-img";
          if(this.appliedGigs[gig][0].hasOwnProperty("picture")){
            newImg.src = this.appliedGigs[gig][0].picture;
          }
          // frame
          var newFrame = document.createElement("img");
          newFrame.className = "carousel-frame";
          newFrame.src = "../static/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+this.appliedGigs[gig][0].price;
          // nameplate
          var nameDiv = document.createElement("div");
          nameDiv.className = "result-name-div";
          var nameP = document.createElement("p");
          nameP.className = "result-name-p";
          nameP.innerHTML = this.appliedGigs[gig][0].name;
          newItem.append(newImg);
          newOverlay.append(priceText);
          newItem.appendChild(newOverlay);
          newItem.append(newFrame);
          console.log(this.appliedGigs[gig][1]);
          if(this.appliedGigs[gig][1]){
            // it's rejected
            var newX = document.createElement("h1");
            newX.className = "red-x";
            newX.innerHTML = "X";
            newItem.append(newX);
          }
          nameDiv.append(nameP);
          newItem.append(nameDiv);
          this.list.append(newItem);
          //event listener data preprocessing
          newItem.newOverlay = newOverlay;
          newItem._id = this.appliedGigs[gig][0]._id;
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
          newFrame.src = "../static/assets/Control-Center/orangebox.png";
          // overlay
          var newOverlay = document.createElement("div");
          newOverlay.className = "result-overlay";
          var overlayID = "result-overlay-"+gig.name;
          newOverlay.setAttribute("id",overlayID);
          var priceText = document.createElement("p");
          priceText.className = "result-overlay-p";
          priceText.innerHTML = "$"+gig.price;
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

  handleBands(idArr, cb){
    // test function
    if(idArr[0]=="test"){
      var bands = [
        {
          "_id": "2807893jfdskalf",
          "name":"jimmy hendrix",
          "rating":"89",
          "picture":"../static/assets/Home/Art/20.jpeg",
          "upcomingGigs":["test","test","test","test"],
          "appliedGigs":["test","test","test","test"],
          "finishedGigs":["test","test","test","test"],
          "interestedGigs":["test","test","test","test"]
        },
        {
          "_id": "ooooeiousjkl",
          "name":"billy walls",
          "rating":"43",
          "picture":"../static/assets/Home/Art/16.jpeg",
          "upcomingGigs":["test","test","test","test"],
          "appliedGigs":["test","test","test","test"],
          "finishedGigs":["test","test","test","test"],
          "interestedGigs":["test","test","test","test"]
        },
        {
          "_id": "fuladlsu2222",
          "name":"TASHKII",
          "rating":"89",
          "picture":"../static/assets/Home/Art/17.jpeg",
          "upcomingGigs":["test","test","test","test"],
          "appliedGigs":["test","test","test","test"],
          "finishedGigs":["test","test","test","test"],
          "interestedGigs":["test","test","test","test"]
        },
        {
          "_id": "ewyoieueoifwoifj",
          "name":"Sammy DEEEZ",
          "rating":"44",
          "picture":"../static/assets/Home/Art/19.jpeg",
          "upcomingGigs":["test","test","test","test"],
          "appliedGigs":["test","test","test","test"],
          "finishedGigs":["test","test","test","test"],
          "interestedGigs":["test","test","test","test"]
        },
        {
          "_id": "dlakdlanvlkadnvdls",
          "name":"VVUUUURREE",
          "rating":"02",
          "picture":"../static/assets/Home/Art/18.jpeg",
          "upcomingGigs":["test","test","test","test"],
          "appliedGigs":["test","test","test","test"],
          "finishedGigs":["test","test","test","test"],
          "interestedGigs":["test","test","test","test"]
        },
      ];
      cb(bands);
    }else{
      this.handleBandsHelper(idArr, res=>{
        if (res.length==idArr.length){
          cb(res);
        }
      });
    }
  }

  handleAppliedGigs(obj,cb){
    if(obj[0][0] == "test"){
      var gigs = [
        [{
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"256",
          "picture": "../static/assets/Home/Art/6.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },false],
        [{
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green man room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"11",
          "picture": "../static/assets/Home/Art/7.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },false],
        [{
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green HAZE room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"23",
          "picture": "../static/assets/Home/Art/8.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },true],
        [{
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"99",
          "picture": "../static/assets/Home/Art/9.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },false],
        [{
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"60",
          "picture": "../static/assets/Home/Art/10.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },false]
      ];
      cb(gigs);
    }else{
      var idArr = [];
      for(var gig in obj){
        idArr.push(obj[gig][0]);
      }
      this.handleGigsHelper(idArr, res=>{
        if (res.length==idArr.length){
          for(var gig in res){
            obj[gig][0] = res[gig];
          }
          cb(obj);
        }
      });
    }
  }


  handleGigs(idArr, cb){
    // test function
    if(idArr[0] == "test"){
      var gigs = [
        {
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"256",
          "picture": "../static/assets/Home/Art/6.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },
        {
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green man room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"11",
          "picture": "../static/assets/Home/Art/7.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },
        {
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green HAZE room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"23",
          "picture": "../static/assets/Home/Art/8.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },
        {
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"99",
          "picture": "../static/assets/Home/Art/9.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        },
        {
          "_id":"5c44fd84003e48d1b718c327",
          "name":"green mean machine room",
          "address":"N27 W5230 Hamilton rd.",
          "price":"60",
          "picture": "../static/assets/Home/Art/10.jpeg",
          "startDate":"2019-01-26T14:22",
          "endDate":"",
          "applications":null,
          "lat":"0","lng":"0",
          "categories":{
            "genres":["bass","punk"],
            "insts":["bass guitar","bass","guitar"],
            "vibes":["bass","","","dumb"]
          },
          "isFilled":true,
          "bandFor":"none"
        }
      ];
      cb(gigs);
    }else{
      var gigProxy=[];
       this.handleGigsHelper(idArr, res=>{
         if (res.length==idArr.length){
           cb(res);
         }
       });
    }
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
    if(obj.hasOwnProperty("viewBtn")){
      obj.viewBtn.addEventListener("click",function(){
        console.log("band id: "+obj.viewBtn.bandID);
        console.log("gig id: "+obj.viewBtn.gigID);
      });
    }
    if(obj.hasOwnProperty("bookBtn")){
      obj.bookBtn.addEventListener("click",function(){
        console.log("band id: "+obj.bookBtn.bandID);
        console.log("gig id: "+obj.bookBtn.gigID);
      });
    }
    if(obj.hasOwnProperty("declineBtn")){
      obj.declineBtn.addEventListener("click",function(){
        console.log("band id: "+obj.declineBtn.bandID);
        console.log("gig id: "+obj.declineBtn.gigID);
      });
    }
    if(obj.hasOwnProperty("rateButton")){
      obj.rateButton.addEventListener("click",function(){
        console.log("band id: "+obj.rateButton.bandID);
        console.log("gig id: "+obj.rateButton.gigID);
        console.log("value is: "+obj.rateInput.value);
      });
      obj.rateInput.addEventListener("change",function(){
        if(obj.rateInput.value < 0){
          obj.rateInput.value = 0;
        }
        if(obj.rateInput.value > 100){
          obj.rateInput.value = 100;
        }
      });
    }
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
    userContacts = user.contacts;
    userMessages = user.messages;
    id = user['_id'];
    $('#userNameHeader').html(user['username']);
    socket.on(id, (msg)=>{
      alert('recieved message here it is: ' + JSON.stringify(msg));
      userMessages.push(msg);
      if(box != null){
        var newName = "";
        for(var contact in userContacts){
          if(userContacts[contact].id == msg.recID){
            newName = userContacts[contact].name;
          }
        }
        $("#chat-div").chatbox("option", "boxManager").addMsg(newName, msg.body);
      }
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
function buildBands(bands, buildBandsCallback){
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
    var bandContainer = document.createElement("div");
    bandContainer.append(bandTitle);
    var newNav = document.createElement("li");
    var newNavA = document.createElement("a");
    newNavA.href = "#"+bandTitle.id;
    newNavA.innerHTML = band.name;
    newNav.append(newNavA);
    var profilesListDiv = document.getElementById("profiles-list");
    profilesListDiv.append(newNav);
    mainContent.append(bandContainer);
    new BandSection(band,"info",bandSectionCallback=>{
      bandContainer.append(bandSectionCallback.container);
      var starArr = [bandSectionCallback.star1.id,bandSectionCallback.star2.id,bandSectionCallback.star3.id,bandSectionCallback.star4.id,bandSectionCallback.star5.id];
      loadStars(band.rating,starArr);
    });
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

  });
  buildBandsCallback();
}

function buildGigs(gigs){
    new GigSection(gigs,"booked");
    new GigSection(gigs,"open");
    new GigSection(gigs,"past-hosted");
    // new GigSection(gigs,"open", gigSectionCallback=>{
    //   profileGigs.append(gigSectionCallback.container);
    //   setupAction();
    // });
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

function createWebPage(user){
  console.log(JSON.stringify(user));
  var allBands = user['bands'];
  var allGigs = user['gigs'];
  profileGigs = document.getElementById("profile-gigs");
  mainContent = document.getElementById("main-content-wrapper");
  profilesList = document.getElementById("profiles-list");
  buildBands(allBands,function(){
    var bottomSpacer = document.createElement("div");
    bottomSpacer.className = "bottom-spacer";
    bottomSpacer.append(document.createElement("br"));
    mainContent.append(bottomSpacer);
  });
  buildGigs(allGigs);
  populateDropDown(allGigs);


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

var box = null;



function init(){

  var about = document.getElementById("about-btn");
  about.addEventListener("click",function(){
    console.log(" box is.... : "+box);
  })

  //loadBands(user);
  // getUsername();
  var star1 = "user-star-1";
  var star2 = "user-star-2";
  var star3 = "user-star-3";
  var star4 = "user-star-4";
  var star5 = "user-star-5";
  var stars = [star1,star2,star3,star4,star5];
  var mainContent = document.getElementById("main-content-wrapper");

  loadStars(60, stars);

  var user = {
    "name": "booth",
    "_id": "albkjdlk48402lkas10",
    "contacts": [
      {"_id": "oidfasjodisjfasd", "name":"zeee"}, {"_id": "sadfsdafsdfasdfasd", "name":"adddd"}, {"_id": "ldasjkfdsajdflsad", "name":"creee"}
    ],
    "messages": {
      "oidfasjodisjfasd": [
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"},
        {time: 32323, recieverID: 232323, senderID: "oidfasjodisjfasd", body: "Hello AB AGAIN from Z"}
      ],
      "sadfsdafsdfasdfasd": [
        {time: 32323, recieverID: 232323, senderID: "sadfsdafsdfasdfasd", body: "Hello AB from A"},
        {time: 32323, recieverID: 232323, senderID: "sadfsdafsdfasdfasd", body: "Hello AB AGAIN from A"}
      ],
      "ldasjkfdsajdflsad": [
        {time: 32323, recieverID: 232323, senderID: "ldasjkfdsajdflsad", body: "Hello AB from C"},
        {time: 32323, recieverID: 232323, senderID: "ldasjkfdsajdflsad", body: "Hello AB AGAIN from C"}
      ]
    },
    "bands": [
      {
        "_id": "2807893jfdskalf",
        "name":"jimmy hendrix",
        "rating":"89",
        "picture":"../static/assets/Home/Art/20.jpeg",
        "upcomingGigs":["test","test","test","test"],
        "appliedGigs":[["test",false],["test",false],["test",false],["test",false]],
        "finishedGigs":["test","test","test","test"],
        "interestedGigs":["test","test","test","test"]
      },
      {
        "_id": "ooooeiousjkl",
        "name":"billy walls",
        "rating":"43",
        "picture":"../static/assets/Home/Art/16.jpeg",
        "upcomingGigs":["test","test","test","test"],
        "appliedGigs":[["test",false],["test",false],["test",false],["test",false]],
        "finishedGigs":["test","test","test","test"],
        "interestedGigs":["test","test","test","test"]
      },
      {
        "_id": "fuladlsu2222",
        "name":"TASHKII",
        "rating":"89",
        "picture":"../static/assets/Home/Art/17.jpeg",
        "upcomingGigs":["test","test","test","test"],
        "appliedGigs":[["test",false],["test",false],["test",false],["test",false]],
        "finishedGigs":["test","test","test","test"],
        "interestedGigs":["test","test","test","test"]
      }
    ],
    "gigs": [
      {
        "_id":"baldkjafdlksjfaldksjfalsdkjfads",
        "name":"A booked gig YEET",
        "address":"N27 W5230 Hamilton rd.",
        "description":"bleep blarp nardbag mc jazzy funck fusion wowkwwkw! sdo if you wanna crap eee!",
        "price":"23",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":null,
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":false,
        "bandFor":"test"
      },
      {
        "_id":"baldkjafdlksjfaldksjfalsdkjfads",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":false,
        "confirmed":false,
        "bandFor":"test"
      },
      {
        "_id":"confirm1",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":true,
        "bandFor":"test"
      },
      {
        "_id":"confirm2",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":true,
        "bandFor":"test"
      },
      {
        "_id":"confirm3",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":true,
        "bandFor":"test"
      },
      {
        "_id":"confirm4",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":true,
        "bandFor":"test"
      },
      {
        "_id":"confirm5",
        "name":"green HAZE room",
        "address":"N27 W5230 Hamilton rd.",
        "description":"wow ew we really need a band to fill this crazy gig out wahoo jazz it up homies bless up kendrick lamar is awesome",
        "price":"84",
        "picture": "../static/assets/Home/Art/11.jpeg",
        "startDate":"2019-01-26T14:22",
        "endDate":"",
        "applications":["test","test","test","test","test"],
        "lat":"0","lng":"0",
        "categories":{
          "genres":["bass","punk"],
          "insts":["bass guitar","bass","guitar"],
          "vibes":["bass","","","dumb"]
        },
        "isFilled":true,
        "confirmed":true,
        "bandFor":"test"
      }
    ]
  };

  globalMessageArray = user.messages;

  // messages[user._id] // gives array of messages, with body; timestamp; reciever;
  createContacts(user.contacts, user.name);

  createWebPage(user);


}

var globalMessageArray = null;

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

        // if(document.getElementById("select-gig-to-ad").style.visibility == "visible"){
        //       document.getElementById("select-gig-to-ad").style.visibility = "hidden"
        //    }
        // else if(document.getElementById("select-gig-to-ad").style.visibility == "hidden"){
        //     document.getElementById("select-gig-to-ad").style.visibility = "visible"
        //  }

        if(box) {
            document.getElementById("select-gig-to-ad").style.visibility = "hidden";
            box.chatbox("option", "boxManager").toggleBox();
            $(".ui-widget").remove();
            box = null;
            var newDiv = document.createElement("div");
            newDiv.id = "chat-div";
            document.body.append(newDiv);
        }
        else {
            document.getElementById("select-gig-to-ad").style.visibility = "visible";
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
              document.getElementById("select-gig-to-ad").style.visibility = "hidden";
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



// $(document).ready(function(){
//           var box = null;
//           console.log("document ready");
//           $("#chat-a").click(function(event, ui) {
//               if(box) {
//                   box.chatbox("option", "boxManager").toggleBox();
//               }
//               else {
//                   box = $("#chat-div").chatbox({id:"chat_div",
//                                                 user:{key : "value"},
//                                                 title : "test chat",
//                                                 messageSent : function(id, user, msg) {
//                                                     // $("#log").append(id + " said: " + msg + "<br/>");
//                                                     $("#chat-div").chatbox("option", "boxManager").addMsg(id, msg);
//                                                 }});
//               }
//           });
// });


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
  }
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

//changeGigSection

//MESSAGING SECTION:

var socket = io();
function sendMessage(body, recID){
  console.log("MESSAGE BODY: "+body);
  console.log("MESSAGE RECID: "+recID);
  //set body to text from box and rec id to the inteded reciver's user ID
  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  //
  // var myMessage = {
  //   'senderID':id,
  //   'recieverID': recID,
  //   'body': body,
  //   'timeStamp' : dateTime
  // };
  // $.post('/messages', {'senderID':id, 'recieverID':recID, 'body':body, 'timeStamp':dateTime}, result=>{
  //   console.log("got result from positn message it is :" + JSON.stringify(result));
  // });
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

function populateDropDown(myGigs){
 console.log("GIGS: "+JSON.stringify(myGigs));
 console.log(" ");

 var selectMenu = document.getElementById("selectDrop");
//  var userDropTitle = document.createElement("<option value=“"+myUser._id+"“>"+myUser.username+"</option>");
let selectedGig = null
 for (gig in myGigs){
   var gigTitle=document.createElement("option");
   gigTitle.innerHTML=myGigs[gig].name;
   gigTitle.setAttribute("value","gig");
   gigTitle.dataID = myGigs[gig]._id;
   gigTitle.setAttribute("id", "gig"+gig+"DropTitle");
   selectMenu.appendChild(gigTitle);
 }

 // document.getElementById("link-applicaiton-button").addEventListener("click", function(){
 //   // console.log(selectedGig.data-objID);
 //   alert("fuck shit")
 // })
}

function submitGig(){
  var theSelector = document.getElementById("selectDrop");
  var id = theSelector.options[ theSelector.selectedIndex ].dataID;
  alert(id);
}


// function to create file from base64 encoded string
