const database = require('../database.js');
function findGigsForBand(myBand) {
	database.connect(db => {
		let gigs = db.db('gigs').collection('gigs');
		gigs.find({ })
	});
}
findGigsForBand(1);
// var genreMult=1;
// var ratingMult=1;
// var instMult=1;
// var distMult=1;
// var typeMult=1;
// var priceMult=1;
// var vibeMult=1;
// var timeMult=1;
// var timeEqualizer=1000;
// var priceEQ=10;

/*
//call this for a band searching for a gig, myBand is a json band and
// gigs is an array of gig jsons and
//query String is the string they typed in search bar (i handled parsing)
function findGigsForBand(myBand, queryStr, db){
//  var sortedGigs=[];
	return db.db('gigs').collection('gigs').find({}).toArray(function(err,result){
		if (err){
			console.log("There was error getting gigs from db:" + err);
			return [];
		}
		else{
			var gigs=result;
			var genresFromStr=[];
			var instsFromStr=[];
			var gigTypesFromStr=[];
			var vibesFromStr=[];
			var gigsToScore=[];
			var bandsToScore=[];
			var categories={"genres":[genreBank,genresFromStr,genreMult], "insts":[instsBank,instsFromStr,instMult],"vibes":[vibesBank,vibesFromStr,vibeMult],"gigTypes":gigTypeBank,gigTypesFromStr,typeMult]};

			var categories = parseQueryString(queryStr, categories);
			var queryStrScore = 0;


			for (theGig in gigs){
				for (key in categories){
					if categories.hasOwnProperty(key){
						if (theGig.hasOwnProperty(key)){
							var contents = categories[key];
							var fromStr=contents[1];
							var mult=contents[2];
							for (word in fromStr){
								if (theGig[key].includes(word)){
									queryStrScore+=(1*mult);
								}
							}
						}
					}
				}

					var priceDiff=Math.abs((theGig.price-myBand.price));
					var priceScore= (-(priceDiff/priceEQ)*priceMult);
					var diffX=Math.pow((theGig.lat-myBand.lat),2);
					var diffY=Math.pow((theGig.lng-myBand.lng),2);
					var distance = Math.pow((diffX+diffY),0.5);
					var distScore = -(distance*distMult);
					var dateDiffs=[];
					for (date in myBand.openDates){
						var timeDiff=diff_minutes(myBand.openDates[0],myGig.startDate);
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
					var score = timeScore+distScore+priceScore+queryStrScore;

					gigsToScore.push([theGig,score]);
				}
				var sortedGigs=sortDict(gigsToScore);
				db.close();
				return sortedGigs;
		}
	});
}

function findBandsForGig(myGig, categories, db){
	return db.db('bands').collection('bands').find({}).toArray(function(err,result){
		if (err){
			console.log("There was error getting gigs from db:" + err);
			return [];
		}
		else{
			var bands = result;
			var categories = parseQueryString(queryStr,categories);
			for (theBand in bands){
				for (key in categories){
					if categories.hasOwnProperty(key){
						if theGig.hasOwnProperty(key){
							var contents = categories[key];
							var fromStr=contents[1];
							var mult=contents[2];
							for (word in fromStr){
								if (theBand[key].includes(word)){
									queryStrScore+=(1*mult);
								}
							}
						}
					}
				}
				var priceDiff = Math.abs( (myGig.price-  theBand.price) );
				var priceScore = (-(priceDiff/priceEQ) * priceMult);
				var dateDiffs = [];
				for (date in theBand.openDates){
					var timeDiff=diff_minutes(myBand.openDates[0],myGig.startDate);
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
				bandsToScore.push([theBand,score]);
			}
			var sortedBands=sortDict(bandsToScore);
			return sortedBands;
		}
	});
}

function parseQueryString(queryStr, categories){
	var lowerCased = queryStr.toLowerCased();
	//iterates through the categories and pushes tmatchign
	//words from the query string in the appropaite collection of words
	for (var key in categories){
			if (categories.hasOwnProperty(key)){
					var contents = categories[key];
					for (word in contents[0]){
						if (queryStr.includes(word)){
							contents[1].push(word);
						}
					}
					categories[key]=contents;
			}
	}
	return categories;
}

function diff_minutes(dt2, dt1) {
	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= 60;
	return Math.abs(Math.round(diff));
 }

function sortDict(dict){
	 dict.sort(function(first, second) {
		 return second[1]-first[1];
	 });
	 return dict;
 }
*/