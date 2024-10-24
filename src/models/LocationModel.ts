class LocationModel{

    private city: string;
    private state: string;
    private country: string;

    constructor(city: string, state: string, country: string) {
        this.city = city;
        this.state = state;
        this.country = country;
    }

    public getCity(): string {
        return this.city;
    }

    public toString(): string {
        let string = this.city != '' ? this.city : '';
        string += this.state != '' ? ', '+this.state : '';
        string += this.country != '' ? ', '+this.country : '';
        return string;
    }

    public getSimplifiedString(): string {
        return `${this.city}, ${this.country}`;
    }



}

export default LocationModel;