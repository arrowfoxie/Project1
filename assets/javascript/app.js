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
            console.log(response);
            for (i = 0; i < numOfPhotos; i++) {
                console.log(response.photos.photo[i].id);
                var photoId = response.photos.photo[i].id;
                var farm = response.photos.photo[i].farm;
                var server = response.photos.photo[i].server;
                var secret = response.photos.photo[i].secret;
                var newImg = $("<img>")
                newImg.addClass("photo-thumb");
                newImg.attr("src", "https://farm" + farm + ".staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                console.log("https://farm" + farm + ".staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                $("#recipeHolder").append(newImg);

            }
        });
}
displayPhotos();