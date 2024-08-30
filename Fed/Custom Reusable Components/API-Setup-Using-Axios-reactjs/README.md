# **[API Setup using Axios Documentation](#)**

Axios is a popular JavaScript library used for making HTTP requests. In the context of React.js, Axios is often employed to facilitate data fetching from APIs or interacting with backend services.

### **[Purpose](#)**

1. HTTP Requests

   - Data Retrieval

2. Promise-based API

   - Asynchronous Operations

3. Error Handling

   - Error Management

4. Interceptors

   - Request and Response Interceptors

5. Concurrency Control

   - Cancel Requests

6. Configurability

   - Custom Configurations

7. JSON Data Handling
   - Automatic JSON Parsing

### **[prerequisite](#)**

- Node version: v16.16.0
- NPM version: 9.6.7

### Usage & Install the axios in your react application

```
npm install axios
```

### Create the service folder and create Common.ts file for create a all the api methods

### For Example:

```
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
```

### Create constant folder and create api.ts file

```
const BASE_URL = 'https://restcountries.com';
const VERSION = 'v3.1';
const WATHER_BASE_URL = 'http://api.weatherstack.com/current?';
const API_KEY = '97ad954b5c1690c5d99dfc571e936da4'
//export const API_KEY = '97ad954b5c1690c5d99dfc571e936da4';

export const COUNTRY = `${BASE_URL}/${VERSION}/name`;
export const CAPITAL_WATHER_URL = `${WATHER_BASE_URL}access_key=${API_KEY}&query`;
```

### Call the API using Code:

```
function getWaiterInfo(){
    if(props.countryData[0].capital){
        APIServices.getData(`${CAPITAL_WATHER_URL}=${props.countryData[0].capital}`)
            .then(res => {
                setWatherInfo(res.data.current);
                setStatus(true);
            },(err)=>{
                setError('Wather Infomation Not Found');
            //   this.setState({error: err.response.data.message});
            }
        );
    }
}
```

### [If you want to pass the configuration or Header parameters with api](#)

```
import axios from "axios";
import { PAYPAL_PASSWORD, PAYPAL_USERNAME } from "../../constants/Api";
const token = `Bearer Token`;
localStorage.setItem("newAuth", token);
const newdata = localStorage.getItem("newAuth");
console.log("commonServices.ts =>", newdata);

const config = {
    headers: {
        Authorization: `${newdata}`,
    },
};
/*****************PAYPAL Credential***********************/
const paypalUsename = PAYPAL_USERNAME;
const paypalPassword = PAYPAL_PASSWORD;
/*********************************************************/

export const APIServices = {
getData(url: string) {
    return axios.get(url, config);
},
getShippingMethod(url: string, data: any) {
    return axios.post(url, data, config);
},
getPaymentInfo(url: string, data: any) {
    return axios.post(url, data, config);
},
generatePaypalToken(url: string, params: any) {
    return axios.post(url, params, {
        auth: {
            username: paypalUsename,
            password: paypalPassword,
        }
    })
},
createPaypalPayment(url: string, token: any, data: any) {
    const payPalHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return axios.post(url, data, payPalHeaders);
},
getPayerDetails(url: string, token: any) {
    const payPalPayerHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return axios.get(url, payPalPayerHeaders);
}
}
```

### [Call the API with header parameters](#)

```
const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    payPalGenerateToken(params);

const payPalGenerateToken = (params: any) => {
    APIServices.generatePaypalToken(PAYPAL_GENERATE_TOKEN, params)
        .then(res => {
            setpayPalToken(res.data?.access_token);
        });
}
```

### Application Sanpshot

![API Setup Using Axios](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Custom%20Reusable%20Components/API-Setup-Using-Axios-reactjs/Application%20Snapshot/snapshot.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
