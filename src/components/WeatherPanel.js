import React, {useState,useEffect} from 'react'
import Form from './Form';
import Card from './Card';
import axios from 'axios'
const WeatherPanel = () => {

    let urlWeather = "https://api.openweathermap.org/data/2.5/weather?appid=2bef9b165bab15dbdcde7de30e206bd5&lang=es";
    let cityUrl = "&q=";
    let urlForecast = "https://api.openweathermap.org/data/2.5/forecast?appid=2bef9b165bab15dbdcde7de30e206bd5&lang=es";

    const[weather,setWeather] = useState([]);
    const[forecast,setForecast] = useState([]);
    const[loading,setLoading] = useState(false);
    const[show,setShow] = useState(false);
    const[location,setLocation] = useState("");
    const [cache, setCache] = useState({});


    useEffect(() => {
        console.log("esta es la cache",cache)
    const cacheInterval = setInterval(() => {
        const newCache = {};
        Object.entries(cache).forEach(([city, data]) => {
        if (Date.now() - data.timestamp < 120000) {
            newCache[city] = data;
        }
        });
        setCache(newCache);
    }, 60000);

    return () => clearInterval(cacheInterval);
    }, [cache]);


    const getLocation = async (loc) => {
        
        let weatherCache = [];
        let forecastCache = [];

        
        setLoading(true);
        setLocation(loc);
        
        if (cache[loc] && Date.now() - cache[loc].timestamp < 120000) {
            setWeather(cache[loc].currentWeather);
            setForecast(cache[loc].forecast);
            setLoading(false);
            setShow(true);
            return;
        }

        urlWeather = urlWeather + cityUrl + loc;

        await fetch(urlWeather).then((response) => {
            if(!response.ok) throw {response}
            return response.json();
        }).then((weatherData) => {
            setWeather(weatherData);
            weatherCache = weatherData;
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            setShow(false);
        })
        //Forecast
        urlForecast = urlForecast + cityUrl + loc;
        await fetch(urlForecast).then((response) =>{
            if(!response.ok) throw {response}
            return response.json();
        }).then((forecastData) =>{
            setForecast(forecastData);
            forecastCache = forecastData;
            console.log("forecastcache",forecastCache);
            setLoading(false);
            setShow(true);
        }).catch(error =>{
            console.log(error);
            setLoading(false);
            setShow(false);
        });
        setCache({
            ...cache,
            [loc]: {
            timestamp: Date.now(),
            currentWeather: weatherCache,
            forecast: forecastCache,
        },
  });

    }
 
    return (
        <React.Fragment>
            <Form
                newLocation = {getLocation}
            />
            <Card
                showData = {show}
                loadingData = {loading}
                weather = {weather}
                forecast = {forecast}
            />
        </React.Fragment>
    )
}

export default WeatherPanel