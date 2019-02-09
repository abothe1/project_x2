/*************************************************************************
 *
 * BANDA CONFIDENTIAL
 * __________________
 *
 *  Copyright (C) 2019
 *  Banda Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Banda Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Banda Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Banda Incorporated.
 *
*************************************************************************/
  var genreBank=["blues","classic rock","country","dance","disco","funk","grunge",
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
   "duet","punk rock","drum solo","acapella","euro-house","dance hall","edm","grime","dubstep","drum and bass","drum&bass","cover","covers"];

  var instBank=["accordion","bagpipes","banjo","bass guitar","bass","bassoon","berimbau","dj","d.j.","singer","rapper","mc","bongo","freestyler","cello",
   "clarinet","cornet","cymbal","didgeridoo","double bass","upright","drum kit","drums","percussion","flute","french horn","glass harmonica","gong",
   "guitar","acoustic","electronic","harmonica","harp","harpsichord","hammered dulcimer","synth","tambourine","hurdy gurdy","jew’s harp",
   "lute","lyre","mandolin","marimba","melodica","oboe","ocarina","octobass","organ","sound system","pan pipes","piano","piccolo","recorder","saxophone",
   "sitar","synthesizer","timpani","triangle","trombone","trumpet","theremin","tuba","poet","vocals","viola","violin","whamola","xylophone","zither"];

  var gigTypeBank=["birthday","party","fraternity","frat","bar","concert","corporate","kids","adult","adults","highschool","college","retirement","sorority",
   "gay","pride","festival","radio","hall","dance","bachelor","bachelorette","show","talent","chill","kickback","hangout","mobile","car","house","home","parade",
   "street","theater","exhibition","show","event","wedding","funeral","burial","eccentric","church","synagouge","mosque","temple","circle","meditation","studio session",
   "performance","rally","march","protest","ceremony","holiday","christmas","new years","halloween","valentines","bash","mosh","orgy","date","night out","night in",
   "night-in","service","store","opening","closing","buisness","booth","meeting","introduction","orientation","graduation"];

  var vibeBank=["anthem","aria","ariose","arioso","assonance","atmospheric","background","banging","banger","bangers","baroque","beat","bell-like","bombastic",
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
   "sonorous","soothing","sophisticated","symphonious","symphony","tubular","tumid","tuned","tuneful","unison","up-tempo","unified","uplifting","","",
   "sweet","throbbing","tight","timeless","tonal","atonal","treble","warble","wobble","wavey","warm","wet","dry","wild","woodnote","western",
   "upbeat","vibrant","vocal","high-volume","low-volume","loud","soft","hard","hardcore","west-coast","east-coast","chopper","vibes",
   "angry","melancholy","blue","new","old","young","difuse","nasty","raunchy","ridiculous","real","dumb"
   ,"evil","godly","zealous","functional","stupid","purple","green","gnarly","fun","forceful","fucking","fuck","fucked up","crazy","sloppy","disgusting"];
  //this is so i can commit;
  var genreMult=1;
  var ratingMult=1;
  var instMult=1;
  var distMult=1;
  var typeMult=1;
  var priceMult=1;
  var vibeMult=1;
  var timeMult=1;
  var timeEqualizer=1000;
  var priceEQ=10;
  var minQueryMatches=3;
module.exports = {
  findGigsForBand : function findGigsForBand(myBandName, queryStr, db, errCb, cbOk){
    console.log("on algs ppage searching for bands and band naem is : " + myBandName);
     db.db('bands').collection('bands').findOne({name:myBandName}, function(err, result){
      if (err){
        console.log("there was an error getting " + myBandName + " out of the db " + err);
        errCB(err);
      }
      else{
        var myBand = result;
        console.log("In algs page and the band for searching for gigs is: " + JSON.stringify(myBand));
        console.log("The my badn find one method in algs returned: " + myBand);


         db.db('gigs').collection('gigs').find({}).toArray(function (err,result){
          if (err){
            console.log("There was error getting gigs from db:" + err);
            errCb(err);
          }
          else{
            console.log("result in find gigs for band connecting ot db and geting the gigs was: " + JSON.stringify(result));
            var gigs=result;
            var genresFromStr=[];
            var instsFromStr=[];
            var gigTypesFromStr=[];
            var vibesFromStr=[];
            var gigsToScore=[];
            var queryGigsToScore=[];
            var bandsToScore=[];
            var queryBandsToScore=[];
            var categories={"genres":[genreBank,genresFromStr,genreMult], "insts":[instBank,instsFromStr,instMult],"vibes":[vibeBank,vibesFromStr,vibeMult],"gigTypes":[gigTypeBank,gigTypesFromStr,typeMult]};
            console.log("")
            var categories = parseQueryString(queryStr, categories);



            for (g in gigs){
              var queryStrScore = 0;
              var theGig = gigs[g];
              var numMatches = 0;
              if (theGig.categories==null){
                console.log(" ");
                console.log("categories for the gig "+ JSON.stringify(theGig.name) + "is null in that if thing");
              }
              else{
                for (var key in categories){
                  console.log("in fiding gigs for band and in cat loop and key is : " + key);
                  if (categories.hasOwnProperty(key)){
                    if (theGig.categories.hasOwnProperty(key)){
                      var contents = categories[key];
                      console.log("in fiding gigs for band and in if if and contents is : " + contents);
                      var fromStr=contents[1];
                      var mult=contents[2];
                      for (var word in fromStr){
                        console.log("In for word loop and word is : " + fromStr[word]);
                        if (theGig.categories[key].includes(fromStr[word])){
                          console.log("got in if");
                          queryStrScore+=(1*mult);
                          numMatches+=1;
                        }
                      }
                    }
                  }
                }
              }

                console.log(" ");
                console.log("query score is : " + queryStrScore);
                var priceDiff=Math.abs((theGig.price-myBand.price));
                var priceScore= (-(priceDiff/priceEQ)*priceMult);
                console.log("pirce score is : " + priceScore);
                var diffX=Math.pow((theGig.lat-myBand.lat),2);
                var diffY=Math.pow((theGig.lng-myBand.lng),2);
                var distance = Math.pow((diffX+diffY),0.5);
                var distScore = -(distance*distMult);
                console.log("dist score is : " + distScore);
                var dateDiffs=[];
                for (date in myBand.openDates){
                  var timeDiff=diff_minutes(myBand.openDates[0],theGig.startDate);
                  dateDiffs.push(timeDiff);
                }
                var minDiff = dateDiffs[0];
                for (diff in dateDiffs){
                  if (diff < minDiff) {
                    minDiff = diff;
                  }
                }

                var timeDiff = minDiff / timeEqualizer;
                var timeScore= -timeDiff*timeMult;
                console.log("time score is : " + timeScore);


                var score = timeScore+distScore+priceScore+queryStrScore;
                console.log(" ");
                console.log("in gigs for band and score of gig : " + JSON.stringify(theGig) + "is :" + score);
                if (numMatches>minQueryMatches){
                  queryGigsToScore.push([theGig, numMatches]);
                }
                else{
                  gigsToScore.push([theGig,score]);
                }
              }
              var sortedGigs = {"overallMatchers":sortDict(gigsToScore), "queryMatchers":sortDict(queryGigsToScore)};
              console.log("sorted gigs on alg page is : " + JSON.stringify(sortedGigs));
              db.close();
              cbOk(sortedGigs);
          }
        });
      }
    });
  },

 findBandsForGig : function findBandsForGig(myGigName, queryStr, db, errCb, okCb) {
   console.log("got in find bands fro gig on alg page");
   console.log("querystr is :" + queryStr);
   console.log("gig searching for bands name is" + myGigName);
    var myGig = db.db('gigs').collection('gigs').findOne({'name':myGigName}, function(err, result){
      if (err){
        console.log("there was an error finding the gig " + myGigName + "the err was: " + err);
        errCB(err);
      }
      else{
        var myGig = result;
        console.log("The my gig find one method in algs returned: " + JSON.stringify(myGig));
         db.db('bands').collection('bands').find({}).toArray(function(err,result){
          if (err){
            console.log("There was error getting gigs from db:" + err);
            errCb(err);
          }
          else{
            console.log("in else for getting all gigs on alg page and the array was " + JSON.stringify(result));

            var bands = result;
            var categories = parseQueryString(queryStr,categories);
            var bandsToScore=[];
            var queryBandsToScore=[];
            for (b in bands){
              var queryStrScore=0;
              var theBand = bands[b];
              var numMatches=0;
              for (key in categories){
                console.log("for key in cat and the key is: " + key);
                if (categories.hasOwnProperty(key)){
                  if (theGig.categories.hasOwnProperty(key)){
                    var contents = categories[key];
                    var fromStr=contents[1];
                    var mult=contents[2];
                    for (var word in fromStr){
                      if (theBand.categories[key].includes(fromStr[word])){
                        queryStrScore+=(1*mult);
                        numMatches+=1;
                      }
                    }
                  }
                }
              }
              if (myGig['price']==null){
                continue;
              }
              var priceDiff = Math.abs( (myGig.price-  theBand.price));
              console.log("price diff in find bands for gig is: " + priceDiff);
              var priceScore = (-(priceDiff/priceEQ) * priceMult);
              var dateDiffs = [];
              for (date in theBand.openDates){
                var timeDiff=diff_minutes(theBand.openDates[0],myGig.startDate);
                dateDiffs.push(timeDiff);
              }
              var minDiff = dateDiffs[0];
              for (diff in dateDiffs){
                if (diff < minDiff){
                  minDiff=diff;
                }
              }
              var timeDiff = (minDiff) / timeEqualizer;
              var timeScore = -timeDiff * timeMult;
              var ratingScore = theBand.rating*ratingMult;
              var score = timeScore+priceScore+queryStrScore+ratingScore;
              console.log("score in find bands for gig is : " + score);
              if (numMatches>minQueryMatches){
                queryBandsToScore.push(theBand,numMatches);
              }
              else{
                bandsToScore.push([theBand,score]);
              }

            }
            var sortedBands = {"overallMatchers":sortDict(bandsToScore),"queryMatchers":sortDict(queryBandsToScore)};
            console.log("sortedBands on alg page is " + JSON.stringify(sortedBands));
            db.close();
            okCb(sortedBands);
          }
        });
      }
    });

  }

}
  function parseQueryString(queryStr, categories){
    console.log(" ");
    console.log("in parse query str on alg page and str is: " + queryStr + "and categoires are " + JSON.stringify(categories));
    var lowerCased = queryStr.toLowerCase();

    //iterates through the categories and pushes tmatchign
    //words from the query string in the appropaite collection of words
    for (var key in categories){
      console.log("i for key loop and key is :" + key);
        if (categories.hasOwnProperty(key)){
            var contents = categories[key];
            console.log("i for key loop and contents is :" + JSON.stringify(contents));
            for (word in contents[0]){
              console.log("in for word loop and word is : " + contents[0][word]);
              if (queryStr.includes(contents[0][word])){
                contents[1].push(contents[0][word]);
              }
            }
            categories[key]=contents;
        }
    }
    console.log(" ");
    console.log("the thing parse is about to return is"+JSON.stringify(categories));
    return categories;
  }

  function diff_minutes(dt2Str, dt1Str) {
    var dt1 = new Date(dt1Str);
    var dt2 = new Date(dt2Str);
    console.log("in diff mins on alg page and dt2 is : " + dt2 + "and dt1 is : " + dt1);
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    console.log("diff is : " + diff);
    diff /= 60;
    console.log("diff is : " + diff);
    return Math.abs(Math.round(diff));
   }

  function sortDict(dict){
     dict.sort(function(first, second) {
       return second[1]-first[1];
     });
     return dict;
  }



//call this for a band searching for a gig, myBand is a json band and
  // gigs is an array of gig jsons and
  //query String is the string they typed in search bar (i handled parsing)
