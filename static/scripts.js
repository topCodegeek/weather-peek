// ----------------------
// WEATHER FETCH FUNCTION
// ----------------------
async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = '4cf02bb577013d8b9e6c77975715b627';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod == 200) {

      // ----- SET BACKGROUND -----
      const condition = data.weather[0].main;
      document.body.className = 'default';

      if (condition === "Clear") document.body.className = 'sunny';
      else if (condition === "Rain") document.body.className = 'rainy';
      else if (condition === "Clouds") document.body.className = 'cloudy';
      else if (condition === "Haze") document.body.className = 'haze';

      // ----- DISPLAY WEATHER -----
      document.getElementById("weatherResult").classList.remove("fade-in");
      document.getElementById('weatherResult').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><i class="ri-temp-hot-line"></i> Temperature: ${data.main.temp} °C</p>
        <p><i class="ri-water-percent-line"></i> Humidity: ${data.main.humidity}%</p>
        <p><i class="ri-windy-line"></i> Wind Speed: ${data.wind.speed} m/s</p>
        <p><i class="ri-cloud-line"></i> Condition: ${data.weather[0].main}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;
      document.getElementById("weatherResult").classList.add("fade-in"); // Animation add


      // Prepare facts based on condition
      currentFacts = getChemistryFact(condition);

      // Fetch AQI
      getAirQuality(data.coord.lat, data.coord.lon);

      // Show the 2 buttons + content box
      document.getElementById("extraControls").classList.remove("hidden");

    } else {
      document.getElementById('weatherResult').innerHTML =
        `<p style="color:red;">City not found</p>`;
    }

  } catch (error) {
    document.getElementById('weatherResult').innerHTML =
      `<p style="color:red;">Error fetching weather</p>`;
  }
}


// ------------------------------------------
// REAL AQI API FUNCTION
// ------------------------------------------
async function getAirQuality(lat, lon) {
  const apiKey = '4cf02bb577013d8b9e6c77975715b627';
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const aqi = data.list[0].main.aqi;
    const comp = data.list[0].components;

    const meaning = [
      "Good – clean air",
      "Fair – acceptable",
      "Moderate – sensitive groups affected",
      "Poor – unhealthy",
      "Very Poor – hazardous"
    ];

    // Build AQI HTML
    currentAQI = `
      <h3>AQI: ${aqi} – ${meaning[aqi - 1]}</h3>

      <h4>Chemistry of Pollutants</h4>
      <p><b>CO:</b> ${comp.co} μg/m³ – Carbon monoxide</p>
      <p><b>NO₂:</b> ${comp.no2} μg/m³ – Nitrogen dioxide</p>
      <p><b>SO₂:</b> ${comp.so2} μg/m³ – Sulfur dioxide</p>
      <p><b>O₃:</b> ${comp.o3} μg/m³ – Ozone</p>
      <p><b>PM2.5:</b> ${comp.pm2_5} μg/m³</p>
      <p><b>PM10:</b> ${comp.pm10} μg/m³</p>
    `;

    // When AQI loads first time, show it
    extraContent.innerHTML = currentAQI;

  } catch (err) {
    currentAQI = "<p style='color:red;'>Unable to load AQI.</p>";
    extraContent.innerHTML = currentAQI;
  }
}


// ------------------------------------------
function getChemistryFact(condition) {
  if (condition === "Rain") {
    return "Rainwater dissolves CO₂ forming carbonic acid (H₂CO₃). With SO₂/NO₂ it becomes acid rain.";
  }
  if (condition === "Clouds") {
    return "Clouds form when vapor condenses around aerosols — an example of nucleation chemistry.";
  }
  if (condition === "Fog") {
    return "Fog is a colloid: tiny liquid droplets dispersed in a gas (air).";
  }
  if (condition === "Clear") {
    return "Clear skies increase photochemical reactions such as ground-level ozone formation.";
  }
  return "Weather is closely linked with atmospheric chemistry and pollutant reactions.";
}


// ------------------------------------------
// ENABLE ENTER KEY WITHOUT PAGE RELOAD
// ------------------------------------------
document.getElementById("weatherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather();
});


// ------------------------------------------
// TABS (AQI / FACTS)
// ------------------------------------------
const btnAQI = document.getElementById("btnAQI");
const btnFacts = document.getElementById("btnFacts");
const extraContent = document.getElementById("extraContent");

let currentAQI = "";
let currentFacts = "";

// AQI button
btnAQI.addEventListener("click", () => {
  btnAQI.classList.add("active");
  btnFacts.classList.remove("active");
  extraContent.innerHTML = currentAQI;
});

// Facts button
btnFacts.addEventListener("click", () => {
  btnFacts.classList.add("active");
  btnAQI.classList.remove("active");
  extraContent.innerHTML = currentFacts;
});
