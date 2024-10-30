import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Hourly({ city, triggerLoad }: any) {
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;

  const fetchWeatherByLocation = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        //`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const forecasts = response.data.list;
      const hourlyForecast: any = [];

      forecasts.forEach((forecast: any) => {
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        const presentDate = new Date();

        const formattedDate = date.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });

        if (date.getDay() === presentDate.getDay()) {
          hourlyForecast.push({
            date: formattedDate,
            hour: hours - 1,
            temperature: Math.round(forecast.main.temp),
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon,
            wind: Math.round(forecast.wind.speed),
          });
        }
        setHourlyForecasts(hourlyForecast);
        //console.log(hourlyForecasts)
      });

      //console.log(hourlyForecast)
      //console.log(response.data.list);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
 
  const fetchData = async () => {
    if(city){
        try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
            );
            const forecasts = response.data.list;
            const hourlyForecast: any = [];
      
            forecasts.forEach((forecast: any) => {
              const date = new Date(forecast.dt * 1000);
              const hours = date.getHours();
              const presentDate = new Date();
      
              const formattedDate = date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
              });
      
              if (date.getDay() === presentDate.getDay()) {
                hourlyForecast.push({
                  date: formattedDate,
                  hour: hours - 1,
                  temperature: Math.round(forecast.main.temp),
                  description: forecast.weather[0].description,
                  icon: forecast.weather[0].icon,
                  wind: Math.round(forecast.wind.speed),
                });
              }
      
              setHourlyForecasts(hourlyForecast);
            });

          } catch (error) {
            console.log(error);
          }
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

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

    getLocation(); 
  }, [triggerLoad]);

  return (
    <div className="w-[100%] md:w-[70%] shadow-[10px_10px_20px_rgba(0,0,0,0.5)] bg-[#D9D9D9] rounded-2xl p-8 font-bold dark:bg-[#444444] dark:text-white">
      <p className="text-2xl text-center mb-4">Hourly Forecast:</p>
      <Box display="flex">
        {hourlyForecasts.map((hourForecast: any, index) => {
          return (
            <div
              key={index}
              className="mr-4 flex flex-col items-center gap-2 bg-gradient-to-b from-[#F88508] to-[#F6FAD900] dark:from-[#373636] dark:to-[#373636] px-3 py-2 rounded-3xl "
            >
              <p>{hourForecast.hour}:00</p>
              <img
                src={`http://openweathermap.org/img/wn/${hourForecast.icon}.png`}
                alt="weather-icon"
              />
              <p>{hourForecast.temperature}°C</p>
              <p>{hourForecast.wind}km/h</p>
            </div>
          );
        })}
      </Box>
     
    </div>
  );
}
