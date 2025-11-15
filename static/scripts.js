document.getElementById("weatherForm").addEventListener("submit", function (event) {
  event.preventDefault();      // Stop form from refreshing page
  getWeather();                // Call your function
});

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = '4cf02bb577013d8b9e6c77975715b627';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod == 200) {
      const condition = data.weather[0].main;

      // Reset background
      document.body.className = 'default'; 

      // Weather-specific classes
      if (condition === "Clear") {
        document.body.className = 'sunny';
      } else if (condition === "Rain") {
        document.body.className = 'rainy';
      } else if (condition === "Clouds") {
        document.body.className = 'cloudy';
      }

      // Display result
      console.log(data.weather[0].icon);
      document.getElementById('weatherResult').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Condition: ${data.weather[0].main}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;

    } else {
      document.getElementById('weatherResult').innerHTML =
        `<p style="color:red;">City not found</p>`;
    }

  } catch (error) {
    document.getElementById('weatherResult').innerHTML =
      `<p style="color:red;">Error fetching data</p>`;
  }
}
