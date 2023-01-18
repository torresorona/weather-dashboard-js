

$(function () {
    // Global Variables
    // latitide and longitud variables to be set by getCityCoordinates function
    var lat;
    var lon;
    var APIkey = "e897220616a2bdbf3302fa08f46b932e";
    var formEl = $("#city-form");
    var searches = [];
    let searchHistoryEl = $("#city-search-history");

    // localStorage Functions

    const setCitiestoHistory = () => {
        searchHistoryEl.empty();
        searches.forEach(search => {
            let citySearchedEl = $("<button>").html(search).addClass("btn btn-secondary p-2 m-2");
            searchHistoryEl.prepend(citySearchedEl);
        });
    };

    const getSearchFromStorage = () => {
        for (let i = 1; i < 11; i++) {
            let city = localStorage.getItem(`city-${i}`);
            if (city) {
                searches.push(city);
            }
        };
        setCitiestoHistory();
    }
    

    const setSearchToStorage = (cityPassed) => {
        let searchToSet = cityPassed;
        if (searches.includes(searchToSet)) {
            return;
        } else if (searches.length == 10) {
            searches.shift();
            searches.push(searchToSet);
            localStorage.clear();
            searches.forEach((search, index) => {
                localStorage.setItem(`city-${index + 1}`, search)
            });
        } else {
            let searchNumber = searches.length + 1;
            searches.push(searchToSet);
            localStorage.setItem(`city-${searchNumber}`, searchToSet)
        }
        setCitiestoHistory();
    }


    // Weather Functions
    function setCurrentWeather(weatherData) {
        var cityToSet = weatherData.name;
        $("#city").text("City: " + cityToSet);

        var tempToSet = weatherData.main.temp;
        $("#temp").text("Temperature: " + tempToSet + "°F");

        var windToSet = weatherData.wind.speed;
        $("#wind").text("Wind: " + windToSet + " MPH");

        var humidityToSet = weatherData.main.humidity;
        $("#humidity").text("Humidity: " + humidityToSet + "%");
    }

    
    function setForecastWeather(forecastData) {
        var forecastContainersEl = $(".forecasts-containers");
        var now = dayjs();
        let length = forecastData.list.length/8;
        let listIndex = 4;
        forecastContainersEl.empty();
        for (let i = 1; i < length + 1; i++) {
            var forecastContainerEl = $("<div>").addClass("border border-dark p-3 m-2");;
            var dateToSet = now.add(i, 'day').format("MM/DD/YYYY");
            var dateEL = $("<h5>").html(dateToSet);
            // Use OpenWeatherAPI icons based on icon code from response
            var iconCode = forecastData.list[listIndex].weather[0].icon
            var iconEL = $("<img>").attr("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
            var tempEl = $("<h6>").html(`Temp: ${forecastData.list[listIndex].main.temp}°F`);
            var windEl = $("<h6>").html(`Wind: ${forecastData.list[listIndex].wind.speed} MPH`);
            var humidityEl = $("<h6>").html(`Humdity: ${forecastData.list[listIndex].main.humidity}%`);
            forecastContainerEl.append(dateEL, iconEL, tempEl, windEl, humidityEl);
            forecastContainersEl.append(forecastContainerEl);
            listIndex += 8 ;
        }
        $("#city-input").val("");
    
    
    }

    function getWeatherResponses() {
        let currentWeatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`;
        let fiveDaysForecastAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`;
        fetch(currentWeatherAPIURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (data) {
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
                setForecastWeather(forecastdata);
                
            })
    }

    function getCityCoordinates(cityRequested) {
        // Will store value retrived from Search a City form

        // Query string to find 
        var geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityRequested}&limit=1&appid=${APIkey}`;

        fetch(geocodingURL)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log("No good")
                }
                return response.json();
            })
            .then(function (data) {
                lat = data[0].lat;
                lon = data[0].lon;
                setSearchToStorage(cityRequested);
                getWeatherResponses();
            })

    }

    const init = () => {
        getSearchFromStorage();
    }

    // Query GeoCode and Weather API based on value inputed on search bar
    formEl.on('submit', (e) => {
        e.preventDefault();
        let city = formEl.children("#city-input").val();
        getCityCoordinates(city);
    })

    // Query GeoCode and Weather API based on clicked button from history search
    searchHistoryEl.click((e) => {
        e.preventDefault();
        let city = e.target.textContent;
        getCityCoordinates(city);
    })

    init();

});