import axios from "axios";
const API_KEY = '97ad954b5c1690c5d99dfc571e936da4';
export const APIServices = {
    getData(url:string){
        return axios.get(url);
    },
    getCapitalWeatherData(url:string){
        return axios.get(url)
    }
}