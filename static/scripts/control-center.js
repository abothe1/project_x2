function init(){

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

$.post(`users/${username}/bands`, { name: '...', ... }, res => {
  if (res.success) {
    // ...
  } else {
    alert("Cant post band: " + res.cause)
    // ...
  }
})

$.get(`/users/${username}/bands`, {}, res => {
  res.bands.forEach(band => {
    $("#bands").add_ele()
  })
  // ...
});
