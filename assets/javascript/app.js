// Initialize Firebase
var config = {
    apiKey: "AIzaSyDwUjEuyQskBoLECIntfN_rFIyWOQTetSA",
    authDomain: "maps-and-photos.firebaseapp.com",
    databaseURL: "https://maps-and-photos.firebaseio.com",
    projectId: "maps-and-photos",
    storageBucket: "maps-and-photos.appspot.com",
    messagingSenderId: "1046812116045"
};

firebase.initializeApp(config);

var database = firebase.database();
var markers = [];
var map;

function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
    console.log("Latitude and longitude coordinates" + latLng);
    markers.push(marker);
    console.log(markers);
}

function initMap() {
   map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: -25.363882, lng: 131.044922 }
    });

    map.addListener('click', function (e) {
        placeMarkerAndPanTo(e.latLng, map);
    });
    
}
initMap();

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }


//setting latitude and longitude as global variables so that they will be set when user clicks on map
//and then read in the display photos function call
var latVar;
var lonVar;
//adding this as a variable in case we want users to determine how large a radius they want to search
var flickRadius;
//adding this as a variable in case we want users to determine how many photos to see
var numOfPhotos;

function displayPhotos() {
    //just setting these to known coordinates to test
    //ideally the values will be set in the on click function for google maps drop marker
    latVar = 32.786450;
    lonVar = -96.777252;
    //arbitrarily setting to 5 - can have an input allowing users to choose
    numOfPhotos = 5;
    flickRadius = 2;
    var apiKey = "d1beea40474435adacdf1ffb0d0e1248";
    var photoQueryURL = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey + "&per_page=" + numOfPhotos + "&safe_search=1&has_geo=1&lat=" + latVar + "&lon=" + lonVar + "&radius=" + flickRadius + "&format=json&jsoncallback=?";
    $.ajax({
        async: true,
        crossDomain: true,
        url: photoQueryURL,
        method: "GET",
        dataType: "jsonp",
        headers: {}
    })
        .then(function (response) {
            for (i = 0; i < numOfPhotos; i++) {
                var photoId = response.photos.photo[i].id;
                var farm = response.photos.photo[i].farm;
                var server = response.photos.photo[i].server;
                var secret = response.photos.photo[i].secret;
                var newCol = $("<div>");
                newCol.addClass("col-sm-6 col-md-4");
                var newImg = $("<img>")
                newImg.addClass("photo-thumb");
                newImg.addClass("img-fluid");
                newImg.attr("src", "https://farm" + farm + ".staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                newCol.append(newImg)
                $("#image-holder").append(newCol);

            }
        });
}
displayPhotos();