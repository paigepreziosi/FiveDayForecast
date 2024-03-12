const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "8e2f6acd835ee6dc730ffc198da7c902"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    const kelvinToFahrenheit = (temp) => ((temp - 273.15) * 9/5 + 32).toFixed(2);
    const mpsToMph = (speed) => (speed * 2.237).toFixed(2);
    const dayOfWeek = new Date(weatherItem.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });


    if(index === 0) { 
        return `<div class="details">
                    <h2>${cityName}</h2>
                    <h6>Temperature: ${kelvinToFahrenheit(weatherItem.main.temp)}°F</h6>
                    <h6>Wind Speed: ${mpsToMph(weatherItem.wind.speed)} mph</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { 
        return `<li class="card">
                    <h3>${dayOfWeek}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temperature: ${kelvinToFahrenheit(weatherItem.main.temp)}°F</h6>
                    <h6>Wind Speed: ${mpsToMph(weatherItem.wind.speed)} mph</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
            saveSearch(name, lat, lon); 
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
       );
}


const searchHistoryDiv = document.querySelector(".search-history");

const saveSearch = (cityName, latitude, longitude) => {
    const searchButton = document.createElement("button");
    searchButton.innerText = cityName;

    searchButton.addEventListener("click", () => {
        getWeatherDetails(cityName, latitude, longitude);
    });

    searchHistoryDiv.appendChild(searchButton);
};

const fetchCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
            saveSearch(name, lat, lon); 
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};


const clearHistoryButton = document.querySelector(".clear-history-btn");


const clearSearchHistory = () => {
    searchHistoryDiv.innerHTML = "";
   
};

clearHistoryButton.addEventListener("click", clearSearchHistory);

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
