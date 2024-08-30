import React, { useCallback, useEffect, useState } from 'react';
import { Briefcase, Child, Document, Edit, ListCheck, Man, UsersAlt } from '@components/icons';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { URL_PATHS } from '@config/variables';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { googleAnalyticsResponse, kidsAgeType, planListType } from 'src/types/dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAnalyticsApp from './googleAnalytics';

const Dashboard = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [dashboardDetails, setDashboardDetails] = useState({
		noOfUsers: 0,
		noOfKids: 0,
		noOfTopics: 0,
		noOfLessons: 0,
		noOfActiveSubscriptions: 0,
		noOfTraditionalChineseLerner: 0,
		noOfSimplifiedChineseLerner: 0,
	});
	const [dashboardRevenue, setDashboardRevenue] = useState({
		noOfRevenue: 0,
	});
	const [subscriptionData, setDashboardSubscription] = useState({
		subscriptionForMonth: 0,
		subscriptionForYear: 0,
		planList: [],
	});
	const [avgAge, setAvgAge] = useState<kidsAgeType[]>();
	const [kidsGender, setKidsGender] = useState<number[]>();
	const [googleAnalyticsData, setGoogleAnalyticsData] = useState<googleAnalyticsResponse[]>([]);

	const [avgAgeOptions, setAvgAgeOptions] = useState<ApexOptions>({
		chart: {
			type: 'bar',
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		colors: ['var(--default)', 'var(--primary-dark)'],
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '50%',
				borderRadius: 2,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		yaxis: {
			title: {
				text: 'Number of Kids',
			},
		},
		fill: {
			opacity: 1,
		},
	});

	const [kidsGenderOptions] = useState<ApexOptions>({
		chart: {
			type: 'pie',
		},
		labels: ['Girls', 'Boys'],
		colors: ['var(--primary)', 'var(--accent)'],
		legend: {
			position: 'bottom',
		},
		dataLabels: {
			textAnchor: 'middle',
		},
	});

	useEffect(() => {
		getDashboardDetails();
		getDashboardRevenue('daily');
		getDashboardSubscription();
		getDashboardKidsAgeGraph();
		getDashboardKidsGenderGraph();
	}, []);

	const getDashboardDetails = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardDetails)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardDetails(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardRevenue = (filter: string) => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.dashboardRevenue}?filter=${filter}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardRevenue(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardSubscription = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardSubscriptionPlan)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardSubscription(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardKidsAgeGraph = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardKidsGraph)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					const girlData = responseData.girls;
					const boyData = responseData.boys;
					const chartData = [
						{
							name: 'Girls',
							data: Object.values(girlData),
						},
						{
							name: 'Boys',
							data: Object.values(boyData),
						},
					];
					setAvgAgeOptions({
						...avgAgeOptions,
						xaxis: {
							categories: Object.keys(girlData),
						},
					});

					setAvgAge(chartData as kidsAgeType[]);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardKidsGenderGraph = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardKidsGenderGraph)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					const chartData = [responseData.girls || 0, responseData.boys || 0];
					setKidsGender(chartData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	return (
		<div>
			{loading && <Loader />}
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 xl:gap-6 md:grid-cols-3 2xl:grid-cols-4'>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-green-100 text-green-500 grid place-content-center text-4xl mr-5'>
						<Man />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfUsers || 0}</span>
						<h6 className='text-gray-600'>Number of Users</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-pink-100 text-pink-500 grid place-content-center text-4xl mr-5'>
						<Child />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfKids || 0}</span>
						<h6 className='text-gray-600'>Number of Kids</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-purple-100 text-purple-500 grid place-content-center text-4xl mr-5'>
						<Document />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfTopics || 0}</span>
						<h6 className='text-gray-600'>Number of Topics</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-orange-100 text-orange-500 grid place-content-center text-4xl mr-5'>
						<Edit />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfLessons || 0}</span>
						<h6 className='text-gray-600'>Number of Lessons</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-yellow-100 text-yellow-500 grid place-content-center text-4xl mr-5'>
						<UsersAlt />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfActiveSubscriptions || 0}</span>
						<h6 className='text-gray-600'>Number of Active Subscriptions</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-teal-100 text-teal-500 grid place-content-center text-4xl mr-5'>
						<ListCheck />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfTraditionalChineseLerner || 0}</span>
						<h6 className='text-gray-600'>No. of Traditional Chinese Learner</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-lime-100 text-lime-500 grid place-content-center text-4xl mr-5'>
						<UsersAlt />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfSimplifiedChineseLerner || 0}</span>
						<h6 className='text-gray-600'>No. of Simplified Chinese Learner</h6>
					</div>
				</div>
				<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
					<div className='icon h-20 w-20 rounded-full bg-indigo-100 text-indigo-500 grid place-content-center text-4xl mr-5'>
						<Briefcase />
					</div>
					<div>
						<span className='font-bold text-black text-4xl'>{dashboardRevenue.noOfRevenue || 0}</span>
						<h6 className='text-gray-600'>Revenue Generated</h6>
						<select className='border rounded px-1 py-1 mt-2 ml-auto' onChange={(e) => getDashboardRevenue(e.target.value)}>
							<option value='daily'>Today</option>
							<option value='monthly'>This Month</option>
							<option value='yearly'>This Year</option>
							<option value='all'>Total</option>
						</select>
					</div>
				</div>
			</div>
			<div className='mb-3 bg-white shadow-lg rounded-lg mt-8'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium'>Google Analytics Report</h6>
					<GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID ?? ''}>
						<GoogleAnalyticsApp setAnalyticsData={useCallback((data: googleAnalyticsResponse[]) => setGoogleAnalyticsData(data), [googleAnalyticsData])} setLoader={useCallback((loading) => setLoading(loading), [loading])} />
					</GoogleOAuthProvider>
				</div>
				<div className='p-3 overflow-auto w-full' style={{ maxHeight: '500px' }}>
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
						{googleAnalyticsData.length > 0 ? (
							<tbody>
								{googleAnalyticsData.map((val, idx) => (
									<tr className='bg-white border-b' key={`${idx + 1}`}>
										<td className='border px-3 py-2'>{idx + 1}</td>
										<td className='border px-3 py-2'>
											<b>{val.dimensionValues[0].value}</b>
										</td>
										<td className='border px-3 py-2'>
											<b>{val.dimensionValues[1].value}</b>
										</td>
										<td className='border px-3 py-2'>{val.metricValues[0].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[1].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[2].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[3].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[4].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[5].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[6].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[7].value}</td>
										<td className='border px-3 py-2'>{val.metricValues[8].value}</td>
									</tr>
								))}
							</tbody>
						) : (
							<tbody>
								<tr className='bg-white border-b text-center'>
									<td colSpan={12}>No Data!</td>
								</tr>
							</tbody>
						)}
					</table>
				</div>
			</div>
			<div className='mb-3 bg-white shadow-lg rounded-lg mt-8'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium'>Subscription Plans</h6>
				</div>
				<div className='p-3 overflow-auto w-full'>
					<table>
						<thead>
							<tr>
								<th scope='col'>Plans</th>
								<th scope='col' colSpan={2}>
									Counts
								</th>
							</tr>
						</thead>
						<tbody>
							{subscriptionData.planList.map((val: planListType) => (
								<tr className='bg-white border-b' key={val.id}>
									<td className='border px-3 py-2'>{val.planName}</td>
									<td className='border px-3 py-2' colSpan={2}>
										{val.value ?? 0}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td className='border px-3 py-2'>
									<b>User having subscription for month</b>
								</td>
								<td className='border px-3 py-2' colSpan={2}>
									<b>{subscriptionData.subscriptionForMonth}</b>
								</td>
							</tr>
							<tr>
								<td className='border px-3 py-2'>
									<b>User having subscription for year</b>
								</td>
								<td className='border px-3 py-2' colSpan={2}>
									<b>{subscriptionData.subscriptionForYear}</b>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-2 lg:gap-6 xl:gap-6 lg:grid-cols-2 xl:grid-cols-2 mt-8'>
				<div className='bg-white shadow-lg rounded-lg flex flex-col'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium'>Kids Age</h6>
					</div>
					<div className='p-3 overflow-auto w-full items-center flex grow'>
						<div className='w-full'>{avgAgeOptions.xaxis && <ReactApexChart options={avgAgeOptions} series={avgAge} type='bar' width={'100%'} height={350} />}</div>
					</div>
				</div>
				<div className='bg-white shadow-lg rounded-lg flex flex-col'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium'>Kids Gender</h6>
					</div>
					<div className='p-3 overflow-auto w-full items-center flex grow'>
						<div className='w-full'>{kidsGender?.length && <ReactApexChart options={kidsGenderOptions} series={kidsGender} type='pie' width={'100%'} height={350} />}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
