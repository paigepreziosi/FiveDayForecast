const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "8e2f6acd835ee6dc730ffc198da7c902"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    const kelvinToFahrenheit = (temp) => ((temp - 273.15) * 9/5 + 32).toFixed(2);
    const mpsToMph = (speed) => (speed * 2.237).toFixed(2);
    const dayOfWeek = new Date(weatherItem.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });

    