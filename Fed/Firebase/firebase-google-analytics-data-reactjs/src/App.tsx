import React, { useCallback, useState } from 'react';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAnalyticsApp from './google-analytics/googleAnalytics';
import { googleAnalyticsResponse } from './google-analytics/types';

function App() {
  const [googleAnalyticsData, setGoogleAnalyticsData] = useState<googleAnalyticsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  

  const handleGoogleAnalyticsData = useCallback((data: googleAnalyticsResponse[]) => {
    setGoogleAnalyticsData(data)
  }, []);

  const handleLoader = useCallback((loading: boolean) => {
    setLoading(loading);
  }, [loading]);

  return (
    <div className='container'>
      <div className='d-flex'>
        <h2>Google Analytics Report</h2>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID ?? ''}>
          <GoogleAnalyticsApp setAnalyticsData={handleGoogleAnalyticsData} setLoader={handleLoader} />
        </GoogleOAuthProvider>
      </div>
      <div style={{maxHeight: '500px', overflow: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th scope='col'>Sr.No</th>
              <th scope='col'>Platform</th>
              <th scope='col'>Country</th>
              <th scope='col'>Active Users(1 Day)</th>
              <th scope='col'>Active Users(7 day)</th>
              <th scope='col'>Active Users(28 Day)</th>
              <th scope='col'>New Users</th>
              <th scope='col'>Total Users</th>
              <th scope='col'>App Crashes</th>
              <th scope='col'>App Stability</th>
              <th scope='col'>User Engagement Duration</th>
              <th scope='col'>Engage Session Per User</th>
            </tr>
          </thead>
          {googleAnalyticsData.length > 0 ? <tbody>
            {googleAnalyticsData.map((val, idx) => (
              <tr key={val.dimensionValues[1].value}>
                <td>{idx + 1}</td>
                <td><b>{val.dimensionValues[0].value}</b></td>
                <td><b>{val.dimensionValues[1].value}</b></td>
                <td>{val.metricValues[0].value}</td>
                <td>{val.metricValues[1].value}</td>
                <td>{val.metricValues[2].value}</td>
                <td>{val.metricValues[3].value}</td>
                <td>{val.metricValues[4].value}</td>
                <td>{val.metricValues[5].value}</td>
                <td>{val.metricValues[6].value}</td>
                <td>{val.metricValues[7].value}</td>
                <td>{val.metricValues[8].value}</td>
              </tr>
            ))}
          </tbody> :
          <tbody>
            <tr><td className='text-center' colSpan={12}>{loading ? 'Loading...' : 'No Data!'}</td></tr>
          </tbody>
          }
        </table>
      </div>
    </div>
  );
}

export default App;
