
$(".close").click(function () {
    $(this).parents(".modal").css("display", "none");
});

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
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');

$("#mybtn").on("click", function () {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
});

var latVar;
var lonVar;
var markers = [];
var map;

function placeMarkerAndPanTo(latLng, map) {
    marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
    console.log("Latitude and longitude coordinates" + latLng.lat() + "and" + latLng.lng());
    latVar = latLng.lat();
    lonVar = latLng.lng();
    console.log(latVar);
    console.log(lonVar);
    displayPhotos();
    markers.push(marker);
}


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
         zoom: 4,
         center: { lat: 32.841199, lng: -96.784529 }
     });
 
     map.addListener('click', function (e) {
         placeMarkerAndPanTo(e.latLng, map);
     });
     
 }
 function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
 
 function clearMarkers() {
        setMapOnAll(null);
      }

    
      function showMarkers() {
        setMapOnAll(map);
      }

   
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }

      initMap();

//setting latitude and longitude as global variables so that they will be set when user clicks on map
//and then read in the display photos function call
//adding this as a variable in case we want users to determine how large a radius they want to search
var flickRadius;
//adding this as a variable in case we want users to determine how many photos to see
var numOfPhotos;

function displayPhotos() {
    //just setting these to known coordinates to test
    //ideally the values will be set in the on click function for google maps drop marker
    //arbitrarily setting to 5 - can have an input allowing users to choose
    numOfPhotos = 5;
    flickRadius = 2;
    var apiKey = "d1beea40474435adacdf1ffb0d0e1248";
    var photoQueryURL = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey + "&per_page=" + numOfPhotos + "&safe_search=1&has_geo=1&lat=" + latVar + "&lon=" + lonVar + "&radius=" + flickRadius + "&format=json&jsoncallback=?";
    console.log(photoQueryURL);
    $.ajax({
        async: true,
        crossDomain: true,
        url: photoQueryURL,
        method: "GET",
        dataType: "jsonp",
        headers: {}
    })
        .then(function (response) {
            $("#image-holder").empty();
            console.log(response);
            for (i = 0; i < numOfPhotos; i++) {
                var photoId = response.photos.photo[i].id;
                var farm = response.photos.photo[i].farm;
                var server = response.photos.photo[i].server;
                var secret = response.photos.photo[i].secret;
                var newCol = $("<div>");
                newCol.addClass("col-sm-6 col-md-4 imgCol");
                var newImg = $("<img>")
                newImg.addClass("photo-thumb");
                newImg.addClass("img-fluid");
                newImg.attr("data-title", response.photos.photo[i].title);
                newImg.attr("src", "https://farm" + farm + ".staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                newCol.append(newImg)
                $("#image-holder").append(newCol);

            }
        });
}
$("#image-holder").on("click", ".photo-thumb", function (event) {
    event.preventDefault();
    console.log($(this).attr("src"))
    var photoUrl = $(this).attr("src")
    var photoTitle = $(this).attr("data-title")
    database.ref().child("favImg").push({
        name: photoTitle,
        url: photoUrl
    });
    var newHeart = $("<span>")
    newHeart.text("heart");
    //newHeart.append($(this).parents())
});