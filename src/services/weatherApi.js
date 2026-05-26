const WEATHER_LABELS = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
};

function weatherCodeToLabel(code) {
  return WEATHER_LABELS[code] ?? "Unknown";
}

/** Raw API response → clean object for the UI */
export function formatWeatherResponse(location, forecast) {
  const { current, daily } = forecast;

  const forecastDays = daily.time.map((date, index) => ({
    day: new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    high: Math.round(daily.temperature_2m_max[index]),
    low: Math.round(daily.temperature_2m_min[index]),
    condition: weatherCodeToLabel(daily.weather_code[index]),
  }));

  return {
    city: location.name,
    country: location.country,
    region: location.admin1 ?? "",
    locationLine: [location.name, location.admin1, location.country]
      .filter(Boolean)
      .join(", "),
    coordinates: `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    condition: weatherCodeToLabel(current.weather_code),
    updatedAt: new Date(current.time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    forecast: forecastDays,
  };
}

export async function fetchWeatherByCity(cityName) {
  const query = cityName.trim();

  if (!query) {
    throw new Error("Please enter a city name.");
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("Could not search for that city. Please try again.");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results?.length) {
    throw new Error(`No results for "${query}". Try Delhi, Mumbai, or London.`);
  }

  const location = geoData.results[0];

  const forecastParams = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5",
  });

  const forecastResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?${forecastParams}`
  );

  if (!forecastResponse.ok) {
    throw new Error("Failed to fetch weather data from the API.");
  }

  const forecastData = await forecastResponse.json();

  return formatWeatherResponse(location, forecastData);
}
