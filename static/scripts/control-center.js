// helpful snippet for later
// jQuery('<div/>', {
//     id: 'some-id',
//     class: 'some-class',
//     title: 'now this div has a title!'
// }).appendTo('#mySelector');

function init(){
  var e = "data";
  buildCarouselUpcoming(e);
  buildCarouselUpcoming(e);
  buildCarouselUpcoming(e);
  buildCarouselUpcoming(e);

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
  while(i > 0){
    var $newItem = $("<li class='carousel-li'></li>");
    var $newImg = $("<img class='carousel-img' src='../static/assets/Home/Art/3.jpeg' alt='Image 3'>");
    $newItem.append($newImg);
    $list.append($newItem);
    i--;
  }
  var $prev = $("<a href='#' class='jcarousel-control-prev'>&lsaquo;</a>")
  var $next = $("<a href='#' class='jcarousel-control-next'>&rsaquo;</a>")
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
