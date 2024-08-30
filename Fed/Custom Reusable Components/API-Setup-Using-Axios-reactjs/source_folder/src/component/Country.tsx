import TextField from '@mui/material/TextField'
import '../component/Country.css'
import { CAPITAL_WATHER_URL, COUNTRY } from '../constant/Api';
import { APIServices } from '../services/Common';
import { ICountryState } from '../types/Country';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Component } from 'react';

class Country extends Component <any,ICountryState>{
  constructor(props:any){
    super(props);
    this.state={
      country:'',
      countryData:'',
      population:0,
      latlng:[],
      flag:'',
      temperature:0,
      weatherIcons:'',
      windSpeed:0,
      precip:0,
      error:'',
    };
  }
  handleChange = (e:any) => {
    const value = e.target.value;
    this.setState({country: value});
  }
  getCountryDetails =()=>{
    APIServices.getData(`${COUNTRY}/${this.state.country}`)
    .then(res => {
      this.setState({ countryData:res.data[0].capital,population:res.data[0].population,latlng:res.data[0].latlng,flag:res.data[0].flags.png});
    },(err)=>{
      this.setState({error: err.response.data.message});
    });
  }
  getCapitalWeather =()=>{
    if(this.state.countryData){
      APIServices.getData(`${CAPITAL_WATHER_URL}=${this.state.countryData}`)
      .then(res => {
        console.log(res.data.current.wind_speed);
        this.setState({ temperature:res.data.current.temperature,weatherIcons:res.data.current.weather_icons[0],windSpeed:res.data.current.wind_speed,precip:res.data.current.precip});
      },(err)=>{
        this.setState({error: err.response.data.message});
      });
    }
  }
  reset=()=>{
    this.setState({
      country:'',
      countryData:'',
      population:0,
      latlng:[],
      flag:'',
      temperature:0,
      weatherIcons:'',
      windSpeed:0,
      precip:0,
      error:'',
    });
  }
  render() {
    const {country,error,countryData}= this.state;
    return (
      <>
        {!error ?
            <>
            <div className='country-inputbox'>
              <TextField id="outlined-basic" value={this.state.country} label="Enter Country" variant="outlined" onChange={this.handleChange}/>
            </div>
            <div className='country-inputbox'>
            <Button variant="contained" disabled={!country} onClick={this.getCountryDetails}>Submit</Button>
            <Button variant="contained" onClick={this.reset}>Reset</Button>
            </div>
            <hr/>
            <Card sx={{ maxWidth: 345 }}>
            {this.state.flag ?
              <CardMedia
                component="img"
                height="140"
                image={`${this.state.flag}`}
                alt="green iguana"
              /> :
              ''}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {countryData}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <div>{this.state.population}</div>
                    <div>{this.state.latlng }</div>
                </Typography>
              </CardContent>
              <CardActions>
                  <Button  size="small" variant="contained" disabled={!countryData} onClick={this.getCapitalWeather}> Capital Weather </Button> 
              </CardActions>
            </Card>
            <div>
            { countryData ?
            <Card sx={{ maxWidth: 345 }}>
            {this.state.weatherIcons ?
              <CardMedia
                component="img"
                height="140"
                image={`${this.state.weatherIcons}`}
                alt="green iguana"
              /> :
              ''}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Temperature : {this.state.temperature}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                   <div>Wind Speed : {this.state.windSpeed} </div>
                  <div>Precip : {this.state.precip} </div>
                </Typography>
              </CardContent>
            </Card> 
            : ''
           }
            </div>
          </>
        :
        <Alert severity="error">
           {error}
        </Alert>
        } 
      </>
    )
  }
}
export default Country;
