import { Weather } from "../constants/Weather";

interface clouds{
    all: number
}

interface weather{
    description: string,
    icon: string,
    id: number,
    main: string
}

interface wind{
    deg: number
    speed: number
}

class WeatherModel{

    private clouds: clouds;

    private humidity: number;
    private pressure: number;
    private temperature: number;
    private minTemperature: number;
    private maxTemperature: number;

    private sunrise: number;
    private sunset: number;

    private visibility: number;

    private weather: weather[];

    private wind: wind;

    constructor(clouds: clouds, main: any, sys: any, visibility: number, weather: weather[], wind: wind) {
        this.clouds = clouds;

        this.humidity = main.humidity;
        this.pressure = main.pressure;
        this.temperature = main.temp;
        this.minTemperature = main.temp_min;
        this.maxTemperature = main.temp_max;

        this.sunrise = sys.sunrise;
        this.sunset = sys.sunset;

        this.visibility = visibility;
        
        this.weather = weather;

        this.wind = wind;
    }

    public getPrimaryWeather(): Weather {
        const primaryWeatherString = this.weather[0].main;

        switch(primaryWeatherString) {
            case 'Clear':
                return Weather.sunny;
            case 'Clouds':
                if(this.visibility <= 1000){
                    return Weather.foggy
                }
                return Weather.cloudy;
            case 'Drizzle':
                return Weather.rainy;
            case 'Rain':
                return Weather.rainy;
            case 'Snow':
                return Weather.snowy;
            case 'Thunderstorm':
                return Weather.thunderstorm;
            default:
                return Weather.cloudy;
        }
    }

    public getCurrentTemperature(): number {
        return Math.round(this.temperature);
    }

    public getCurrentWind(): wind {
        return this.wind;
    }

}

export default WeatherModel;