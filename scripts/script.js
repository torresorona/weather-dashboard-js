
$(function () {
    // latitide and longitud variables to be set by getCityCoordinates function
    var lat;
    var lon;
    var APIkey = "e897220616a2bdbf3302fa08f46b932e";
    var formEl = $("#city-form");

    
    function getWeatherResponse(geoData) {
        weatherAPIURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
        console.log(weatherAPIURL);
        fetch(weatherAPIURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                
            })
    }

    function getCityCoordinates(e) {
        e.preventDefault();
        // Will store value retrived from Search a City form
        var cityRequested = formEl.children("#city").val();

        // Query string to find 
        var geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityRequested + "&limit=1&appid=" + APIkey;

        fetch(geocodingURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (data) {
                console.log(data[0].lat);
                lat = data[0].lat;
                console.log(data[0].lon);
                lon = data[0].lon;
                getWeatherResponse(data);
            })

    }

    formEl.submit(getCityCoordinates);

});