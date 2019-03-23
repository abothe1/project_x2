var box = null;
var mainContent = null;
var profilesList = null;
var globalMessageArray = null;


function init(){

  var mainContent = document.getElementById("main-content-wrapper");

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
        "bandFor":"test"
      }
    ]
  };

  globalMessageArray = user.messages;

  // messages[user._id] // gives array of messages, with body; timestamp; reciever;
  createContacts(user.contacts, user.name);
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
function createWebPage(user){
  console.log(JSON.stringify(user));
  // get the stars
  var star1 = "user-star-1";
  var star2 = "user-star-2";
  var star3 = "user-star-3";
  var star4 = "user-star-4";
  var star5 = "user-star-5";
  var stars = [star1,star2,star3,star4,star5];
  // update the html for profile stars
  loadStars(user.rating, stars);
}

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
        if(box) {
            box.chatbox("option", "boxManager").toggleBox();
            $(".ui-widget").remove();
            box = null;
            var newDiv = document.createElement("div");
            newDiv.id = "chat-div";
            document.body.append(newDiv);
        }
        else {
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
