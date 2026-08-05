/**
 * app.js
 * Orquesta el flujo completo: buscar ciudad o usar geolocalización,
 * pedir el clima y renderizar todos los paneles.
 */

/** Carga y muestra el clima para una ciudad (por nombre) */
async function loadWeatherByCity(cityName) {
  setStatusMessage(`Buscando "${cityName}"…`);
  togglePanels(false);

  try {
    const city = await geocodeCity(cityName);

    if (!city) {
      setStatusMessage(`Che, no encontramos "${cityName}". Probá con otro nombre.`, true);
      return;
    }

    await loadWeatherByCoords(city.latitude, city.longitude, city);
  } catch (error) {
    setStatusMessage("Se cortó algo buscando la ciudad. Probá de nuevo.", true);
    console.error(error);
  }
}

/** Carga y muestra el clima para coordenadas puntuales */
async function loadWeatherByCoords(latitude, longitude, cityOverride = null) {
  setStatusMessage("Cargando el clima, un cachito…");

  try {
    const data = await fetchWeather(latitude, longitude);

    const city = cityOverride || { name: "Tu ubicación", country: "" };

    renderCurrent(city, data.current, data.timezone);

    const startIndex = findCurrentHourIndex(data.hourly.time);
    renderHourly(data.hourly, startIndex === -1 ? 0 : startIndex);

    renderDaily(data.daily);

    setStatusMessage("");
    togglePanels(true);
  } catch (error) {
    setStatusMessage("No pudimos traer el clima. Probá de nuevo más tarde.", true);
    console.error(error);
  }
}

/** Conecta el formulario de búsqueda */
function setupSearch() {
  const form = document.getElementById("searchForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("citySearch");
    const value = input.value.trim();

    if (value) loadWeatherByCity(value);
  });
}

/** Conecta el botón de geolocalización */
function setupGeoButton() {
  const button = document.getElementById("geoBtn");

  button.addEventListener("click", async () => {
    setStatusMessage("Buscando dónde estás parado, aguantá…");

    try {
      const coords = await getBrowserLocation();
      await loadWeatherByCoords(coords.latitude, coords.longitude);
    } catch (error) {
      setStatusMessage(error.message, true);
    }
  });
}

/** Punto de entrada: carga una ciudad por defecto para no arrancar vacío */
function init() {
  setupSearch();
  setupGeoButton();
  loadWeatherByCity("Buenos Aires");
}

document.addEventListener("DOMContentLoaded", init);
