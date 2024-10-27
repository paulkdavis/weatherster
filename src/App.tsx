import './App.css';
import { useEffect, useState } from 'react';
import WeatherOverview from './components/WeatherOverview';
import { Weather } from './constants/Weather';
import WeatherModel from './models/WeatherModel';
import LocationModel from './models/LocationModel';
import WeatherService from './services/WeatherService';
import LocationService from './services/LocationService';
import WeatherDetails from './components/WeatherDetails';

function App() {
  // Environment variable checks
  const apiKey = process.env.REACT_APP_OpenWeatherAPIKey || '';
  const locationAPIKey = process.env.REACT_APP_HereAPIKey || '';

  if (!apiKey || !locationAPIKey) {
    throw new Error('API keys not set in environment variables');
  }

  // State management
  const [weatherModel, setWeatherModel] = useState<WeatherModel | null>(null);
  const [location, setLocation] = useState<LocationModel>(
    new LocationModel('New York City', 'New York', 'USA')
  );

  // Services initialization
  const weatherService = new WeatherService(apiKey);
  const locationService = new LocationService(locationAPIKey);

  // Handle geolocation success
  const handleGeolocationSuccess = async (pos: GeolocationPosition) => {
    const crd = pos.coords;
    try {
      const newLocation = await locationService.fetchLocation({
        latitude: crd.latitude,
        longitude: crd.longitude
      });
      setLocation(newLocation);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  // Handle geolocation error
  const handleGeolocationError = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  // Fetch location effect
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const checkGeolocationPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "granted" || result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            handleGeolocationSuccess,
            handleGeolocationError,
            options
          );
        }
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
      }
    };

    checkGeolocationPermission();
  }, []); // Empty dependency array as this should only run once

  // Fetch weather effect
  useEffect(() => {
    const fetchWeather = async () => {
      const fetchMethods = [
        () => location?.toString(),
        () => location?.getSimplifiedString(),
        () => location?.getCity()
      ];

      for (const method of fetchMethods) {
        try {
          const locationString = method();
          if (locationString) {
            const weatherData = await weatherService.fetchWeather(locationString);
            console.log(weatherData);
            setWeatherModel(weatherData);
            return; // Exit after successful fetch
          }
        } catch (error) {
          console.warn('Attempt to fetch weather failed:', error);
        }
      }

      console.error('All attempts to fetch weather failed');
    };

    fetchWeather();
  }, [location]); // Only re-run when location changes

  const handleLocationChange = (newLocation: string) => {
    setLocation(new LocationModel(newLocation, '', '')); // Or however you want to handle the new location
  };

  return (
    <div className="">
      <WeatherOverview
        location={location?.toString() || ''}
        weather={weatherModel}
        onLocationChange={handleLocationChange}
      />
      <WeatherDetails 
        weather={weatherModel}
      />
    </div>
  );
}

export default App;