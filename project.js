jQuery.ajaxSettings.traditional = true; 

var artists = [];
var apiKey = "LACTVEY2CJCONHOPC";
var id;
var spotifyId;
var artist;
var getArtistList = false;
var getGenreList = false;
var artistList = "";

$(document).ready(function(){$( "#search" ).click(
		function search() {
			/*Retrieve input values from User*/
			var name = $( "#term" ).val();
			var location = $("#place").val();
			var year = $("#year").val();
			var genre = $("#genre").val();
			var mood = $("#mood").val();
			
			/*Check for special characters in name */
			if(name.includes("&") == true){
				name = name.replace(" & "," ");
			}else if(name.includes("/") == true){
				name = name.replace("/"," ");
			}else if(name.includes("\xE8")== true){
				name = name.replace("\xE8","e");
			}else if(name.includes("\xEB")== true){
				name = name.replace("\xEB","e");
			}
			
			/*Clear the html page except for the search boxes*/
			$('#music').empty();
			$('#event_title').empty();
			$('#event_container').empty();
			$('#profile_title').empty();
			$('#profile_container').empty();
			document.getElementById("profile").style.display = "none";
			document.getElementById("events").style.display = "none";
			
			/*Create year string to concatenate onto searches*/
			var year1 = $("#year1").val();
			var year2 = $("#year2").val();
			var startYear = "&artist_start_year_after=";
			var endYear = "&artist_end_year_before=";
			var yearStr = "";
			if(year1 != "" && year2 != ""){
				startYear = startYear.concat(year1);
				endYear = endYear.concat(year2);
				yearStr = yearStr.concat(startYear);
				yearStr = yearStr.concat(endYear);
			}else if(year1 != "" && year2 == ""){
				startYear = startYear.concat(year1);
				yearStr = yearStr.concat(startYear);
			}else if(year1 == "" && year2 != ""){
				endYear = endYear.concat(year2);
				yearStr = yearStr.concat(endYear);
			}else{
				yearStr = "";
			}
			
			/*Check if user input an artist name*/
			if(name != ""){
				getArtistInfo(name);
			}else{
					document.getElementById("events").style.width = "60%";
					/*Check if there are no inputs*/
					if(name =="" && location == "" && genre == "" && mood == "" && year1 == "" && year2 ==""){
						console.log("No parameters given");
						getRandomArtist();
					}else{
						if(genre != "" && mood == ""){
							getArtistsofGenre(yearStr);
						}else if(genre != "" && mood != ""){
							getGenreAndMood(yearStr);
						}else if(genre =="" && mood != ""){
							getArtistsofMood(yearStr);
						}else{
							getListHotArtists(yearStr);
					}}}
		});
})

function getArtistShows(name){
	/*Clear the Event Section, retrieve location input and check if name has special characters*/
	$('#event_title').empty();
	$('#event_container').empty();
	
	var location = $("#place").val();
	/*Checks if the artist name has any special characters*/
	if(name.includes("&") == true){
		name = name.replace(" & "," ");
	}else if(name.includes("/") == true){
		name = name.replace("/"," ");
	}else if(name.includes("\xE8")== true){
		name = name.replace("\xE8","e");
	}else if(name.includes("\xEB")== true){
		name = name.replace("\xEB","e");
	}

	/*Call Bandsintown API */
	$.ajax({
		url: "https://api.bandsintown.com/artists/" + name + "/events.json?app_id=dangimdz",dataType: 'jsonp',success: function(result){
			/*console.log(result);*/
			var table = document.createElement('table');
			
			/*If nothing is returned from the API call*/
			if(result[0] == undefined){
				console.log("No events for artist");
				document.getElementById('event_container').innerHTML = name+" does not have any upcoming tour dates.";
				document.getElementById("events").style.display = "block";
			}
			else{
				/*Location given*/
				if(location != ""){
					/*Append all the information from the API response into a table */
					/*Build Table for Upcoming Shows*/
					
					$('#event_title').append("Upcoming events for " + result[0].artists[0].name + " in " + location);
					name = result[0].artists[0].name;
					var count = 0;
					for (var j = 0; j < result.length; j++){
						if(result[j].venue.city == location.substr(0,location.length-3)){
							var tr = document.createElement('tr');   

							var td1 = document.createElement('td');
							var td2 = document.createElement('td');
							var td3 = document.createElement('td');
							var td4 = document.createElement('td');
							var td5 = document.createElement('td');
										
							if(count == 0){
								var text1 = document.createTextNode('Event Name');
								var text2 = document.createTextNode('City');
								var text3 = document.createTextNode('State');
								var text4 = document.createTextNode('Country');
								var text5 = document.createTextNode('Date');
											
								td1.appendChild(text1);
								td2.appendChild(text2);
								td3.appendChild(text3);
								td4.appendChild(text4);
								td5.appendChild(text5);
								tr.appendChild(td1);
								tr.appendChild(td2);
								tr.appendChild(td3);
								tr.appendChild(td4);
								tr.appendChild(td5);

								table.appendChild(tr);
								count = 1;
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var td2 = document.createElement('td');
							var td3 = document.createElement('td');
							var td4 = document.createElement('td');
							var td5 = document.createElement('td');
							var text1 = document.createTextNode(result[j].venue.name);
							var text2 = document.createTextNode(result[j].venue.city);
							var text3 = document.createTextNode(result[j].venue.region);
							var text4 = document.createTextNode(result[j].venue.country);
							var text5 = document.createTextNode(result[j].datetime.substr(0,10));

							td1.appendChild(text1);
							td2.appendChild(text2);
							td3.appendChild(text3);
							td4.appendChild(text4);
							td5.appendChild(text5);
							tr.appendChild(td1);
							tr.appendChild(td2);
							tr.appendChild(td3);
							tr.appendChild(td4);
							tr.appendChild(td5);

							table.appendChild(tr);	
						}
					}
					document.getElementById('event_container').appendChild(table);
					document.getElementById("events").style.display = "block";	
				}
				else{
					/*Location not given*/
					/*Append all the information from the API response into a table*/
					/*Build Table for Upcoming Shows*/
					
					$('#event_title').append("Upcoming events for " + result[0].artists[0].name);
					name = result[0].artists[0].name;			
					for (var j = 0; j < result.length; j++){
						var tr = document.createElement('tr');  
						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						var td3 = document.createElement('td');
						var td4 = document.createElement('td');
						var td5 = document.createElement('td');			
						if(j == 0){
							var text1 = document.createTextNode('Event Name');
							var text2 = document.createTextNode('City');
							var text3 = document.createTextNode('State');
							var text4 = document.createTextNode('Country');
							var text5 = document.createTextNode('Date');
										
							td1.appendChild(text1);
							td2.appendChild(text2);
							td3.appendChild(text3);
							td4.appendChild(text4);
							td5.appendChild(text5);
							tr.appendChild(td1);
							tr.appendChild(td2);
							tr.appendChild(td3);
							tr.appendChild(td4);
							tr.appendChild(td5);

							table.appendChild(tr);			
						}
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						var td3 = document.createElement('td');
						var td4 = document.createElement('td');
						var td5 = document.createElement('td');
						var text1 = document.createTextNode(result[j].venue.name);
						var text2 = document.createTextNode(result[j].venue.city);
						var text3 = document.createTextNode(result[j].venue.region);
						var text4 = document.createTextNode(result[j].venue.country);
						var text5 = document.createTextNode(result[j].datetime.substr(0,10));

						td1.appendChild(text1);
						td2.appendChild(text2);
						td3.appendChild(text3);
						td4.appendChild(text4);
						td5.appendChild(text5);
						tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						tr.appendChild(td4);
						tr.appendChild(td5);

						table.appendChild(tr);
					}
					document.getElementById('event_container').appendChild(table);
					document.getElementById("events").style.display = "block";
				}}}
	});
}

function getArtistInfo(artist){
	$('#profile_title').empty();
	$('#profile_container').empty();

	/*Check if artist name has any special characters*/
	if(artist.includes("&")== true){
		artist = artist.replace(" & "," ");
	}
	else if(artist.includes("/") == true){
		artist = artist.replace("/"," ");
	}
	else if(artist.includes("\xE8")== true){
		artist = artist.replace("\xE8","e");
	}
	else if(artist.includes("\xEB")== true){
		artist = artist.replace("\xEB","e");
	}
	
	/*Retrieving Echo Nest Artist ID*/
			$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key=" + apiKey + "&name="+artist,function(data){		
				/*console.log(data);*/
				if(data.response.artists.length != 0){
					/*artist = data.response.artists[0].name;*/
					id = data.response.artists[0].id;
					
					/*Pass artist name and id to get Upcoming Show Table and Artist songs*/
					getArtistShows(artist);
					getArtistPlaylist(artist,id);
				}
				else{
					document.getElementById('event_container').innerHTML = artist+" cannot be found.";
					document.getElementById("events").style.display = "block";
				}
			});
}

function getArtistPlaylist(artist,id){
	$('#music').empty();

	if(artist.includes("&")== true){
		artist = artist.replace(" & "," ");
	}
	else if(artist.includes("/") == true){
		artist = artist.replace("/"," ");
	}
	else if(artist.includes("\xE8")== true){
		artist = artist.replace("\xE8","e");
	}
	else if(artist.includes("\xEB")== true){
		artist = artist.replace("\xEB","e");
	}
	
	/*Get Artist's songs and the Spotify Id for those songs*/
	$.getJSON("https://developer.echonest.com/api/v4/playlist/static?api_key="+apiKey+"&artist="+artist+"&bucket=id:spotify&bucket=tracks&limit=true&format=json&results=15&type=artist",function(songs){
		/*console.log(songs);*/
		spotifyId = songs.response.songs[0].artist_foreign_ids[0].foreign_id;
		var length = spotifyId.length - 15;
		var newSpotifyId = spotifyId.substr(15,length);

		var title = "Artist radio for " + artist;
        var spotifyPlayButton = getSpotifyPlayButtonForPlaylist(title, songs.response.songs);
        $("#music").append(spotifyPlayButton);
		getArtistImage(id,newSpotifyId);
	});
}

function getArtistImage(id,spotifyId){
	var num = 0;
	var url = "";
	/*Get Artist's image url from Spotify*/
	$.getJSON("https://api.spotify.com/v1/artists/"+spotifyId,function(image){
		console.log(image);
		for(var i=0;i<image.images.length;i++){
			num++;
		}
		console.log(num);
		if(num != 0){
			url = image.images[num-2].url;
		}
		else{
			url = "";
		}
		getArtistProfile(url,id);
	});
}

function getArtistProfile(image_url,id){
	$('#profile_title').empty();
	$('#profile_container').empty();
	
	/*Get Artist Profile Information */
	$.getJSON("https://developer.echonest.com/api/v4/artist/profile?api_key=" + apiKey + "&id="+id+"&format=json&bucket=artist_location&bucket=genre&bucket=years_active&bucket=urls",function(profile){
		/*console.log(profile);*/

		/*URL Links for their Official Website, Twitter or Wikipedia*/
		var official = document.createTextNode("Official: "+ profile.response.artist.urls.official_url);
		var twitter = document.createTextNode("Twitter: "+ profile.response.artist.urls.twitter_url);
		var wiki = document.createTextNode("Wiki: "+ profile.response.artist.urls.wikipedia_url);

		/*Store the genres that the artist is categorized by into an array*/
		var genres = [];
		for(var i=0;i<profile.response.artist.genres.length;i++){
			genres.push(profile.response.artist.genres[i].name);
		}

		/*Append Artist image to Profile Table*/
		var img = document.createElement('img');
		img.src = image_url;
		var table = document.createElement('table');
		var tr = document.createElement('tr');   
		var td1 = document.createElement('td');	
		td1.appendChild(img);
		tr.appendChild(td1);
		table.appendChild(tr);
		
		/*Append Artist Name to Profile Table*/
		var name = document.createTextNode(profile.response.artist.name);
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');	
		td1.appendChild(name);
		tr.appendChild(td1);
		table.appendChild(tr);
		
		/*Append Artist Origin to Profile Table*/
		if(profile.response.artist.artist_location != undefined){
			var origin = document.createTextNode("From: " + profile.response.artist.artist_location.location);
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');	
			td1.appendChild(origin);
			tr.appendChild(td1);
			table.appendChild(tr);
		}
		
		/*Append Artist Start Year to Profile Table*/
		if(profile.response.artist.years_active.length != 0){
			var years = document.createTextNode("Started in: " +profile.response.artist.years_active[0].start);
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');	
			td1.appendChild(years);
			tr.appendChild(td1);
			table.appendChild(tr);
		}
		
		/*Append Artist URLs to Profile Table*/
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');	
		var td2 = document.createElement('td');	
		var td3 = document.createElement('td');
		
		/*Checks if the URLs exist*/
		if(profile.response.artist.urls.official_url != undefined){
			var link1  = document.createElement('a');
			link1.href = profile.response.artist.urls.official_url;
			link1.appendChild(official);
			td1.appendChild(link1);
			tr.appendChild(td1);
			table.appendChild(tr);
		}
		if(profile.response.artist.urls.twitter_url != undefined){
			var link2  = document.createElement('a');
			link2.href = profile.response.artist.urls.twitter_url;
			link2.appendChild(twitter);
			td2.appendChild(link2);
			var tr = document.createElement('tr');
			tr.appendChild(td2);
			table.appendChild(tr);
		}
		if(profile.response.artist.urls.wikipedia_url != undefined){
			var link3  = document.createElement('a');
			link3.href = profile.response.artist.urls.wikipedia_url;
			link3.appendChild(wiki);
			td3.appendChild(link3);
			var tr = document.createElement('tr');
			tr.appendChild(td3);
			table.appendChild(tr);
		}
		
		/*Append Artist Genres to Profile Table*/
		for(var j=0;j<genres.length;j++){
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');
			if(j == 0){
				var text1 = document.createTextNode('Artist Genres:');						
				td1.appendChild(text1);
				tr.appendChild(td1);
				table.appendChild(tr);	
			};
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');			
			var genre = document.createTextNode("		- " + genres[j]);
			td1.appendChild(genre);
			tr.appendChild(td1);
			table.appendChild(tr);
		}
		document.getElementById('profile_container').appendChild(table);
		document.getElementById("profile").style.display = "block";
	});	
}

function getLocationShows(artistList){
	$('#event_title').empty();
	$('#event_container').empty();
	
	var location = $("#place").val();
	
	/*Get all the shows of the list of artists within a 30 mile radius of the input location city*/
	$.ajax({
				url:"https://api.bandsintown.com/events/search?"+artistList+"location="+ location +"&format=json&radius=30&app_id=dangimdz",
				dataType: 'jsonp',
				success: function(city){
					
					/*console.log(city);*/
					/*Build a table and append the events into the table*/
					
					$('#event_title').append("Upcoming events");
					var table = document.createElement('table');
					for (var j = 0; j < city.length; j++){
						var tr = document.createElement('tr');   

						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						var td3 = document.createElement('td');
						var td4 = document.createElement('td');
						var td5 = document.createElement('td');
												
						if(j == 0){
							var text1 = document.createTextNode('Artist Name');
							var text2 = document.createTextNode('Venue Name');
							var text3 = document.createTextNode('City');
							var text4 = document.createTextNode('Country');
							var text5 = document.createTextNode('Date');
													
							td1.appendChild(text1);
							td2.appendChild(text2);
							td3.appendChild(text3);
							td4.appendChild(text4);
							td5.appendChild(text5);
							tr.appendChild(td1);
							tr.appendChild(td2);
							tr.appendChild(td3);
							tr.appendChild(td4);
							tr.appendChild(td5);

							table.appendChild(tr);
													
						}
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						var td3 = document.createElement('td');
						var td4 = document.createElement('td');
						var td5 = document.createElement('td');
						var text1 = document.createTextNode(city[j].artists[0].name);
						var text2 = document.createTextNode(city[j].venue.name);
						var text3 = document.createTextNode(city[j].venue.city);
						var text4 = document.createTextNode(city[j].venue.country);
						var text5 = document.createTextNode(city[j].datetime.substr(0,10));

						td1.appendChild(text1);
						td2.appendChild(text2);
						td3.appendChild(text3);
						td4.appendChild(text4);
						td5.appendChild(text5);
						tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						tr.appendChild(td4);
						tr.appendChild(td5);

						table.appendChild(tr);
												
					}
					document.getElementById('event_container').appendChild(table);
					document.getElementById("events").style.display = "block";
					
					/*Reset these variables*/
					var artistString = "";
					var artistList = "";
				}
			});
}

function getListHotArtists(yearStr){
	$('#profile_title').empty();
	$('#profile_container').empty();
	
	var artist1 = "artists[]=";
	var artistString;
	
	var location = $("#place").val();
	var table = document.createElement('table');
	
	/*Get the top 50 most familiar and popular artists*/
	$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key="+ apiKey +"&format=json&results=50&min_familiarity=0.70&min_hotttnesss=0.70"+yearStr,function(list){
		console.log(list);
		var artistList = "";
		
		/*Makes the artists name into one string to get the table of shows*/
		for(var i = 0;i<list.response.artists.length;i++){
			var artistName = list.response.artists[i].name;
			artistString = artist1.concat(artistName);
			artistString = artistString.concat("&");
			artistList = artistList.concat(artistString);	
			artists.push(artistName);
		}

		/*Create a table of the artists names*/
		for (var j = 0; j < artists.length; j++){
			var tr = document.createElement('tr');   
			var td1 = document.createElement('td');					
			if(j == 0){						
				$('#profile_title').append("Artist Name");
			}
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');
			var text1 = document.createTextNode(artists[j]);
			
			/*Make the artist table hyper links to their profile*/
			var link1  = document.createElement('a');
			link1.href = "#";
			link1.id = artists[j];
			link1.appendChild(text1);
			link1.onclick = function(){
				getArtistInfo(this.id);
			}
			td1.appendChild(link1);
			tr.appendChild(td1);
			table.appendChild(tr);

		}
		document.getElementById('profile_container').appendChild(table);
		document.getElementById("profile").style.display = "block";

		getLocationShows(artistList);
		getArtistList = true;
		artists = [];
	});
}

function getArtistsofGenre(yearStr){
	$('#profile_title').empty();
	$('#profile_container').empty();
	
	/*Replace spaces in the genre string*/
	var genre = $("#genre").val();
	genreStr = genre.replace(/ /g,"+");
	var genreTitle = genre.toLowerCase().split();
	/*Capitalize the first letter*/
	for(var k=0;k<genreTitle.length;k++){
		genreTitle[k] = genreTitle[k].charAt(0).toUpperCase() + genreTitle[k].substring(1);
	}
	
	var artist1 = "artists[]=";
	var artistString;
	artists = [];
	var valid = false;
	
	$.getJSON("https://developer.echonest.com/api/v4/artist/list_terms?api_key="+apiKey+"&format=json&type=style",function(styles){		
			console.log(styles);

			/*Checks if the input genre is within the system*/
			for(var n = 0; n <styles.response.terms.length;n++){
				if(genre == styles.response.terms[n].name){
					valid = true;
					break;
				}
			}
			
			if(valid == true){
				/*Gets the top 50 artists of the input genre*/
					$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key=LACTVEY2CJCONHOPC&format=json&sort=hotttnesss-desc&results=50&min_hotttnesss=0.6&style="+genreStr+yearStr,function(genreList){
						var artistList = "";

						/*Makes the artists name into one string to get the location of shows*/
						for(var i = 0;i<genreList.response.artists.length;i++){
							var artistName = genreList.response.artists[i].name;
							artistString = artist1.concat(artistName);
							artistString = artistString.concat("&");
							artistList = artistList.concat(artistString);
							artists.push(artistName);
						}
						
						/*Create a table of the artists names*/
						var table = document.createElement('table');
						for (var j = 0; j < artists.length; j++){
							var tr = document.createElement('tr');   
							var td1 = document.createElement('td');					
							if(j == 0){
								var text1 = document.createTextNode(genreTitle + ' Artists');						
								td1.appendChild(text1);
								tr.appendChild(td1);
								table.appendChild(tr);	
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var text1 = document.createTextNode(artists[j]);

							var link1  = document.createElement('a');
							link1.href = "#";
							link1.id = artists[j];
							link1.appendChild(text1);
							link1.onclick = function(){
								getArtistInfo(this.id);
							}
							td1.appendChild(link1);
							tr.appendChild(td1);
							table.appendChild(tr);
						}
						document.getElementById('profile_container').appendChild(table);
						document.getElementById("profile").style.display = "block";
						
						getLocationShows(artistList);
					});
			}
			/*If the input genre is not found, show 40 random available genres*/
			if(valid == false){
						var table = document.createElement('table');
						for (var j = 0; j < 40; j++){
							var tr = document.createElement('tr');   
							var td1 = document.createElement('td');	
							var num = Math.floor((Math.random()*styles.response.terms.length)+1);
							if(j == 0){
								var text1 = document.createTextNode('Sorry, that is not a valid genre. Here are some example valid genres:');
								td1.appendChild(text1);
								tr.appendChild(td1);
								table.appendChild(tr);	
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var text1 = document.createTextNode(styles.response.terms[num].name);

							td1.appendChild(text1);
							tr.appendChild(td1);
							table.appendChild(tr);
						}
						document.getElementById('profile_container').appendChild(table);
						document.getElementById("profile").style.display = "block";
			}
	});
}

function getArtistsofMood(yearStr){

	$('#profile_title').empty();
	$('#profile_container').empty();
	
	var mood = $("#mood").val();
	var moodTitle = mood.toLowerCase().split();
	for(var k=0;k<moodTitle.length;k++){
		moodTitle[k] = moodTitle[k].charAt(0).toUpperCase() + moodTitle[k].substring(1);
	}
	var moods = [];
	var artist1 = "artists[]=";
	var artistString;
	artists = [];
	var valid = false;
	
	
	$.getJSON("https://developer.echonest.com/api/v4/artist/list_terms?api_key="+apiKey+"&format=json&type=mood",function(moods){		
			console.log(moods);

			/*Check if the input mood is a valid mood in the Echo Nest API*/
			for(var n = 0; n <moods.response.terms.length;n++){
				if(mood == moods.response.terms[n].name){
					valid = true;
					break;
				}
			}

			if(valid == true){
				$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key=" + apiKey + "&format=json&results=50&min_hotttnesss=0.7&mood="+mood+yearStr,function(moodList){		
						console.log(moodList);
						var artistList = "";
						
						/*Create a string of artists to find the locations of their shows*/
						for(var i = 0;i<moodList.response.artists.length;i++){
							var artistName = moodList.response.artists[i].name;
							artistString = artist1.concat(artistName);
							artistString = artistString.concat("&");
							artistList = artistList.concat(artistString);
							artists.push(artistName);
						}
						
						var table = document.createElement('table');
						for (var j = 0; j < artists.length; j++){
							var tr = document.createElement('tr');   
							var td1 = document.createElement('td');					
							if(j == 0){
								var text1 = document.createTextNode(moodTitle + ' Artists');						
								td1.appendChild(text1);
								tr.appendChild(td1);
								table.appendChild(tr);	
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var text1 = document.createTextNode(artists[j]);

							/*Make the artists name a link to their profile*/
							var link1  = document.createElement('a');
							link1.href = "#";
							link1.id = artists[j];
							link1.appendChild(text1);
							link1.onclick = function(){
								getArtistInfo(this.id);
							}
							td1.appendChild(link1);
							tr.appendChild(td1);
							table.appendChild(tr);
						}
						document.getElementById('profile_container').appendChild(table);
						document.getElementById("profile").style.display = "block";
						
						getLocationShows(artistList);
				});
			}
			if(valid == false){
						/*If mood doesn't exist, display all the available moods*/
						var table = document.createElement('table');
						for (var j = 0; j < moods.response.terms.length; j++){
							var tr = document.createElement('tr');   
							var td1 = document.createElement('td');					
							if(j == 0){
								var text1 = document.createTextNode('Possible Moods');						
								td1.appendChild(text1);
								tr.appendChild(td1);
								table.appendChild(tr);	
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var text1 = document.createTextNode(moods.response.terms[j].name);

							td1.appendChild(text1);
							tr.appendChild(td1);
							table.appendChild(tr);
						}
						document.getElementById('profile_container').appendChild(table);
						document.getElementById("profile").style.display = "block";
			}
			
			
	});
}

function getGenreAndMood(yearStr){
	
	$('#profile_title').empty();
	$('#profile_container').empty();
	
	var genre = $("#genre").val();
	var mood = $("#mood").val();
	
	var artist1 = "artists[]=";
	var artistString;
	artists = [];
	var valid1 = false;
	var valid2 = false;
	
	genreStr = genre.replace(/ /g,"+");
	var genreTitle = genre.toLowerCase().split();
	for(var k=0;k<genreTitle.length;k++){
		genreTitle[k] = genreTitle[k].charAt(0).toUpperCase() + genreTitle[k].substring(1);
	};
	var moodTitle = mood.toLowerCase().split();
	for(var k=0;k<moodTitle.length;k++){
		moodTitle[k] = moodTitle[k].charAt(0).toUpperCase() + moodTitle[k].substring(1);
	};

	
	$.getJSON("https://developer.echonest.com/api/v4/artist/list_terms?api_key="+apiKey+"&format=json&type=style", function(styles){		
			/*Check if input genre is valid*/
			for(var m = 0; m <styles.response.terms.length;m++){
				if(genre == styles.response.terms[m].name){
					valid1 = true;
					break;
				}
			}	
			$.getJSON("https://developer.echonest.com/api/v4/artist/list_terms?api_key="+apiKey+"&format=json&type=mood", function(moods){	
			/*Check if input mood is valid*/
				for(var n = 0; n <moods.response.terms.length;n++){
					if(mood == moods.response.terms[n].name){
						valid2 = true;
						break;
					}
				}
				
				if(valid1 == true && valid2 == true){
					$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key="+apiKey+"&format=json&results=50&min_hotttnesss=0.7&mood="+mood+"&style="+genreStr+yearStr, function(data){	
						console.log(data);
						var artistList = "";
						
						/*Create String of Artists to Search for the table of their shows*/
						for(var i = 0;i<data.response.artists.length;i++){
							var artistName = data.response.artists[i].name;
							artistString = artist1.concat(artistName);
							artistString = artistString.concat("&");
							artistList = artistList.concat(artistString);
							artists.push(artistName);
						}
						
						/*Makes the artists name into one string to get the table of shows*/
						var table = document.createElement('table');
						for (var j = 0; j < artists.length; j++){
							var tr = document.createElement('tr');   
							var td1 = document.createElement('td');					
							if(j == 0){
								var text1 = document.createTextNode(' Artists');						
								td1.appendChild(text1);
								tr.appendChild(td1);
								table.appendChild(tr);	
							}
							var tr = document.createElement('tr');
							var td1 = document.createElement('td');
							var text1 = document.createTextNode(artists[j]);

							/*Make the artist table hyperlinks to their profile*/
							var link1  = document.createElement('a');
							link1.href = "#";
							link1.id = artists[j];
							link1.appendChild(text1);
							link1.onclick = function(){
								getArtistInfo(this.id);
							}
							td1.appendChild(link1);
							tr.appendChild(td1);
							table.appendChild(tr);
						}
						document.getElementById('profile_container').appendChild(table);
						document.getElementById("profile").style.display = "block";
						
						getLocationShows(artistList);
					});
				}
			});
	});
}

function getRandomArtist(){
	
	var fam = Math.random();
	var hot = Math.random();
	var num = Math.floor(Math.random()*4+1);
	
	/*Randomly generate values for familiarity, hotness and index to pick random artist*/
	if(fam >= 0.9 || fam <= 0.15){
		fam = Math.random();
	}
	else if (hot >= 0.9 || hot <= 0.15){
		hot = Math.random();
	}
	$.getJSON("https://developer.echonest.com/api/v4/artist/search?api_key="+ apiKey +"&format=json&results=5&min_familiarity="+fam+"&min_hotttnesss="+hot,function(random){
		console.log(random);
		getArtistInfo(random.response.artists[num].name);
	});
}

function home(){

	/*Clears all of the dynamic material on the page*/
	$('#music').empty();
	$('#event_title').empty();
	$('#event_container').empty();
	$('#profile_title').empty();
	$('#profile_container').empty();
	document.getElementById("profile").style.display = "none";
	document.getElementById("events").style.display = "none";

}

function about(){
	/*Opens a new window for information about the web service*/
	var myWindow = window.open("", "About", "width=600, height=600");
	myWindow.document.write("<p><h1>About Never Heard of Them</h1> <br> Never Heard of Them is a music discovery web service that allows you to find artists based on their name, genres, moods, their start year,  the year they retired/disbanded or by the location of the upcoming shows. <br><br>This example uses <a href='https://developer.echonest.com/docs/v4'> The Echo Nest API</a> and the <a href='https://developer.spotify.com/technologies/widgets/spotify-play-button/'> Spotify Play Button </a>and the <a href='https://www.bandsintown.com/api/1.0/overview'>Bandsintown API</a>. <br><br> The way the service works is that users can input a specific artist that will return a basic profile, a list of upcoming shows, and a Spotify Playlist.<br><br>The Spotify Play Button requires users to have the Spotify program installed and a Spotify account. <br><br>Users can also search in the combination of the other parameters:<ul><li>location of shows</li><li>genre of artists</li><li>mood of artists</li><li>artist start year</li><li>artist end year </li></ul><h2>Disclaimer</h2>This service is not perfect. I may not have checked for ever bug such as typos. <br> You have been warned. Please proceed with caution.</p>");
}

function instructions(){
	/*Opens a window on how the syntax of inputs and what they mean*/
	var myWindow = window.open("", "Instructions", "width=800, height=800");
	myWindow.document.write("<p><h3>How to:</h3>About the Query Parameters  and Syntax<ul><li>Artist Name<ul><li>name of artist, not case sensitive.</li></ul></li><li>Location<ul><li>city of the show</li><li>Within US: city,State ID</li><li>Outside US: city,Country ID</li></ul></li><li>Genre<ul><li>genre of artists</li></ul></li><li>Mood<ul><li>mood of artists</li></ul></li><li>Start Year<ul><li> artists that formed after this year</li><li>four digit year</li></ul></li><li>End Year<ul><li>artists that no longer exist after this year (retired or disbanded or no longer with us anymore)</li><li>four digit year</li></ul></li></ul><h3>Example queries</h3>Queries with Artist Name<ul><li>Artist: Coldplay</li><li>Artist: Coldplay + Location: London,UK</li><li>Artist: Coldplay + Location: Los Angeles,CA</li></ul>Queries Searching for Artists <ul><li>Genre: Indie Rock</li><li>Mood: Sad</li><li>Genre: Pop Rock + Mood: Happy</li><li>Genre: rock + Mood: cool + Year Started: 1950 + Year Ended: 2016</li></ul>Bonus features: <br> Click the search button with no entry parameters to get a random artists.<br>Click on the textbox if it has text in it already to clear it.</p>")
}

