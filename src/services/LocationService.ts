import LocationModel from "../models/LocationModel";

interface Coordinates{
    longitude: number,
    latitude: number
}

class LocationService {
    private apiKey: string;
    private baseUrl: string = "https://revgeocode.search.hereapi.com/v1/revgeocode";

    private location: LocationModel | undefined;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

  
    async fetchLocation(coords: Coordinates): Promise<LocationModel> {
      const url = `${this.baseUrl}?at=${coords.latitude},${coords.longitude}&lang=en-US&apikey=${this.apiKey}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('location');
        console.log(data);
    
        const address = data.items[0].address;

        const theLocation = new LocationModel(address.city, address.state, address.countryName);
        this.location = theLocation;
        return theLocation;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return new LocationModel('New York City', 'New York', 'USA');
      }
    }

  }

  export default LocationService;