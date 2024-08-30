export interface ICountry{
    country:string;
}
export interface ICountryState{
    country:string;
    countryData:string,
    population:number,
    latlng: Array<any>,
    flag:string,
    temperature:number,
    weatherIcons:string,
    windSpeed:number,
    precip:number,
    error:string
}