var shellfish = ["shrimp", "lobster", "crab", "clams", "scallops"];
var beertype;
var foodlist;
//on click search, it will assign beer chosen to a type

if (beertype === "Saison" || beertype === "Hefeweizen") {
    foodlist = shellfish;
}
else if (beertype === "Saison" || beertype === "Hefeweizen") {

}

function displayRecipes() {
    var searchTerm = "bourbon";
    var queryURL = "https://api.edamam.com/search?q=" + searchTerm + "&ingredient=food&app_id=770161cb&app_key=ffef5d0540c50bcb89642c30a10c3cd2";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            for (i = 0; i < 5; i++) {
                var newRecipeRow = $("<div>");
                newRecipeRow.addClass("row");
                newRecipeImg = $("<img>");
                newRecipeImg.attr("src", response.hits[i].recipe.image);
                newRecipeImg.addClass("col-4");
                newRecipeInfoDiv = $("<div>");
                newRecipeInfoDiv.addClass("col-8");
                newRecipeSource = $("<p>");
                newRecipeSource.text("Source: " + response.hits[i].recipe.source);
                newRecipeName = $("<h3>");
                newRecipeName.text(response.hits[i].recipe.label);
                newRecipeLink = $("<a>");
                newRecipeLink.attr("href", response.hits[i].recipe.shareAs);
                newRecipeLink.text("View Recipe");
                newRecipeInfoDiv.append(newRecipeName);
                newRecipeInfoDiv.append(newRecipeSource);
                newRecipeInfoDiv.append(newRecipeLink);
                newRecipeRow.append(newRecipeImg);
                newRecipeRow.append(newRecipeInfoDiv);
                $("#recipeHolder").append(newRecipeRow);
            }
        });
}
displayRecipes();
var cocktailSearchTerm = "";
function displayCocktailInfo() {
    var cocktailqueryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailSearchTerm;
    $.ajax({
        url: cocktailqueryURL,
        method: "GET"
    })
        .then(function (response) {
        });
}
$("#search-btn").on("click", function (event) {
    event.preventDefault();
    cocktailSearchTerm = $("#search-input").val().trim();
    displayCocktailInfo();
});

function displayMeal() {
    var mealsearchTerm = "bourbon";
    var mealqueryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + mealsearchTerm;
    $.ajax({
        url: mealqueryURL,
        method: "GET"
    })
        .then(function (response) {
        });
}
displayMeal();