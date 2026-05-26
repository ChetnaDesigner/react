import { useEffect, useState } from "react";
import { fetchWeatherByCity } from "../services/weatherApi";

const DEFAULT_CITY = "Delhi";

function WeatherDemoPage() {
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWeather(city) {
    setLoading(true);
    setError("");

    try {
      const formatted = await fetchWeatherByCity(city);
      setWeather(formatted);
    } catch (err) {
      setWeather(null);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadWeather(cityInput);
  }

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">Weather API</h1>
        <p className="contact-manager__subtitle">
          Live weather from Open-Meteo (free public API). Data is formatted
          before display.
        </p>
      </header>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">Search</span>
          <h2 className="contact-form__title">Find weather by city</h2>
          <p className="contact-form__hint">
            Enter a city name and fetch current conditions plus a 5-day forecast.
          </p>
        </header>

        <form className="weather-search-form" onSubmit={handleSearch}>
          <div className="contact-form__field">
            <label htmlFor="weather-city" className="contact-form__label">
              City name
            </label>
            <div className="weather-search-form__row">
              <input
                id="weather-city"
                type="text"
                className="contact-form__input"
                placeholder="e.g. Mumbai, London, Tokyo"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="contact-form__submit weather-search-form__btn"
                disabled={loading}
              >
                {loading ? "Loading…" : "Get weather"}
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <p className="no-contacts">Fetching weather from API…</p>
        )}

        {error && !loading && (
          <div className="contact-form__alert" role="alert">
            {error}
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-results">
            <article className="weather-current contact-card">
              <header className="contact-card__header">
                <div className="weather-current__icon" aria-hidden="true">
                  {weather.temperature}°
                </div>
              </header>
              <div className="contact-card__body">
                <h3 className="contact-card__name">{weather.locationLine}</h3>
                <p className="contact-card__meta weather-current__condition">
                  {weather.condition}
                </p>
                <p className="contact-card__meta">
                  Feels like {weather.feelsLike}°C · Humidity {weather.humidity}%
                  · Wind {weather.windSpeed} km/h
                </p>
                <p className="contact-card__meta">
                  Coordinates: {weather.coordinates}
                </p>
                <p className="weather-current__updated">
                  Last updated: {weather.updatedAt}
                </p>
              </div>
            </article>

            <h3 className="weather-forecast__title">
              5-day forecast
              <span className="contact-list-section__count">
                {weather.forecast.length}
              </span>
            </h3>

            <div className="contact-list weather-forecast-grid">
              {weather.forecast.map((day) => (
                <article className="contact-card weather-forecast-card" key={day.day}>
                  <div className="contact-card__body">
                    <h4 className="weather-forecast-card__day">{day.day}</h4>
                    <p className="weather-forecast-card__temps">
                      <span className="weather-forecast-card__high">{day.high}°</span>
                      <span className="weather-forecast-card__low"> / {day.low}°</span>
                    </p>
                    <p className="contact-card__meta">{day.condition}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default WeatherDemoPage;
