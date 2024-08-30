import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import '../component/Wethercard.css';

export default function WetherInfomation(props: any) {
  return (
    <>
      <div className='wetherCard'>
        <Card sx={{ maxWidth: 345 }}>
          <h3>Weather of Capital</h3>
          {props.watherData.weather_icons ? (
            <CardMedia
              component='img'
              height='140'
              image={`${props.watherData.weather_icons}`}
              alt='green iguana'
            />
          ) : (
            ''
          )}
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              <h6>Temperature</h6>
              {props.watherData.temperature}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <h6>Wind Speed</h6>
              {props.watherData.wind_speed}
              <br />
              <h6>Precip</h6>
              {props.watherData.precip}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
