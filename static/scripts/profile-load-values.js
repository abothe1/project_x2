
// Create wrapper divs & the <ul>
var wrapper, carouselWrapper, carousel = $('div');
wrapper.attr({
  class: 'wrapper'
});
carouselWrapper.attr({
  class: 'jcarousel-wrapper',
});
carousel.attr({
  class: 'jcarousel'
});
var list = $('ul')

carousel.appendChild(list);
carouselWrapper.appendChild(carousel);
wrapper.appendChild(carouselWrapper);

// fill the <ul>
i = 6;  // number of things to add
while(i > 0){
  var newItem = $('li');
  var newImg = $('img');
  newImg.attr({
    src: '../static/assets/Home/Art/3.jpeg'
  });
  newItem.appendChild(newImg);
  carousel.appendChild(newItem);
  i--;
}
$("#contacts-sidebar").after(wrapper);
