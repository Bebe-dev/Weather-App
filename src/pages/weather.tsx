import {
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import { CurrentLocation, Search, Sunrise, Sunset } from "tabler-icons-react";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Dailyly from "../features/daily";
import Hourly from "../features/hourly";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const apiKey = import.meta.env.VITE_API_KEY;
  const [triggerLoad, setTriggerLoad] = useState(false);
  const [keyPress, setKeyPress] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = (e: any) => {
    setCity(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchData = async () => {
    if (city) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyPress]);

  //AUTOMATIC

  useEffect(() => {
    const fetchWeatherByLocation = async (
      latitude: number,
      longitude: number
    ) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);

        localStorage.setItem("dataForWeather", response.data);
        //console.log(response.data)
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

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

    setTriggerLoad(false);
    getLocation();
  }, [triggerLoad]);

  const handleClick = () => {
    setTriggerLoad(true);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setKeyPress(city);
    }
  };

  //  TIME CODE

  const formatTime = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000); 
    return date.toLocaleTimeString("en-GB", {
      
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
  };

  //   DATE CODE
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const currentDate = new Date();
      setFormattedDate(
        currentDate.toLocaleDateString(undefined, {
          weekday: "long",
          day: "2-digit",
          month: "short",
        })
      );
    };

    
    updateDate();

    const timerId = setInterval(updateDate, 86400000); 

    return () => clearInterval(timerId);
  }, []);

  return (
    <div
      className={`p-10 bg-gradient-to-br from-[#FFFFFF] to-[#466173] dark:from-[#383838] dark:to-[#9E9E9E00] ${
        darkMode && "dark"
      }`}
    >
      {/* FIRST SECTION */}
      <Flex gap="8">
        <div className="hidden md:block">
          <Switch onChange={toggleDarkMode} />
          <p>Light mode</p>
        </div>
        <Spacer />
        <InputGroup>
          <InputLeftElement>
            <Search />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search for your prefered city..."
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </InputGroup>
        <Spacer />

        <Button
          leftIcon={<CurrentLocation />}
          padding="6"
          px="10"
          borderRadius="3xl"
          bgColor="#4CBB17"
          color="#FFFFFF"
          onClick={handleClick}
          _hover={{bgColor: "black"}}
          _active={{bgColor: "#4CBB17"}}
        >
          Current Location
        </Button>
      </Flex>

      {/* SECOND SECTION */}

      {weatherData && (
        <div className="flex flex-col md:flex-row gap-10 my-10">
          <div className="w-[100%] md:w-[40%] bg-[#D9D9D9] dark:bg-[#444444] dark:text-white rounded-2xl text-center shadow-[10px_10px_20px_rgba(0,0,0,0.5)]">
            <p className="p-14 text-2xl font-bold">{weatherData.name}</p>
            <p className="p-4 text-6xl font-bold">{formatTime(weatherData.dt)}</p>
            <p className="text-md">{formattedDate}</p>
          </div>

          <div className="shadow-[10px_10px_20px_rgba(0,0,0,0.5)] flex justify-between items-center w-[100%] md:w-[60%] bg-[#D9D9D9] rounded-2xl p-8 color-[#292929] dark:bg-[#444444] dark:text-white">
            <div>
              <p className="text-6xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </p>
              <p>
                Feels like:{" "}
                <span className="text-3xl font-bold">
                  {Math.round(weatherData.main.feels_like)}°C
                </span>
              </p>
              <div className="p-4 pt-10">
                <div className="flex items-center gap-2">
                  <Sunrise />
                  <div>
                    <p className="font-bold">Sunrise</p>
                    <p className="font-semibold">
                      {formatTime(weatherData.sys.sunrise)}
                    </p>
                  </div>
                </div>
                {/* SUNSET */}
                <div className="flex items-center gap-2">
                  <Sunset />
                  <div>
                    <p className="font-bold">Sunset</p>
                    <p className="font-semibold">
                      {formatTime(weatherData.sys.sunset)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Spacer />

            <div className="text-center">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                alt="sunny/clear-icon"
                width="200px"
                height="300px"
              />
              <p className="font-bold text-2xl">
                {weatherData.weather[0].main}
              </p>
            </div>
            <Spacer />

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <img
                  src={
                    darkMode
                      ? "images/humidity-dark.svg"
                      : "images/humidity.svg"
                  }
                  alt="humidity-icon"
                />
                <p className="font-bold">{weatherData.main.humidity}%</p>
                <p>Humidity</p>
              </GridItem>

              <GridItem>
                <img
                  src={darkMode ? "images/wind-dark.svg" : "images/wind.svg"}
                  alt="wind-icon"
                />
                <p className="font-bold">{weatherData.wind.speed}km/h</p>
                <p>Wind speed</p>
              </GridItem>

              <GridItem>
                <img
                  src={
                    darkMode
                      ? "images/pressure-dark.svg"
                      : "images/pressure.svg"
                  }
                  alt="pressure-icon"
                />
                <p className="font-bold">{weatherData.main.pressure}hPa</p>
                <p>Pressure</p>
              </GridItem>

              <GridItem>
                <img
                  src={darkMode ? "images/uv-dark.svg" : "images/uv-white.svg"}
                  alt="uv-Icon"
                />
                <p className="font-bold">8</p>
                <p>UV</p>
              </GridItem>
            </Grid>
          </div>
        </div>
      )}

      {/* THIRD SECTION */}
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <Dailyly city={keyPress} triggerLoad={triggerLoad} />
        <Hourly city={keyPress} triggerLoad={triggerLoad} />
      </div>
    </div>
  );
}
