const searchContainer = $('.search-container');
const searchInput = $('#search');
const searchBtn = $('#city-search-btn');
const historyWrapper = $('.history-wrapper');


// function that gets cities from local

function getCities () {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    return cities;
}

//function that takes input value and stoes to local

function storeCity (eventObj) {
    eventObj.preventDefault();

    //grab each input element

    const inputEl = $('.city-search');
    

    //get the value of each input

    const cityVal = inputEl.val();
    

    //create an object that has each value and date 

    
    

    //pull old data from local or have empty array

    const cities = getCities();

    //push the blogs obj to the blogs array then convert to JSON

    if(!cities.includes(cityVal)){
        cities.push(cityVal);
        const jsonArray = JSON.stringify(cities);

    //save the blogs array to the local storage
    

        localStorage.setItem('cities', jsonArray);
    }

    //reset form values
    
    outputSearchHistory();

    
}

// api key for get 
const apiKeyW = '453e76b47d31a5d94e87e19b3143c6ec';


//function that gets city names from local and returns the most recent search

function getCityName () {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    
    if(cities.length > 0){
        const mostRecentCity = cities[cities.length -1].city;
        return mostRecentCity;
    } else {
        return 'Jersey City';
    }   
}

//function that outputs the city to the html

function outputCityName (city) {
    city = getCityName();
    const $cityOutput = $('.city-output');
    
    $cityOutput.html(`
        <p>${city}</p>
        `)
}

//function that uses city name to get info ffrom openweather

function getCurrentweather(city) {
    console.log(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyW}&units=imperial`;
    
    return $.get(url);

}


//function that outputs the current weather to the html
function outputCurrentWeather(currentData) {
    const $currentOutput = $('.weather-output');
    console.log(currentData);
    
    $currentOutput.html(`
            <div>
                <div>
                    <h2 class="fs-1">${currentData.name}</h2>
                    <p class="today-weather-content"  >Current Temp: ${currentData.main.temp}</p>
                    <p class="today-weather-content" >Conditions: ${currentData.weather[0].description}</p>
                    <p class="today-weather-content" >Wind Speed: ${currentData.wind.speed} mph</p>
                    <p class="today-weather-content" >Humidity: ${currentData.main.humidity}</p>
                </div>
                <div>
                    <img class="currentImg ms-5 " src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="weather icon image">
                </div>
            </div>
        `);
        
        return currentData.coord;
}


//function that gets the info for the forecast from openweatrher
function getWeatherForcast (cityCoord) {
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoord.lat}&lon=${cityCoord.lon}&appid=${apiKeyW}&units=imperial`;

    
    return $.get(url);
}


//function that outputs the forecast to the html

function outputWeatherForcast (forcastData) {
    const $forcastOutput = $('.five-day-weather');

    $forcastOutput.empty();
    
    const filtered = forcastData.list.filter(function (forcastObj) {
        if(forcastObj.dt_txt.includes('12:00')) return true;
    });
    console.log(filtered);
    filtered.forEach(function (forcastObj) {
        $forcastOutput.append(`
            
                <div class="current-weather p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 ms-3" >
                    <h3>${forcastObj.dt_txt}</h3>
                    <p>Temp: ${forcastObj.main.temp}</p>
                    <p>Wind Speed: ${forcastObj.wind.speed} mph</p>
                    <p>Humidity: ${forcastObj.main.humidity}</p>
                    <img src="https://openweathermap.org/img/wn/${forcastObj.weather[0].icon}@2x.png" alt="weather icon image">
                </div>
            
            `)
    })

    searchInput.val('');
}

//function that removes the ask to input info element

function hide () {
    const $askForInput = $('.city-output');




}









//function that adds the previous searches to a list on the html
function outputSearchHistory () {
    const cities = getCities();
    historyWrapper.empty();

    cities.forEach(function (city) {

        historyWrapper.append(`
            <button class="past-search">${city}</button>
            `)
    });
}

//function that runs when page is loaded with event listeners

function init() {
    
    $(searchBtn).add(historyWrapper).on('click', function (eventObj) {
       
        const isSearch = eventObj.target.id;
        
        if(isSearch){
            storeCity(eventObj);
        }
        console.log(searchInput.val());
        getCurrentweather(isSearch ? searchInput.val() : eventObj.target.innerText)
            .then(outputCurrentWeather)
            .then(getWeatherForcast)
            .then(outputWeatherForcast)
    });
    outputSearchHistory();
    // outputCityName();
    // outputCurrentWeather();
    // addPreviousSearch();
}

init();