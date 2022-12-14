
$(function () {
    // latitide and longitud variables to be set by getCityCoordinates function
    var lat;
    var lon;
    var APIkey = "e897220616a2bdbf3302fa08f46b932e";
    var formEl = $("#city-form");

    
    function getWeatherResponse() {
        weatherAPIURL = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
    }

    function getCityCoordinates(e) {
        e.preventDefault();
        // Will store value retrived from Search a City form
        var cityRequested = formEl.children("#city").val();

        // Query string to find 
        var geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityRequested + "&limit=1&appid=" + APIkey;


    }

    formEl.submit(getCityCoordinates);

});