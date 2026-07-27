# Estación — Dashboard del clima

Proyecto de portfolio: un dashboard de clima en tiempo real construido con **HTML, CSS y JavaScript puro**, que consume la API pública de [Open-Meteo](https://open-meteo.com) — **no requiere API key**, ideal para un proyecto que cualquiera pueda clonar y correr sin configuración.

## Funcionalidades

- Búsqueda de clima por nombre de ciudad (geocoding).
- Detección de ubicación del navegador (`navigator.geolocation`).
- Panel principal con dial circular de temperatura (SVG), sensación térmica, humedad, viento y máx/mín del día.
- Pronóstico de las próximas 8 horas.
- Pronóstico de los próximos 5 días.
- Traducción de los códigos de clima (WMO) a texto e íconos en español.
- Manejo de estados de carga y error.

## Stack

- HTML5 semántico
- CSS3 (variables, Grid, Flexbox, SVG animado con `stroke-dashoffset`)
- JavaScript (ES6+, `fetch`, `async/await`, Geolocation API)
- [Open-Meteo](https://open-meteo.com) — Forecast API + Geocoding API (gratuitas, sin registro)

## Estructura del proyecto

```
proyecto2-clima/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js   → llamadas a Open-Meteo (geocoding + forecast)
│   ├── ui.js    → mapeo de códigos de clima y renderizado de paneles
│   └── app.js   → orquestación: búsqueda, geolocalización, flujo principal
└── README.md
```

## Cómo correrlo localmente

Abrí `index.html` directamente en el navegador, o serví la carpeta con una extensión tipo Live Server. La app necesita conexión a internet para consultar la API.

---

## Plan de desarrollo (etapas de commits)

1. **`chore: estructura inicial del proyecto`**
   Carpetas `css/` y `js/`, `index.html` con el esqueleto (topbar, panel principal vacío, secciones de pronóstico).

2. **`style: paleta e identidad visual del dashboard`**
   Variables CSS, tipografías (Space Grotesk / IBM Plex Sans / Plex Mono), fondo tipo grilla de instrumento.

3. **`feat: conexión con Open-Meteo (geocoding + forecast)`**
   Se agrega `js/api.js`: `geocodeCity`, `fetchWeather`, `getBrowserLocation`.

4. **`feat: mapeo de códigos de clima y helpers de UI`**
   Se agrega `js/ui.js`: tabla `WEATHER_CODES`, funciones de estado y toggling de paneles.

5. **`feat: panel de clima actual con dial de temperatura`**
   Renderizado del dial SVG, temperatura, sensación térmica, humedad y viento.

6. **`feat: pronóstico horario`**
   Cálculo del índice de la hora actual y render de las próximas 8 horas.

7. **`feat: pronóstico de 5 días`**
   Render de la sección diaria con íconos y rango de temperaturas.

8. **`feat: búsqueda por ciudad y geolocalización`**
   Se agrega `js/app.js`: conecta el formulario de búsqueda y el botón de "Mi ubicación" con el resto de la app.

9. **`feat: manejo de errores y estados de carga`**
   Mensajes de estado para búsquedas fallidas, ciudad no encontrada, sin conexión, geolocalización denegada.

10. **`style: responsive y pulido visual`**
    Ajustes para mobile, scroll horizontal del pronóstico por hora, `prefers-reduced-motion`.

11. **`docs: README final`**
    Documentación completa del proyecto.

---

## Autor

**Emanuel Mendez** 🇦🇷
