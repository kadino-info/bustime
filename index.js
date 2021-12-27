import setShedules from "./setShedules.min.js";
// import setShedules from "./setShedules.js";
import { OWM_API_KEY } from "./env.js"; // OpenWeatherMap ApiKey store in env.js file

const teperatureUrl = "https://rbstr.tk:3000/home/";
const weatherCity = 'Mogilev';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&lang=ru&appid=${OWM_API_KEY}&units=metric`;
const temperatureKadino = document.getElementById("temperatureKadino");
const temperatureMogilev = document.getElementById("temperatureMogilev");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");
const wind = document.getElementById("wind");
const timeNowHours = document.getElementById("timeNowHours");
const timeNowMins = document.getElementById("timeNowMins");
const collapseKirova = document.getElementById("collapseKirova");
const collapseKadino = document.getElementById("collapseKadino");
const collapseVokzal = document.getElementById("collapseVokzal");
const collapseRomanovichi = document.getElementById("collapseRomanovichi");
const urlParams = new URLSearchParams(window.location.search);
const tomorow = document.querySelector('.tomorow');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownButton = document.getElementById("dropdown-toggle");
const reset = document.getElementById("reset");
const dropdownItems = document.querySelectorAll('.dropdown-item');
let showDay

function toggle(e) { 
  const clList = e.classList;
  if (!clList.contains('show')) clList.add('show');
  else clList.remove('show');
};
const from = urlParams.get("from");

// console.log("from:", from);
if (from) {
  if (from.toLowerCase().match("kirova" || "кирова")) collapseKirova.classList.add("show");
  if (from.toLowerCase().match("kadino" || "кадино")) collapseKadino.classList.add("show");
  if (from.toLowerCase().match("vokzal" || "вокзал")) collapseVokzal.classList.add("show");
  if (from.toLowerCase().match("romanovichi" || "романовичи")) collapseRomanovichi.classList.add("show");
} 

let date, hours, mins, day;

async function getTemperature () {
  temperatureKadino.innerText = "";
  temperatureMogilev.innerText = "";
  const req = await fetch(teperatureUrl);
  const res = await req.json();
  if (res[0].blOut) {
    temperatureKadino.innerText = res[0].blOut + "°С";
    temperatureKadino.classList.remove('hidden');
  } else temperatureKadino.classList.add('hidden')
  
  setTimeout(() => getTemperature(), 800000);
};

async function getWeather() {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    if (data.cod !== 200) {
        weatherIcon.textContent = "";
        temperatureMogilev.textContent = "";
        weatherDescription.textContent = "";
        wind.textContent = "";
        console.log(data)
        return
    }
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperatureMogilev.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `- ветер: ${Math.round(data.wind.speed)}м/с`;

    setTimeout(getWeather, 1000000);
}

const timeUpdate = () => {
  
  const addZero = (digit) => { return digit < 10 ? `0${digit}` : digit };

  date = new Date();
  day = date.getDay();
  hours = date.getHours();
  mins = date.getMinutes();
  
  timeNowHours.innerText = addZero(hours);
  timeNowMins.innerText = addZero(mins);

  setTimeout(() => timeUpdate(), 5000);
};

const cday = new Date().getDay();

dropdownButton.addEventListener('click', () => toggle(dropdownMenu));
reset.addEventListener('click', () => {
  setShedules();
  dropdownItems.forEach((item) => {item.classList.remove('active')})
  dropdownButton.innerText = 'Другой день';
});
dropdownItems.forEach(
  (item, indx) => {
    if(indx === cday) item.classList.add('desabled')
    item.addEventListener('click', (e) => {
      setShedules(indx); 
      showDay = indx;
      toggle(dropdownMenu);
      dropdownButton.innerText = e.target.innerText;
      dropdownItems.forEach((item) => {item.classList.remove('active')})
      e.target.classList.add('active');
    })
    }
  );

timeUpdate();
setShedules(showDay);
getTemperature();
getWeather();
