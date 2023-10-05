import React from 'react'
import { useState, useEffect } from 'react';
import HomeCSS from './home.module.css'

function Home() {
    const [location, setLocation] = useState('');
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [showLocationAlert, setShowLocationAlert] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    const formatTime = (time) => {
        const hour = parseInt(time.split(' ')[1].split(':')[0]);
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour} ${amPm}`;
    };

    const getWeatherData = async () => {
        try {
            if (location.trim() === '') {
                setShowLocationAlert(true);
                return;
            }

            setShowLocationAlert(false);

            const apiKey = '4509b54495474fc29b9160316232809';
            const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&alerts=yes`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) {
                alert('Location not found. Please try again.');
            } else {
                setWeatherInfo(data);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
    }, [location]);

    const toggleDayDetails = (index) => {
        setSelectedDay(selectedDay === index ? null : index);
    };

    return (
        <div className={HomeCSS.home_body}>
            <div className={HomeCSS.App}>
                <h1>Weather Information</h1>
                <label htmlFor="location">Enter Location: </label>
                <input
                    type="text"
                    id="location"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={getWeatherData}>Get Weather</button>

                {showLocationAlert && <p>Please enter a location.</p>}

                {weatherInfo && (
                    <div id="weatherInfo">
                        <h2>Weather - {weatherInfo.location.name}, {weatherInfo.location.region}, {weatherInfo.location.country}</h2>
                        <p>As of {new Date(weatherInfo.current.last_updated_epoch * 1000).toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT</p>

                        <h3>Alerts:</h3>
                        {weatherInfo.alerts && (
                            <div className="alert">
                                <p>{weatherInfo.alerts.alert[0].headline}</p>
                                <p>Severity: {weatherInfo.alerts.alert[0].severity}</p>
                                <p>Areas: {weatherInfo.alerts.alert[0].areas}</p>
                                <p>Instruction: {weatherInfo.alerts.alert[0].instruction}</p>
                            </div>
                        )}

                        <div className={HomeCSS.currentWeather}>
                            <h3>Current Weather</h3>
                            <img src={weatherInfo.current.condition.icon} alt="Weather Icon" />
                            <p>{weatherInfo.current.condition.text}</p>
                            <p>Temperature: {weatherInfo.current.temp_f}°F</p>
                            <p>Precipitation: {weatherInfo.current.precip_in} in</p>
                            <p>Wind: {weatherInfo.current.wind_mph} mph, {weatherInfo.current.wind_dir}</p>
                        </div>

                        {weatherInfo.forecast.forecastday.map((day, index) => (
                            <div key={index} className={HomeCSS.dayCard} onClick={() => toggleDayDetails(index)}>
                                <div className={HomeCSS.daySummary}>
                                    <p>{new Date(day.date_epoch * 1000 + 86400000).toLocaleDateString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p>{day.day.condition.text}</p>
                                    <p>{day.day.maxtemp_f}°F/{day.day.mintemp_f}°F</p>
                                    <p>Precip: {day.day.daily_chance_of_rain}%</p>
                                    <p>Wind: {day.day.maxwind_mph} mph</p>
                                </div>
                                {selectedDay === index && (
                                    <div className={HomeCSS.dayDetails}>
                                        <h3>Hourly Forecast</h3>
                                        <div className={HomeCSS.hourlyForecastContainer}>
                                            <div className={HomeCSS.hourlyForecast}>
                                                {day.hour.map((hourData, hourIndex) => (
                                                    <div className={HomeCSS.hourlyForecastItem} key={hourIndex}>
                                                        <div className={HomeCSS.hourlyTime}><strong>{formatTime(hourData.time)}</strong></div>
                                                        <div className={HomeCSS.hourlyIcon}><img src={hourData.condition.icon} alt="Weather Icon" /></div>
                                                        <div className={HomeCSS.hourlyTemp}>{hourData.temp_f}°F</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}

export default Home