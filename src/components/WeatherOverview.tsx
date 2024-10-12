import React from 'react';
import { Sky } from "../constants/weatherColor";
import { Weather } from "../constants/Weather";

interface WeatherOverviewProps {
  weather: Weather;
}

function WeatherOverview({ weather }: WeatherOverviewProps) {
  // Determine sky color according to weather
  const skyColor = Sky.sunny;

  return (
    <div className='fullpage-container' style={{ backgroundColor: skyColor }}>
      <h1>{Weather[weather].substring(0, 1).toUpperCase() + Weather[weather].substring(1, Weather[weather].length)}</h1>
      <p>The sky is {skyColor} today.</p>
    </div>
  );
}

export default WeatherOverview;