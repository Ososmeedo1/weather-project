

const searchBar = document.querySelector('input');
const searchBtn = document.querySelector('#searchBtn');
const rowDisplay = document.querySelector('#rowDisplay');
const forecastDisplay = document.querySelector('#forecastDisplay');
let loadingSection = document.querySelector('.loading')
let notFound = document.querySelector('.not-found');
let refreshButton = document.querySelector('.refresh');


let data = {}; // main api data (days)
let hourlyData = {}; // api data (hours)
let currentData = {} // current day-hour data
const currentCity = localStorage.getItem('city') || 'cairo';

loadingAppear();
mainFunction(currentCity)

function loadingAppear() {
  loadingSection.classList.add('d-flex');
  loadingSection.classList.remove('d-none');
  rowDisplay.innerHTML = '';
  forecastDisplay.innerHTML = '';
}

function loadingDisappear() {
  loadingSection.classList.remove('d-flex');
  loadingSection.classList.add('d-none');
}

searchBtn.addEventListener('click', () => {
  localStorage.setItem('city', searchBar.value)
  loadingAppear();
  mainFunction(searchBar.value);
})

refreshButton.addEventListener('click', () => {
  loadingAppear();
  mainFunction(localStorage.getItem('city'));
})

async function mainFunction(city) {
  localStorage.setItem('city', city);
  notFound.classList.add('d-none');

  const { lat, lon } = await getCoordinates(city);
  
  if (lat == undefined && lon == undefined) {

    rowDisplay.innerHTML = '';
    forecastDisplay.innerHTML = '';
    notFound.classList.remove('d-none');
    loadingDisappear();
    
  } else {
    data = await getGeneralWeatherData(lat, lon)
    hourlyData = await getHourlyWeatherData(lat, lon)
    getCurrentDegree();
    displayData();
    loadingDisappear();
  }

}

async function getCoordinates(city) {
  const editedCityName = city.toLowerCase();
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(editedCityName)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.length) {
    return { lat: undefined, lon: undefined };
  } else {

    const match = data.find(item =>
      item.type === "city" || item.class === "place"
    );

    const location = match || data[0];
    const { lat, lon } = location;
    return { lat, lon };
  }

}

async function getGeneralWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max&timezone=auto&forecast_days=5`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getHourlyWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&timezone=auto`;
  const response = await fetch(url);
  const data = await response.json();
  loading = false;
  return data;
}

function getCurrentTimeInZone(timeZone) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const dateParts = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:00`;
}

function getCurrentDegree() {
  const time = hourlyData.hourly.time;
  const degrees = hourlyData.hourly.temperature_2m;
  const weatherStatus = hourlyData.hourly.weathercode;
  const windSpeed = hourlyData.hourly.windspeed_10m;
  const humidity = hourlyData.hourly.relativehumidity_2m;


  const currentTime = getCurrentTimeInZone(data.timezone);



  for (let i = 0; i < time.length; i++) {
    if (time[i] == currentTime) {

      switch (weatherStatus[i]) {

        case 0:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Clear Sky"
          };
          break;

        case 1:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Mainly clear"
          };
          break;

        case 2:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Partly cloudy"
          };
          break;

        case 3:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Overcast"
          };
          break;

        case 45:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Fog"
          };
          break;

        case 48:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Depositing rime fog"
          };
          break;

        case 51:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Drizzle: Light"
          };
          break;

        case 53:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Drizzle: moderate"
          };
          break;

        case 55:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Drizzle: dense intensity"
          };
          break;

        case 56:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Freezing Drizzle: Light"
          };
          break;

        case 57:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Freezing Drizzle: dense intensity"
          };
          break;

        case 61:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain: Slight"
          };
          break;

        case 63:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain: moderate"
          };
          break;

        case 65:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain: heavy intensity"
          };
          break;

        case 66:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Freezing Rain: Light"
          };
          break;

        case 67:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Freezing Rain: heavy intensity"
          };
          break;

        case 71:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow fall: Slight"
          };
          break;

        case 73:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow fall: moderate"
          };
          break;

        case 75:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow fall: heavy intensity"
          };
          break;

        case 77:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow grains"
          };
          break;

        case 80:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain showers: Slight"
          };

        case 81:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain showers: moderate"
          };

        case 82:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Rain showers: violent"
          };

        case 85:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow showers slight"
          };

        case 86:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Snow showers heavy"
          };

        case 95:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Thunderstorm: Slight or moderate"
          };

        case 96:
        case 99:
          currentData = {
            currentHumidity: humidity[i],
            currentWindSpeed: windSpeed[i],
            currentDegree: degrees[i],
            currentStatus: "Thunderstorm with slight and heavy hail"
          };
          break;
      }

      break;
    }
  }
}

function displayData() {

  const localTime = new Date().toLocaleString("en-Us", {
    timeZone: `${data.timezone}`,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
    hour12: true,
  })

  const afterTomorrowStr = data.daily.time[1];
  const afterTomorrowDay = new Date(afterTomorrowStr);
  const afterTomrrowDayName = afterTomorrowDay.toLocaleDateString("en-US", { weekday: "long" });

  const afterAfterTomorrowStr = data.daily.time[2];
  const afterAfterTomorrowDay = new Date(afterAfterTomorrowStr);
  const afterAfterTomrrowDayName = afterAfterTomorrowDay.toLocaleDateString("en-US", { weekday: "long" });



  const firstContainer = `
    <div class="col-md-7">
          <div class="details mt-5">
            <div class="container">
              <div class="zone">
                <h2>${data.timezone.split('/')[1]}</h2>
                <p>Local Time: ${localTime}</p>
              </div>
              <div class="status pt-4">
                <h2>${currentData.currentDegree}&deg;C</h2>
                <p>${currentData.currentStatus}</p>
              </div>
              <div class="row mt-5">
                <div class="col-md-4">
                  <div class="wind">
                    <h6>Wind</h6>
                    <p>${currentData.currentWindSpeed}</p>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="humidity">
                    <h6>Humidity</h6>
                    <p>${currentData.currentHumidity}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  `

  const secondContainer = `
    <h2>3-Day Forecast</h2>
    <div class="col-md-4">
            <div class="item">
              <img class="forecast-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCZnc3tmQ99QeC_bpD0QAbWmJfkGmNi9_d1zqpv8wAzXYv228TFTNiQwKtwNH0wbkwMokEKBCNrp5YDAZs5VEEE_ShTcil2RJ_aHyYuDHpp0CRWXQYsEUBEC3hYZzfzsDoscPdFExSTBOBzrKxwgMy1eZMBBQAVYGRt1kuNmUwUrWwOHFJPtvLcYPMW6vQdk3a0T4X45AhLeB_3XmuskbDrxrrurz7SfvnNv8w4x0_Iy9gKF2j8ZrFBv4At5Ek9Gaum4vL4FNfKj8"
                alt="Tomorrow">
              <div class="caption ps-1">
                <h4>Tomorrow</h4>
                <p>${data.daily.temperature_2m_max[1]}&deg;C / ${data.daily.temperature_2m_min[1]}&deg;C</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="item">
              <img class="forecast-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNYqAUIXGwlTZmGQioAYSgA4wOEA8HMnrHBtUunFTwUdnBakX_IWtAsG1xu2Ay_pmhFSt-yJAI0GxOI4TsqCnRQ0bDpA_teD8XpsKqWT4VHfV72Xxeb4bD86ZyTdMNlwxpxaXp5Xub-qYzu58Qb7lkLrsoF7PmgWif-eleDjg0F6dLeBMQ2SrxRiG6ct4jLyR1oWn-Xh5V8nbsAmnR3vvlBFYHnFSdIJwCjf5XRX-uqrO6QL7KEDFnoGRUtGjx14lAU5qlIr4is8"
                alt="after tomorrow">
              <div class="caption ps-1">
                <h4>${afterTomrrowDayName}</h4>
                <p>${data.daily.temperature_2m_max[2]}&deg;C / ${data.daily.temperature_2m_min[2]}&deg;C</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="item">
              <img class="forecast-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIrxNB-m6ywF78e9y_kuGmMn4STbL4MaAfoIWEIIVHkmEYkRNXiPWJGnkm3lQ4MnlNNI5iGsT08bmpBg8f2oc39uuQ_q-Cu2F65Tzzi1gx7VQlvmC5NY7JyWNmGrKhyrhrtZunJIibsGFKg48XCJWMXBLDPv_cay5T_9A7BUwjE7I8K-iztfK2fRhcJLG_fQaLkxvF2YgWmPKcXMo7a-bDoyXDoTgJOlB8B_A71v1qecs-9eM4Qc8iNL87CJJkemGhXxDSIZKeDtU"
                alt="Tomorrow">
              <div class="caption ps-1">
                <h4>${afterAfterTomrrowDayName}</h4>
                <p>${data.daily.temperature_2m_max[3]}&deg;C / ${data.daily.temperature_2m_min[3]}&deg;C</p>
              </div>
            </div>
          </div>
  `

  rowDisplay.innerHTML = firstContainer;
  forecastDisplay.innerHTML = secondContainer;
}






