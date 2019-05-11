var jsonObject = {
    "_id": "abx9998slkjshcoo",
    "name": "The Green Haze Studio",
    "creator":"xxx",
    "description":"We are a hip studio!",
    "lat":"38.6562899",
    "lng":"-90.3015669",
    "address":"6200 Enright Ave.",
    "zip":"63130",
    "engineers":["bob x","sally r", "rick s"],
    "rooms":[
      {
        "name":"Small Room",
        "description":"a smaller room, but we think it's cool",
        "price":"80",
        "equipment":["keyboard","mixing","speakers","headphones","microphones"],
        "engineers":["bob x"]
      },
      {
        "name":"Big Room",
        "description":"a bigger room, and it comes with drums!",
        "price":"80",
        "equipment":["keyboard","mixing","speakers","headphones", "microphones","drums"],
        "engineers":["sally r","rick s"]
      }
    ],
    "slots":[
      {
        "date": "05-09-2019",
        "start": "10:00",
        "end": "14:00",
        "roomName":"Big Room",
        "isFilled":"false",
        "bandFor":"",
        "isConfirmed":"false",
        "confirmationCode":"x8938108uklj"
      },
      {
        "date": "05-09-2019",
        "start": "10:00",
        "end": "14:00",
        "roomName":"Small Room",
        "isFilled":"false",
        "bandFor":"",
        "isConfirmed":"false",
        "confirmationCode":"lskdajflkdsjf9"
      },
      {
        "date": "05-10-2019",
        "start": "10:00",
        "end": "14:00",
        "roomName":"Big Room",
        "isFilled":"false",
        "bandFor":"",
        "isConfirmed":"false",
        "confirmationCode":"asdfjal1803"
      },
      {
        "date": "05-10-2019",
        "start": "10:00",
        "end": "14:00",
        "roomName":"Big Room",
        "isFilled":"false",
        "bandFor":"",
        "isConfirmed":"false",
        "confirmationCode":"asdfjal1803"
      },
      {
        "date": "05-10-2019",
        "start": "9:00",
        "end": "14:00",
        "roomName":"Big Room",
        "isFilled":"false",
        "bandFor":"",
        "isConfirmed":"false",
        "confirmationCode":"asdfjal1803"
      }
    ]
  }

var searchObject;

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
  searchObject = urlJSON['searchObject'];
  console.log('Search obj is: ' + JSON.stringify(searchObject));
  getUserInfo(searchObject);
}

function getUserInfo(obj){
  if(searchObject['mode']=='owner'){
    var studioID = searchObject['id'];
    $.get('/aStudio', {'id':studioID}, res2=>{
      jsonObject=res2;
      buildWebPage();
    });
  }
}

function buildWebPage(){
  var img = document.getElementById("inside-image");
  var description = document.getElementById("studio-description");
  var title = document.getElementById("studio-name-header");

  title.innerHTML = jsonObject.name;
  description.innerHTML = jsonObject.description;
  img.src = jsonObject.picture;
}

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
// selectYear = document.getElementById("year");
// selectMonth = document.getElementById("month");

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

monthAndYear = document.getElementById("MonthAndYear");
showCalendar(currentMonth, currentYear);
function showCalendar(month, year){
    var allStudioDates = [];
    for(var i = 0; i < jsonObject.slots.length; i ++){
        allStudioDates.push(jsonObject.slots[i].date);
    }
    console.log(allStudioDates);
    // var test = jsonObject.slots[0].date.split("-");
    // console.log(parseInt(test[0]));

    let firstDay = (new Date(year, month)).getDay();

    var calendar_body = document.getElementById('calendar_body');

    calendar_body.innerHTML = "";
    // monthAndYear.innerHTML = months[month] + " " + year;
    // selectYear.value = year;
    // selectMonth.value = month;
    let date = 1;
    monthAndYear.innerHTML = months[month] + " " + year;
    for(var i = 0;i <6; i ++){
        let row = document.createElement('tr');
        row.id = "calendar_row";

        for(var j = 0; j < 7; j ++){
            if(i === 0 && j < firstDay){
                cell = document.createElement('td');

                cell.setAttribute('id', 'calendar_item');
                cell_data = document.createTextNode("");
                cell.appendChild(cell_data);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            else {
                cell = document.createElement('td');
                cell.setAttribute('id', 'calendar_item');

                cellDiv = document.createElement('div');
                cellDiv.id= "cell_div"
                cellDiv.className = ""
                cell_data = document.createTextNode(date);

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.style.backgroundColor = '#aacbff';
                }

                cell.appendChild(cell_data);
                cell.appendChild(cellDiv);
                for(var k = 0; k < allStudioDates.length; k ++){
                    var eventDates = allStudioDates[k].split("-");
                    var eventMonth = parseInt(eventDates[0])-1;
                    var eventDay = parseInt(eventDates[1]);
                    var eventYear = parseInt(eventDates[2]);
                    // console.log("eventDay", eventDay);
                    // console.log("date", date);
                    // console.log("eventYear", eventYear);
                    // console.log("year", year);
                    // console.log("eventMonth", eventMonth);
                    // console.log("month", month+1);
                    if(eventMonth === month && eventYear === year && eventDay === date)
                    {
                        var event_div = document.createElement('div');

                        event_div.className = 'event_div';
                        event_div.id = jsonObject.slots[k].confirmationCode;

                        var room_name_p = document.createElement('label');
                        // room_name_p.className = "btn btn-outline-primary btn-sm";
                        // room_name_p.id = jsonObject.slots[k].confirmationCode;
                        // var room = document.createTextNode(jsonObject.slots[k].roomName);
                        // room_name_p.appendChild(room);
                        // room_name_p.type = "submit";
                        room_name_p.innerHTML = jsonObject.slots[k].roomName;
                        event_div.setAttribute('data-toggle', 'modal');
                        event_div.setAttribute('data-target', '#exampleModal');

                        room_name_p.id = jsonObject.slots[k].confirmationCode;


                        var room_time_p = document.createElement('p');
                        room_time_p.className = "room_time_p";
                        room_time_p.id = jsonObject.slots[k].confirmationCode;
                        var room_time = document.createTextNode(jsonObject.slots[k].start);
                        room_time_p.appendChild(room_time);
                        event_div.appendChild(room_time_p);
                        event_div.appendChild(room_name_p);

                        cellDiv.appendChild(event_div);
                        event_div.addEventListener('click', viewRoom, false);
                    }
                }



                row.appendChild(cell);
                date++;
            }
        }
        calendar_body.appendChild(row);
    }
}

function viewRoom(e){
  console.log(e.target);
  var title = document.getElementById('exampleModalLabel');
  console.log(e.target.querySelector('label'));
  var modalBody = document.getElementById('modal-body-id');
  var timeStart = document.createElement('p');
  var description_p = document.createElement('p');
  var room_name = "";
  for( var i = 0 ; i < jsonObject.slots.length; i ++){

    if(jsonObject.slots[i].confirmationCode === e.target.id){
      room_name = jsonObject.slots[i].roomName;
      title.innerHTML = jsonObject.slots[i].roomName;
      modalBody.innerHTML = jsonObject.slots[i].date;
      timeStart.innerHTML = jsonObject.slots[i].start;
      modalBody.appendChild(timeStart);
    }
  }
  for(var j = 0; j < jsonObject.rooms.length; j ++){
    if(jsonObject.rooms[j].name === room_name){
      description_p.innerHTML = jsonObject.rooms[j].description;
      modalBody.appendChild(description_p);
    }
  }

}
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function viewSchedule(){
  var calendar =  document.getElementById('calendar_wrapper');
   if(calendar.style.display !== "block"){
    calendar.style.display = "block";
   }
   else{
    calendar.style.display = "none";
   }
}
