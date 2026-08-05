/**
 * ui.js
 * Traduce los códigos de clima (WMO) de Open-Meteo a texto/ícono,
 * y renderiza los distintos paneles del dashboard.
 */

/** Tabla simplificada de códigos WMO → { texto, ícono } */
const WEATHER_CODES = {
  0: { text: "cielo despejado", icon: "☀️" },
  1: { text: "mayormente despejado", icon: "🌤️" },
  2: { text: "parcialmente nublado", icon: "⛅" },
  3: { text: "nublado", icon: "☁️" },
  45: { text: "niebla", icon: "🌫️" },
  48: { text: "niebla helada", icon: "🌫️" },
  51: { text: "llovizna leve", icon: "🌦️" },
  53: { text: "llovizna moderada", icon: "🌦️" },
  55: { text: "llovizna intensa", icon: "🌧️" },
  61: { text: "lluvia leve", icon: "🌧️" },
  63: { text: "lluvia moderada", icon: "🌧️" },
  65: { text: "lluvia intensa", icon: "🌧️" },
  71: { text: "nevada leve", icon: "🌨️" },
  73: { text: "nevada moderada", icon: "🌨️" },
  75: { text: "nevada intensa", icon: "❄️" },
  80: { text: "chubascos leves", icon: "🌦️" },
  81: { text: "chubascos moderados", icon: "🌧️" },
  82: { text: "chubascos intensos", icon: "⛈️" },
  95: { text: "tormenta eléctrica", icon: "⛈️" },
  96: { text: "tormenta con granizo", icon: "⛈️" },
  99: { text: "tormenta con granizo intensa", icon: "⛈️" },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { text: "sin datos", icon: "❔" };
}

/** Actualiza el mensaje de estado (carga / error / vacío) */
function setStatusMessage(text, isError = false) {
  const el = document.getElementById("statusMsg");
  el.textContent = text;
  el.classList.toggle("is-error", isError);
}

/** Muestra u oculta los paneles principales */
function togglePanels(visible) {
  document.getElementById("currentPanel").hidden = !visible;
  document.getElementById("hourlySection").hidden = !visible;
  document.getElementById("dailySection").hidden = !visible;
}

/** Dibuja el dial circular de temperatura (rango asumido -10°C a 45°C) */
function renderDial(temp) {
  const min = -10;
  const max = 45;
  const clamped = Math.min(Math.max(temp, min), max);
  const percent = (clamped - min) / (max - min);

  const circumference = 553; // 2 * PI * 88
  const offset = circumference - percent * circumference;

  document.getElementById("dialProgress").style.strokeDashoffset = offset;
  document.getElementById("currentTemp").textContent = `${Math.round(temp)}°`;
}

/** Renderiza el panel de clima actual */
function renderCurrent(city, current, timezone) {
  const info = getWeatherInfo(current.weather_code);

  document.getElementById("cityName").textContent = `${city.name}, ${city.country}`;

  // Usamos la timezone real que devuelve Open-Meteo para esa ubicación,
  // no la del navegador de quien mira la página, así el horario mostrado
  // es siempre el del lugar consultado (ej: si buscás Tokio, ves hora de Tokio).
  const localTimeText = new Date().toLocaleString("es-AR", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("cityMeta").textContent = `${localTimeText} (hora local)`;

  document.getElementById("currentDesc").textContent = info.text;
  document.getElementById("feelsLike").textContent = `${Math.round(current.apparent_temperature)}°`;
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("wind").textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  renderDial(current.temperature_2m);
}

/** Renderiza las próximas horas (se muestran 8, salteando la hora actual) */
function renderHourly(hourly, startIndex) {
  const container = document.getElementById("hourlyList");
  const slice = hourly.time.slice(startIndex, startIndex + 8);

  container.innerHTML = slice
    .map((time, i) => {
      const idx = startIndex + i;
      const info = getWeatherInfo(hourly.weather_code[idx]);
      const hour = new Date(time).toLocaleTimeString("es-AR", { hour: "2-digit" });

      return `
        <div class="hourly-card">
          <p class="hourly-time">${hour}</p>
          <p class="hourly-icon">${info.icon}</p>
          <p class="hourly-temp">${Math.round(hourly.temperature_2m[idx])}°</p>
        </div>
      `;
    })
    .join("");

  document.querySelector("#hourlySection .panel-title").textContent =
    "Próximas horas";
}

/** Renderiza el pronóstico de 5 días (se salta el día 0, que es hoy) */
function renderDaily(daily) {
  const container = document.getElementById("dailyList");
  const days = daily.time.slice(1, 6);

  container.innerHTML = days
    .map((date, i) => {
      const idx = i + 1;
      const info = getWeatherInfo(daily.weather_code[idx]);
      const dayName = new Date(date).toLocaleDateString("es-AR", { weekday: "short" });

      return `
        <div class="daily-card">
          <p class="daily-day">${dayName}</p>
          <p class="daily-icon">${info.icon}</p>
          <div class="daily-range">
            <span class="max">${Math.round(daily.temperature_2m_max[idx])}°</span>
            <span class="min">${Math.round(daily.temperature_2m_min[idx])}°</span>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelector("#dailySection .panel-title").textContent = "Próximos 5 días";
}

/** Encuentra el índice de la hora actual dentro del array horario */
function findCurrentHourIndex(hourlyTimes) {
  const now = new Date();
  return hourlyTimes.findIndex((t) => new Date(t) >= now);
}
