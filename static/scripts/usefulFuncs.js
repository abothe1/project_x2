function addRating(id, newRating){
  $.post('/bandRating', {'id':id, 'newRating':newRating}, result=>{
    console.log("New Rating posted here is result: " + JSON.stringify(result));
  });
}
