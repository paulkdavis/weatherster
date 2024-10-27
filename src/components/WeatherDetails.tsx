import React from 'react';
import { Sky } from "../constants/weatherColor";
import { Weather } from "../constants/Weather";
import WeatherModel from "../models/WeatherModel";
import { useEffect, useState } from 'react';
import SkyService from '../services/SkyService';

import { 
    Sunrise,      // Specific sunrise icon
    Sunset,       // Specific sunset icon
    ThermometerSnowflake,  // For temperature low
    ThermometerSun,  // For temperature max
    Droplets,     //For humidity
    Eye,          // For visibility
    Gauge        // For pressure
} from 'lucide-react';

interface WeatherOverviewProps {
  weather: WeatherModel | null;
}

function WeatherDetails({ weather}: WeatherOverviewProps) {
    // Constants

    // State
    

    //Helpers
    // Function to convert Unix timestamp to hours and minutes
    const formatTime = (unixTimestamp: number): string => {
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        
        // Get hours and minutes
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        // Format as HH:MM (24-hour format)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Or if you prefer 12-hour format with AM/PM:
        // return date.toLocaleTimeString('en-US', { 
        //     hour: '2-digit', 
        //     minute: '2-digit',
        //     hour12: true 
        // });
    }

  
  return (
    <div id='weather-details-container' style={{background: `linear-gradient(to bottom, ${SkyService.getSkyColor(weather == null ? Weather.cloudy : weather.getPrimaryWeather())} 0%, #244fb3 100%)`}} className='fullpage-container' >
        <header style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <h1 style={{margin: 0}}>Weather Details</h1>
        </header>

        {/*SUNRISE SUNSET COMPONENT*/}
        <div style={{display: 'flex', width: '100%', justifyContent: 'center', padding: '20px 0px 0px 0px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '25px', width: '100vw', maxWidth: '600px', borderRadius: '5px', backgroundColor: 'white', padding: '20px 10px'}}>
                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><Sunrise /></span> <span>Sunrise</span></span>
                    <span>{formatTime(weather?.getSunrise() || 0)}</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><Sunset /></span> <span>Sunset</span></span>
                    <span>{formatTime(weather?.getSunset() || 0)}</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><ThermometerSnowflake /></span> <span>Min Temperature</span></span>
                    <span>{Math.round(weather?.getMinTemperature() || 0)}°C</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><ThermometerSun /></span> <span>Max Temperature</span></span>
                    <span>{Math.round(weather?.getMaxTemperature() || 0)}°C</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><Droplets /></span> <span>Humidity</span></span>
                    <span>{weather?.getHumidity()}%</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><Gauge /></span> <span>Pressure</span></span>
                    <span>{weather?.getPressure()}hPa</span>
                </span>

                <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 1px', width: 'auto', padding: '5px'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}><span style={{paddingRight: '5px'}}><Eye /></span> <span>Visibility</span></span>
                    <span>{weather?.getVisibility()}m</span>
                </span>
            </div>
        </div>
    </div>
  );
}

export default WeatherDetails;