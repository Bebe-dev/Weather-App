
import "../App.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Dailyly({ city, triggerLoad }: any) {
  const apiKey = import.meta.env.VITE_API_KEY; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const [dailyForecasts, setDailyForecasts] = useState([]);

  const fetchWeatherByLocation = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const forecasts = response.data.list;
      const dailyForecast: any = [];

      forecasts.forEach((forecast: any) => {
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();

        const formattedDate = date.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });

        if (hours - 1 === 12) {
          dailyForecast.push({
            date: formattedDate,
            hour: hours - 1,
            temperature: Math.round(forecast.main.temp),
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon,
            wind: Math.round(forecast.wind.speed),
          });
        }
        setDailyForecasts(dailyForecast);
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };


  useEffect(() => {
    if (city) {
        axios
          .get(apiUrl)
          .then((response) => {
           
            const forecasts = response.data.list;
            const dailyForecast: any = [];
    
            // Extract one forecast per day (around midday)
            forecasts.forEach((forecast: any) => {
              const date = new Date(forecast.dt * 1000);
              const hours = date.getHours();
    
              const formattedDate = date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
              });
    
              if (hours - 1 === 12) {
                // Get midday forecast (12:00 PM)
                dailyForecast.push({
                  date: formattedDate,
                  temperature: Math.round(forecast.main.temp),
                  description: forecast.weather[0].description,
                  icon: forecast.weather[0].icon,
                });
              }
    
              setDailyForecasts(dailyForecast);
            });
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
          });
      }
  }, [city])

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByLocation(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    //setDailyTrigger(false)
    getLocation();
  }, [triggerLoad]);

  return (
    <div className="flex gap-10 font-bold text-xl shadow-[10px_10px_20px_rgba(0,0,0,0.5)] bg-[#D9D9D9] rounded-2xl p-8 dark:bg-[#444444] dark:text-white w-[100%] md:w-[50%]">
      <div className="">
        <p>5 Days Forecast:</p>
        {dailyForecasts.map((dayForecast: any, index) => {
          return (
            <div key={index} className="flex gap-4 md:gap-14 justify-between items-center">
              <img
                src={`http://openweathermap.org/img/wn/${dayForecast.icon}.png`}
                alt="weather-icon"
              />
              
              <p>{dayForecast.temperature}°C</p>
             
              <p className="text-base">{dayForecast.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
