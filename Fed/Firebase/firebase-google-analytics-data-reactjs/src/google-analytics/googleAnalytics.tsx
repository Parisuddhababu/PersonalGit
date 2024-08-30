import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import moment from 'moment';
import { googleAnalyticsResponse } from './types';
import { APIService } from '../services/api';

const GOOGLE_ANALYTICS = 'https://analyticsdata.googleapis.com/v1beta/properties/';
const ANALYTICS_SCOPE = 'https://www.googleapis.com/auth/analytics';

type GoogleAnalyticsProps = {
	setAnalyticsData: (rows: googleAnalyticsResponse[]) => void;
  setLoader: (loader:boolean) => void
}

const GoogleAnalyticsApp = ({ setAnalyticsData, setLoader }: GoogleAnalyticsProps) => {

  const googleLogin = useGoogleLogin( {
    scope:ANALYTICS_SCOPE,
    onSuccess: ( tokenResponse ) => {
      const accessToken = tokenResponse?.access_token;
      if ( accessToken ) {
        fetchData(accessToken)
      }
    },
    onError: ( error ) => {
      console.error( error );
    }
  } );

  const fetchData = async ( accessToken:string ) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ accessToken }`,
      };
      setLoader(true);
      APIService.postData(GOOGLE_ANALYTICS + process.env.REACT_APP_PROPERTY_ID+':runReport', {
            dateRanges: [{ startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')}],
            dimensions: [{ name: 'platform' }, { name: 'country' }],
            metrics: [
              { name: 'active1DayUsers'},
              { name: 'active7DayUsers'},
              { name: 'active28DayUsers'},
              { name: 'newUsers' },
              { name: 'totalUsers' },
              { name: 'crashAffectedUsers'},
              { name: 'crashFreeUsersRate'},
              { name: 'userEngagementDuration'},
              { name: 'sessionsPerUser'}
            ]
        }, headers)
        .then((response) => {
          setLoader(false);
          setAnalyticsData(response.data.rows);
        })
        .catch(() => {
            setLoader(false);
            toast.error('Error to get google analytics report');
        });
  };

  return (
    <button type='button' onClick={() => googleLogin() }>Generate Report</button>
  );
};

export default GoogleAnalyticsApp;