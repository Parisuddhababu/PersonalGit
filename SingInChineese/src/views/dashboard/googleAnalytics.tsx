import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '@components/button/Button';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { googleAnalyticsResponse } from 'src/types/dashboard';

type GoogleAnalyticsProps = {
	setAnalyticsData: (rows: googleAnalyticsResponse[]) => void;
	setLoader: (loader: boolean) => void;
};

const GoogleAnalyticsApp = ({ setAnalyticsData, setLoader }: GoogleAnalyticsProps) => {
	const googleAnalytics = process.env.REACT_APP_GOOGLE_ANALYTICS;
	const analyticsScope = process.env.REACT_APP_ANALYTICS_SCOPE;
	const propertyID = process.env.REACT_APP_PROPERTY_ID;
	const runReport = ':runReport';

	const googleLogin = useGoogleLogin({
		scope: analyticsScope,
		onSuccess: (tokenResponse) => {
			const accessToken = tokenResponse?.access_token;
			if (accessToken) {
				fetchData(accessToken);
			}
		},
		onError: (error) => {
			toast.error(error.error_description);
		},
	});

	const fetchData = (accessToken: string) => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		};
		setLoader(true);
		APIService.postData(
			`${googleAnalytics}${propertyID}${runReport}`,
			{
				dateRanges: [{ startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD') }],
				dimensions: [{ name: 'platform' }, { name: 'country' }],
				metrics: [{ name: 'active1DayUsers' }, { name: 'active7DayUsers' }, { name: 'active28DayUsers' }, { name: 'newUsers' }, { name: 'totalUsers' }, { name: 'crashAffectedUsers' }, { name: 'crashFreeUsersRate' }, { name: 'userEngagementDuration' }, { name: 'sessionsPerUser' }],
			},
			headers
		)
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
		<div className='App'>
			<Button className='btn-primary btn-large' onClick={googleLogin}>
				Generate Report
			</Button>
		</div>
	);
};

export default GoogleAnalyticsApp;
