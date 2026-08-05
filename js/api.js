/**
 * api.js
 * Acceso a Open-Meteo (https://open-meteo.com), que no requiere API key.
 * Se usan dos endpoints: geocoding (buscar ciudad → lat/lon) y forecast
 * (clima actual + pronóstico horario y diario).
 */

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Busca coordenadas a partir de un nombre de ciudad.
 * @param {string} cityName
 * @returns {Promise<{name:string, country:string, latitude:number, longitude:number}|null>}
 */
async function geocodeCity(cityName) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al buscar la ciudad: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const result = data.results[0];
  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

/**
 * Trae el clima actual + pronóstico horario y diario para una coordenada.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>}
 */
async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
    hourly: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: "auto",
    forecast_days: 6,
  });

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el clima: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtiene la ciudad más cercana a partir de coordenadas del navegador
 * usando geocoding inverso simple: pedimos el clima directo, y usamos
 * "Mi ubicación" como nombre ya que Open-Meteo no incluye reverse geocoding gratuito.
 */
function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Tu navegador no te deja usar la geolocalización."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => reject(new Error("No te pudimos ubicar. Buscá tu ciudad a mano."))
    );
  });
}
