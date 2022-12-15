
$(function () {
    // latitide and longitud variables to be set by getCityCoordinates function
    var lat;
    var lon;
    var APIkey = "e897220616a2bdbf3302fa08f46b932e";
    var formEl = $("#city-form");

    function setCurrentWeather(weatherData) {
        var cityToSet = weatherData.name;
        console.log(cityToSet);
        $("#city").text("City: " + cityToSet);

        var tempToSet = weatherData.main.temp;
        console.log(tempToSet);
        $("#temp").text("Temperature: " + tempToSet + "°F");

        var windToSet = weatherData.wind.speed;
        console.log(windToSet);
        $("#wind").text("Wind: " + windToSet + " MPH");

        var humidityToSet = weatherData.main.humidity;
        console.log(humidityToSet);
        $("#humidity").text("Humidity: " + humidityToSet + "%");
    }

    function setForecastWeather(params) {
        
    }

    function getWeatherResponses(geoData) {
        currentWeatherAPIURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&units=imperial";
        fiveDaysForecastAPIURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&units=imperial";
        console.log(currentWeatherAPIURL);
        console.log(fiveDaysForecastAPIURL);
        fetch(currentWeatherAPIURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                setCurrentWeather(data);
                
            })
        fetch(fiveDaysForecastAPIURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (forecastdata) {
                console.log(forecastdata);
                setForecastWeather(forecastdata);
                
            })
    }

    function getCityCoordinates(e) {
        e.preventDefault();
        // Will store value retrived from Search a City form
        var cityRequested = formEl.children("#city-input").val();

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
                getWeatherResponses();
            })

    }

    formEl.submit(getCityCoordinates);

});