import React from 'react';
import { Sky } from "../constants/weatherColor";
import { Weather } from "../constants/Weather";
import WeatherModel from "../models/WeatherModel";
import { useEffect, useState } from 'react';

// Views
import Rain from './3D/Rain';
import Snow from './3D/Snow';
import Sun from './3D/Sun';
import Cloud from './3D/Cloud';
import TemperatureWidget from './Widgets/TemperatureWidget';
import WindWidget from './Widgets/WindWidget';

interface WeatherOverviewProps {
  location: string;
  weather: WeatherModel | null;
  onLocationChange?: (newLocation: string) => void;
}

function WeatherOverview({ location, weather, onLocationChange }: WeatherOverviewProps) {
  // State
  const [skyColor, setSkyColor] = useState(Sky.sunny);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [localLocation, setLocalLocation] = useState(location);

  // Update local location when prop changes
  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  // Handle input change (just updates local state)
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocalLocation(newLocation);
  };

  // Handle completing the edit
  const handleEditComplete = () => {
    setIsEditingLocation(false);
    if (onLocationChange && localLocation !== location) {
      onLocationChange(localLocation);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    handleEditComplete();
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      handleEditComplete();
    }
  };

  //Set sky color
  useEffect(() => {
    const primaryWeather = weather?.getPrimaryWeather();
    switch(primaryWeather) {
      case Weather.cloudy:
        setSkyColor(Sky.cloudy);
        break;
      case Weather.foggy:
        setSkyColor(Sky.foggy);
        break;
      case Weather.night:
        setSkyColor(Sky.night);
        break;
      case Weather.partlyCloudy:
        setSkyColor(Sky.partlyCloudy);
        break;
      case Weather.rainy:
        setSkyColor(Sky.rainy);
        break;
      case Weather.snowy:
        setSkyColor(Sky.snowy);
        break;
      case Weather.sunny:
        setSkyColor(Sky.sunny);
        break;
      case Weather.thunderstorm:
        setSkyColor(Sky.thunderstorm);
        break;
      default:
        return;
    }
  }, [weather]);

  const determineWeatherAnimation = () => {
    const primaryWeather = weather?.getPrimaryWeather();
    switch(primaryWeather) {
      case Weather.cloudy:
        return <Cloud />
      case Weather.foggy:
        return 'FOGGY';
      case Weather.night:
        return 'NIGHT';
      case Weather.partlyCloudy:
        return 'PARTLY CLOUDY';
      case Weather.rainy:
        return <Rain />;
      case Weather.snowy:
        return <Snow />;
      case Weather.sunny:
        return <Sun />;
      case Weather.thunderstorm:
        return 'THUNDERSTORM';
      default:
        return <Cloud />
    }
  }

  return (
    <div id='weather-overview-container' className='fullpage-container' style={{ backgroundColor: skyColor }}>
      <div id='location' className={isEditingLocation ? 'blinking' : ''} onClick={() => setIsEditingLocation(true)}>
        <input
          type='text'
          value={localLocation}
          onChange={handleLocationChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          autoFocus={isEditingLocation}
        />
      </div>
      <div id='weather-scene-container' style={{backgroundColor: skyColor}}>
        {determineWeatherAnimation()}
      </div>
      <WindWidget wind={weather?.getCurrentWind()} /> 
      <TemperatureWidget temperature={weather?.getCurrentTemperature()} />
    </div>
  );
}

export default WeatherOverview;