import WeatherModel from "../models/WeatherModel";

  class WeatherService {
    private apiKey: string;
    private baseUrl: string = "https://api.openweathermap.org/data/2.5/weather";

    private weather: WeatherModel | undefined;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    async fetchWeather(location: string | undefined): Promise<WeatherModel | null> {
      const url = `${this.baseUrl}?q=${location}&appid=${this.apiKey}&units=metric`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('weather');
        console.log(data);

        const theWeather = new WeatherModel(data.clouds, data.main, data.sys, data.visibility, data.weather, data.wind);
        this.weather = theWeather;        
        return theWeather;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
      }
    }

  }

  export default WeatherService;