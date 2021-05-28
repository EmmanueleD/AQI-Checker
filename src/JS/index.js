import style from "../CSS/style.css";
import axios from "axios";

const searchForm = document.querySelector(".search-form");
const inputText = document.querySelector(".input-text");
const infoBox = document.querySelector(".info-box");

const aqiIndex = document.getElementById('aqi-index');
const aqiLevelMessage = document.getElementById('aqi-level');
const heathImplications = document.getElementById('health-implications');
const cautionaryStatement = document.getElementById('cautionary-statement');
const cityName = document.querySelector(".city-name");

const AQI_KEY = process.env.AQI_KEY;

// const AQI_KEY = prompt("inserire la propria aqi key. Se non ne hai una puoi crearen una al seguente link: https://aqicn.org/data-platform/token/#/");

// ---< Render map >--- ---<>--- ---<>---
const mymap = L.map('mapid');
let marker = "";
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1tYW51ZWxlLW9ubGluZSIsImEiOiJja28yMmh0bjEwMm5hMnZtbGlsZ3UwbXozIn0.ECsgpDntVzNVDMZ9nhFy5A`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: `pk.eyJ1IjoiZW1tYW51ZWxlLW9ubGluZSIsImEiOiJja28yMmh0bjEwMm5hMnZtbGlsZ3UwbXozIn0.ECsgpDntVzNVDMZ9nhFy5A`
}).addTo(mymap);
L.tileLayer(`https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png`).addTo(mymap);

// ---< Publish info of user location as a starting layout >--- ---<>--- ---<>---
window.addEventListener('load', () => {
  axios.get(`https://api.waqi.info/feed/here/?token=${AQI_KEY}`)
    .then(res => {
      const cityName = res.data.data.city.name;
      const aqiValue = res.data.data.aqi;
      const cityCoords = res.data.data.city.geo;
      publishAqi(cityName, aqiValue);
      mymap.setView(cityCoords, 13)
    })
})

// ---< When form:"submit". Request waqi and publish results >--- ---<>--- ---<>---
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  waitLayout();
  const city = inputText.value;
  axios.get(`https://api.waqi.info/feed/${city}/?token=${AQI_KEY}`)
    .then(res => {
      const cityName = res.data.data.city.name;
      const aqiValue = res.data.data.aqi;
      const cityCoords = res.data.data.city.geo;
      publishAqi(cityName, aqiValue);
      mymap.setView(cityCoords, 13)
    })
    .catch(error => errorLayout(error, city))
})


// ---< Publish aqi and info associated to it >--- ---<>--- ---<>---
const publishAqi = function (city, aqi){

  aqiIndex.classList.remove("animate__swing");
  if(aqi > 300){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `⚫ ${aqi} ⚫`;
    aqiLevelMessage.innerText = '💀 Hazardous! 💀';
    heathImplications.innerText = 'Health alert: everyone may experience more serious health effects';
    cautionaryStatement.innerText = 'Everyone should avoid all outdoor exertion';
  } else if (aqi > 200){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `🟤 ${aqi} 🟤`;
    aqiLevelMessage.innerText = '🚨 Very unhealthy 🚨';
    heathImplications.innerText = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
    cautionaryStatement.innerText = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.';
  } else if (aqi > 150){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `🔴 ${aqi} 🔴`;
    aqiLevelMessage.innerText = '🏭 Unhealthy 🏭';
    heathImplications.innerText = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects';
    cautionaryStatement.innerText = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion';
  } else if (aqi > 100){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `🟠 ${aqi} 🟠`;
    aqiLevelMessage.innerText = '🌆 Unhealthy for sensitive groups 🌆';
    heathImplications.innerText = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'
    cautionaryStatement.innerText = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
  }else if (aqi > 50){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `🟡 ${aqi} 🟡`;
    aqiLevelMessage.innerText = '🍂 Moderate 🍂';
    heathImplications.innerText = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
    cautionaryStatement.innerText = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
  } else if (aqi > 0){
    cityName.innerText = `${city}`;
    aqiIndex.innerText = `🟢 ${aqi} 🟢`;
    aqiLevelMessage.innerText = '🌿 Good 🌿 ';
    heathImplications.innerText = 'Air quality is considered satisfactory, and air pollution poses little or no risk';
    cautionaryStatement.innerText = 'None';
  } 
}

// ---< Show ⌛ to user >--- ---<>--- ---<>---
const waitLayout = function (){
  infoBox.classList.remove("error");
  searchForm.classList.remove("error");
  cityName.innerText = "Searching...";
  aqiIndex.innerText = "⌛";
  aqiIndex.classList.add("animate__swing");
  aqiLevelMessage.innerText = "Wait please...";
  heathImplications.innerText = "";
  cautionaryStatement.innerText = "";
}

// ---< Show error to user >--- ---<>--- ---<>---
const errorLayout = function (error){
  infoBox.classList.add("error");
  searchForm.classList.add("error");
  cityName.innerText = error;
  aqiIndex.innerText = "⚠️";
  aqiLevelMessage.innerText = `It seems that there isn't stations for the location you searched. Try looking for a station near you in the map 🕵️`;
  heathImplications.innerText = "💤";
  cautionaryStatement.innerText = "💤";
  navigator.geolocation.getCurrentPosition(p => {
    mymap.setView([p.coords.latitude, p.coords.longitude])
   })
}