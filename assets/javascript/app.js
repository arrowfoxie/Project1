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


var provider = new firebase.auth.GoogleAuthProvider();

function googleSignin() {
    firebase.auth()

        .signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;

            console.log(token)
            console.log(user)

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(error.code)
            console.log(error.message)
        });
}

function googleSignout() {
    firebase.auth().signOut()

        .then(function () {
            console.log('Signout Succesfull')
        }, function (error) {
            console.log('Signout Failed')
        });
}

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
var flickRadius = 5;
//adding this as a variable in case we want users to determine how many photos to see
var numOfPhotos = 6;

function displayPhotos() {
    //just setting these to known coordinates to test
    //ideally the values will be set in the on click function for google maps drop marker
    //arbitrarily setting to 5 - can have an input allowing users to choose
    //numOfPhotos = 6;
    //flickRadius = 2;
    var apiKey = "5cecf5d590ae3c382e6bd6795a2d8262";
    var photoQueryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey + "&per_page=" + numOfPhotos + "&safe_search=1&has_geo=1&lat=" + latVar + "&lon=" + lonVar + "&radius=" + flickRadius + "&format=json&jsoncallback=?";
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
            for (i = 0; i < numOfPhotos; i++) {
                var photoId = response.photos.photo[i].id;
                var farm = response.photos.photo[i].farm;
                var server = response.photos.photo[i].server;
                var secret = response.photos.photo[i].secret;
                var newPhotoUrl = "https://farm" + farm + ".staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg"
                var newCol = $("<div>");
                newCol.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6 imgCol");
                newCol.attr("data-url", newPhotoUrl);
                var newInnerDiv = $("<div>");
                newInnerDiv.addClass("inner-div");
                var newLink = $("<a>");
                newLink.addClass("example-image-link");
                newLink.attr("href", newPhotoUrl);
                newLink.attr("data-lightbox", "example-set");
                var PhotoTitle = response.photos.photo[i].title;
                newLink.attr("data-title", PhotoTitle);
                var newImg = $("<img>")
                newImg.addClass("example-image photo-thumb img-fluid");
                //newImg.attr("data-title", response.photos.photo[i].title);
                newImg.attr("src", newPhotoUrl);
                newImg.attr("alt", response.photos.photo[i].title);
                newLink.append(newImg);
                newInnerDiv.append(newLink);
                newCol.append(newInnerDiv)
                $("#image-holder").append(newCol);
                console.log(PhotoTitle);

                database.ref().push({
                    title: PhotoTitle,
                    url: newPhotoUrl
                })


            }
        });
}
$(document).on("click", ".heart-ico", function (event) {
    event.preventDefault();
    console.log("boop");
});

$("#update-numbers").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    // Get inputs
    var photoNumFromUser = $("#photoNum-input").val().trim();
    var radiusFromUser = $("#radius-input").val().trim();
    console.log(photoNumFromUser);
    console.log(radiusFromUser);

    if (photoNumFromUser < 1 || photoNumFromUser > 12) {
        $("#holdMesssage").text("Please enter a value between 1 and 10 for number of photos.");
        $("#missingInput").css("display", "flex");
    }
    else if (radiusFromUser < 1 || radiusFromUser > 12) {
        $("#holdMesssage").text("Please enter a value for radius between 1 and 12 miles.");
        $("#missingInput").css("display", "flex");
    }
    else if (isNaN(radiusFromUser) === true || isNaN(photoNumFromUser) === true) {
        $("#holdMesssage").text("Please enter a numerical value for each input.");
        $("#missingInput").css("display", "flex");
    }
    else {
        flickRadius = radiusFromUser;
        numOfPhotos = photoNumFromUser;
        displayPhotos();
    }
});

$(function () {
    $('.form-control').each(function () {
        if ($(this).val().length > 0) {
            $(this).addClass('has-value');
        }
        else {
            $(this).removeClass('has-value');
        }
    });
    $('.form-control').on('focusout', function () {
        if ($(this).val().length > 0) {
            $(this).addClass('has-value');
        }
        else {
            $(this).removeClass('has-value');
        }
    });
});

$("#modalBtn").on("click", function (event) {
    event.preventDefault();
    $("#loginModal").css("display", "block");
});
var userEmail = "";

$("#login-update").on("click", function (event) {
    event.preventDefault();
    userEmail = $("#email-input").val().trim();
    userPassword = $("#password-input").val().trim();
    console.log(userEmail);
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    $("#loginModal").css("display", "none");
});
