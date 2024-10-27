import { Weather } from "../constants/Weather";
import WeatherModel from "../models/WeatherModel";
import { Sky } from "../constants/weatherColor";

  class SkyService {
  
    constructor() {
    }
  
    static getSkyColor(weather: Weather): string {
        switch(weather) {
            case Weather.cloudy:
              return (Sky.cloudy);
              break;
            case Weather.foggy:
              return (Sky.foggy);
              break;
            case Weather.night:
              return (Sky.night);
              break;
            case Weather.partlyCloudy:
              return (Sky.partlyCloudy);
              break;
            case Weather.rainy:
              return (Sky.rainy);
              break;
            case Weather.snowy:
              return (Sky.snowy);
              break;
            case Weather.sunny:
              return (Sky.sunny);
              break;
            case Weather.thunderstorm:
              return (Sky.thunderstorm);
              break;
            default:
              return Sky.sunny;
          }
    } 

  }

  export default SkyService;