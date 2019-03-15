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

  // $('.carousel-img').hover(
  //   //Handler In
  //   function(){
  //     console.log("enter-img");
  //   },
  //   //Handler Out
  //   function(){
  //     console.log("exit-img");
  //   }
  // );
  //
  // $('.carousel-li').hover(
  //   //Handler In
  //   function(){
  //     console.log("enter-li");
  //   },
  //   //Handler Out
  //   function(){
  //     console.log("exit-li");
  //   }
  // );
}
