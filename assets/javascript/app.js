$(".close").click(function () {
    $(this).parents(".modal").css("display", "none");
});



// Initialize Firebase
var config = {
    apiKey: "AIzaSyDBYdHzf4mLOzxj8d20J5NyvnSnw969AIM",
    authDomain: "rabbit-e67ed.firebaseapp.com",
    databaseURL: "https://rabbit-e67ed.firebaseio.com",
    projectId: "rabbit-e67ed",
    storageBucket: "rabbit-e67ed.appspot.com",
    messagingSenderId: "594792130639"
};

firebase.initializeApp(config);

var database = firebase.database();

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
    console.log("Latitude and longitude coordinates " + latLng.lat() + " and " + latLng.lng());
    latVar = latLng.lat();
    lonVar = latLng.lng();
    displayPhotos();
    markers.push(marker);
    database.ref("coordinates/").push({
        latitude: latVar,
        longitude: lonVar
    })
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
                if (response.photos.photo.length === 0) {
                    $("#holdMesssage").text("There are no photos here, please choose a different location.");
                    $("#missingInput").css("display", "flex");
                }
                else {
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
                    newImg.attr("src", newPhotoUrl);
                    newImg.attr("alt", response.photos.photo[i].title);
                    newLink.append(newImg);
                    newInnerDiv.append(newLink);
                    newCol.append(newInnerDiv)
                    $("#image-holder").append(newCol);
                    database.ref("photosLoaded/").push({
                        title: PhotoTitle,
                        url: newPhotoUrl
                    }).then((snap) => {
                        console.log(snap.key)
                    })
                }
            }
        });
}

$("#update-numbers").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    // Get inputs
    var photoNumFromUser = $("#photoNum-input").val().trim();
    var radiusFromUser = $("#radius-input").val().trim();

    if (photoNumFromUser < 1 || photoNumFromUser > 12) {
        $("#holdMesssage").text("Please enter a value between 1 and 12 for number of photos.");
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

var userEmail = "";
var userPassword = "";
var isLoggedIn = false;

$("#modalBtn").on("click", function (event) {
    event.preventDefault();
    if (isLoggedIn === false) {
        $("#loginModal").css("display", "block");
    }
    else if (isLoggedIn === true) {
        firebase.auth().signOut().then(function () {
            isLoggedIn = false;
            user = null;
            // Sign-out successful.
        }).catch(function (error) {
            console.log(error);
        });
        $("#modalBtn").text("LOG IN");
        $("#navmessage").text("Sign in or Create an account");
    }
});
var user = firebase.auth().currentUser;
var usersPhotos;
console.log(usersPhotos);
$("#login-update").on("click", function (event) {
    event.preventDefault();
    providedUserEmail = $("#email-input").val().trim();
    providedUserPassword = $("#password-input").val().trim();
    firebase.auth().signInWithEmailAndPassword(providedUserEmail, providedUserPassword).then(function () {
        user = firebase.auth().currentUser;
        isLoggedIn = true;
        userEmail = providedUserEmail;
        userPassword = providedUserPassword;
        $("#loginModal").css("display", "none");
        $("#modalBtn").text("SIGN OUT");
        $("#navmessage").text("Signed in as " + userEmail);
        usersPhotos = database.ref("favorites/" + user.uid);
        console.log(usersPhotos);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            $("#holdMesssage").text("The password you provided is incorrect.");
            $("#missingInput").css("display", "flex");
        }
        else if (errorCode === 'auth/invalid-email') {
            $("#holdMesssage").text("Please enter a valid email address.");
            $("#missingInput").css("display", "flex");
        }
        else {
            $("#holdMesssage").text(errorMessage);
            $("#missingInput").css("display", "flex");
        }
        console.log(error);
    });
    $("#email-input").val("");
    $("#password-input").val("");
});

$("#new-account").on("click", function (event) {
    event.preventDefault();
    $("#loginModal").css("display", "none");
    $("#signUpModal").css("display", "block");
});

$("#create-new-user").on("click", function (event) {
    event.preventDefault();
    email = $("#new-email-input").val().trim();
    password = $("#new-password-input").val().trim();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        user = firebase.auth().currentUser;
        isLoggedIn = true;
        userEmail = email;
        userPassword = password;
        $("#signUpModal").css("display", "none");
        $("#modalBtn").text("SIGN OUT");
        $("#navmessage").text("Signed in as " + userEmail);
    }).catch(function (error) {
        console.log(email);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'email-already-in-use') {
            $("#holdMesssage").text("The email you provided is already in use.");
            $("#missingInput").css("display", "flex");
        }
        else {
            $("#holdMesssage").text(errorMessage);
            $("#missingInput").css("display", "flex");
        }
        // ...
    });
});
var favRow = $("<div>");
//here is where the problem is
function displayFavs() {
    $("#photoHolder").empty();
    //var favCol = $("<div>");
    usersPhotos.on("child_added", function (snapshot) {
        var likedUrl = snapshot.val().url;
        var likedTitle = snapshot.val().title;
        var favInner = $("<div>");
        var favCol = $("<div>");
        favCol.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-4 imgCol");
        favInner.addClass("inner-div");
        var favLink = $("<a>");
        favLink.addClass("example-image-link");
        favLink.attr("href", likedUrl);
        favLink.attr("data-lightbox", "example-set");
        favLink.attr("data-title", likedTitle);
        favLink.attr("data-key", snapshot.key);
        var favImg = $("<img>");
        favImg.addClass("example-image img-fluid");
        favImg.attr("src", likedUrl);
        favImg.attr("alt", likedTitle);
        favLink.append(favImg);
        favInner.append(favLink);
        favCol.append(favInner);
        favRow.addClass("row");
        favRow.append(favCol);
    });
    $("#photoHolder").append(favRow);
}
var isFavsUp = false;
$("#myfavs").on("click", function (event) {
    if (user === null) {
        $("#holdMesssage").text("Please log in to view your favorites.");
        $("#missingInput").css("display", "flex");
    }
    else {
        event.preventDefault();
        isFavsUp = true;
        console.log(isFavsUp);
        //$("#photoHolder").empty();
        displayFavs();
        $("#favoritesModal").css("display", "flex");
    }
});
$("#close-favs").on("click", function (event) {
    event.preventDefault();
    isFavsUp = false;
    console.log(isFavsUp);
    $(this).parents(".photoModal").css("display", "none");
});