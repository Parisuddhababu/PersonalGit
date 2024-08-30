import React, { useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { APIServices } from '../services/Common';
import { CAPITAL_WATHER_URL } from '../constant/Api';
import Alert from '@mui/material/Alert';
import WetherInfomation from './WetherInfomation';
import '../component/Wethercard.css';

export default function CountryDetailsShow(props: any) {
    const [watherInfo, setWatherInfo] = useState([]);
    const [error, setError] = useState('');
    const [watherStatus, setStatus] = useState(false);

    const getWaiterInfo = useCallback(() => {
      if (props.countryData[0].capital) {
        APIServices.getData(
          `${CAPITAL_WATHER_URL}=${props.countryData[0].capital}`
        ).then(
          (res) => {
            setWatherInfo(res.data.current);
            setStatus(true);
            setError('');
          },
          (err) => {
            setError("Wather Infomation Not Found");
          }
        );
      }
    }, [props, props.countryData[0].capital]);

    return (
        <>
            <div className="CountryCard">
                <Card sx={{ maxWidth: 345 }}>
                    <h3>Capital of Country </h3>
                    {props.countryData[0].flags.png ?
                        <CardMedia
                            component="img"
                            height="140"
                            image={`${props.countryData[0].flags.png}`}
                            alt="green iguana"
                        /> :
                        ''}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            <h6>Capital of Country</h6>
                            {props.countryData[0].capital}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <h6>Population</h6>
                            {props.countryData[0].population}<br />
                            <h6>Latlag</h6>
                            {props.countryData[0].latlng}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="contained" disabled={!watherInfo} onClick={getWaiterInfo} style={{ marginLeft: "25%" }}> Capital Weather </Button>
                    </CardActions>
                </Card>
            </div>
            {
                watherStatus &&
                    <WetherInfomation watherData={watherInfo} />
            }
            {
                error.length ?
                <Alert severity="error">
                    {error}
                </Alert> : ''
            }
        </>
    );
}