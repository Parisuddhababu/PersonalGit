import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Agenda, Calendar, Dollars, Equalizer, Eye, FullScreenIn, FullScreenOut, Map, User2 } from '@components/icons/icons';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Button from '@components/button/button';
import { CHART_DATA, COLUMN_BAR, HORIZONTAL_BAR, PIE_CHART, SINGLE_COLUMN_BAR, TOTAL_LIFT } from './graphCommonData';
import UpdatedHeader from '@components/header/updatedHeader';

interface ToggleGraphScreenState {
	horizontalBar: boolean;
	chartData: boolean;
	pieChart: boolean;
	totalLift: boolean;
	columnBar: boolean;
	singleColumnBar: boolean;
	countryChart: boolean;
}

const Dashboard = () => {
	const { t } = useTranslation();
	const [toggleGraphScreen, setToggleGraphScreen] = useState<ToggleGraphScreenState>({
		horizontalBar: false,
		chartData: false,
		pieChart: false,
		totalLift: false,
		columnBar: false,
		singleColumnBar: false,
		countryChart: false,
	});
	const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';
	const markers: { markerOffset: number; name: string; coordinates: [number, number]; }[] = [
		{
			markerOffset: -15,
			name: 'Buenos Aires',
			coordinates: [-117.877011, 54.852944]
		},
		{ markerOffset: -15, name: 'La Paz', coordinates: [-121.778855, 54.814670] },
		{ markerOffset: 25, name: 'Brasilia', coordinates: [-117.715621, 54.019228] },
		{ markerOffset: 25, name: 'Santiago', coordinates: [-111.905577, 52.404860] },
		{ markerOffset: 25, name: 'Bogotaasceerv', coordinates: [-107.728421, 52.335304] },
		{ markerOffset: 25, name: 'Quito', coordinates: [-105.487946, 53.276453] },
		{ markerOffset: -15, name: 'Georgetown', coordinates: [-102.412041, 52.819901] },
		{ markerOffset: -15, name: 'Asuncion', coordinates: [-111.639758, 52.404860] },
		{ markerOffset: 25, name: 'Paramaribo', coordinates: [-108.032214, 52.312094] },
		{ markerOffset: 25, name: 'Montevideo', coordinates: [-104.120877, 53.094413] },
		{ markerOffset: -15, name: 'Caracas', coordinates: [-120.221915, 54.418878] },
		{ markerOffset: -15, name: 'Lima', coordinates: [-104.386696, 51.112194] }
	];

	const headerActionConst = () => {
		return (
			<>
				<Button className='btn btn-gray md:w-[150px]' type='submit' label={t('All Locations')} title={`${t('All Locations')}`}>
					<Map className='order-2 ml-2 stroke-2' fontSize='17' />
				</Button>
				<Button className='btn btn-gray md:w-[150px]' type='submit' label={t('Last Month')} title={`${t('Last Month')}`}>
					<Calendar className='order-2 ml-2 stroke-2' fontSize='17' />
				</Button>
				<Button className='btn md:w-[50px] w-10 border-primary border btn-secondary' type='submit' label={''} title=''>
					<Equalizer className='order-2' fontSize='17' />
				</Button>
			</>
		)
	};

	return (
		<>
			<UpdatedHeader  headerActionConst={headerActionConst} />
			<div>
				<div className='flex flex-wrap gap-5 mb-5 2xl:gap-7 max-xxs:gap-3 max-xxs:-mx-2.5 md:mb-7'>
					<div className='flex gap-5 p-5 border border-solid border-border-primary rounded-xl w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'>
						<div className='flex items-center justify-center min-w-[40px] h-10 md:min-w-[48px] md:h-12 text-xl md:text-2xl rounded-full bg-primary'><User2 className='fill-white' /></div>
						<div>
							<h6 className='mb-2 md:mb-5'>{t('Total Users')}</h6>
							<p className='h1 text-primary'>225</p>
						</div>
					</div>
					<div className='flex gap-5 p-5 border border-solid border-border-primary rounded-xl w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'>
						<div className='flex items-center justify-center min-w-[40px] h-10 md:min-w-[48px] md:h-12 text-xl md:text-2xl rounded-full bg-primary'><Map className='fill-white' /></div>
						<div>
							<h6 className='mb-2 md:mb-5'>{t('Locations')}</h6>
							<p className='h1 text-primary'>08</p>
						</div>
					</div>
					<div className='flex gap-5 p-5 border border-solid border-border-primary rounded-xl w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'>
						<div className='flex items-center justify-center min-w-[40px] h-10 md:min-w-[48px] md:h-12 text-xl md:text-2xl rounded-full bg-primary'><Dollars className='fill-white' /></div>
						<div>
							<h6>{t('Total Dollars Earned')}</h6>
							<p className='text-xs md:text-sm'>{t('Across Platform Through Rewards Program')}</p>
							<p className='h1 text-primary'>USD 4K</p>
						</div>
					</div>
					<div className='flex gap-5 p-5 border border-solid border-border-primary rounded-xl w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'>
						<div className='flex items-center justify-center min-w-[40px] h-10 md:min-w-[48px] md:h-12 text-xl md:text-2xl rounded-full bg-primary'><Dollars className='fill-white' /></div>
						<div>
							<h6>{t('Average Dollar Earned')}</h6>
							<p className='text-xs md:text-sm'>{t('Per User Through Rewards Program')}</p>
							<p className='h1 text-primary'>USD 15</p>
						</div>
					</div>
					<div className='flex gap-5 p-5 border border-solid border-border-primary rounded-xl w-full 2xl:w-[calc(67.7%-25px)]'>
						<div className='flex items-center justify-center min-w-[40px] h-10 md:min-w-[48px] md:h-12 text-xl md:text-2xl rounded-full bg-primary'><Agenda className='fill-white' /></div>
						<div className='w-[calc(100%-65px)]'>
							<h6 className='mb-2 md:mb-5'>{t('Enrolled for Education')}</h6>
							<div className='flex flex-wrap items-center w-full gap-x-5 xmd:gap-0'>
								<p className='flex items-center w-auto border-solid xmd:w-1/2 lg:border-r lg:justify-center lg:w-1/3 gap-7 border-border-primary last:border-none'><span>{t('Tenants')}</span><span className='h1 text-primary'>95</span></p>
								<p className='flex items-center w-auto border-solid xmd:w-1/2 lg:border-r lg:justify-center lg:w-1/3 gap-7 border-border-primary last:border-none'><span>{t('Custodials')}</span><span className='h1 text-primary'>98</span></p>
								<p className='flex items-center w-auto border-solid xmd:w-1/2 lg:border-r lg:justify-center lg:w-1/3 gap-7 border-border-primary last:border-none'><span>{t('Employees')}</span><span className='h1 text-primary'>32</span></p>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-wrap gap-5 2xl:gap-7 max-xxs:-mx-2.5'>
					<div className={`${toggleGraphScreen.countryChart ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} transition-all ease-in-out duration-100 delay-100 w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden`}>
						<div className='relative pr-12 mb-3'>
							<h6>{t('Total No. of Composters')}</h6>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title=''>
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.countryChart &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, countryChart: !toggleGraphScreen.countryChart }))} title=''>
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.countryChart &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, countryChart: !toggleGraphScreen.countryChart }))} title=''>
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.countryChart ? 'mt-5' : 'max-xxs:-mx-3 max-w-[1024px] mt-7'}`}>
							<ComposableMap
								projection='geoAzimuthalEqualArea'
								projectionConfig={{
									rotate: [100, -60, 0],
									scale: 900
								}}
							>
								<Geographies geography={geoUrl}>
									{({ geographies }) =>
										geographies.map((geo) => (
											<Geography
												key={geo.rsmKey}
												geography={geo}
												fill='#EAEAEC'
												stroke='#D6D6DA'
											/>
										))
									}
								</Geographies>
								{markers.map(({ name, coordinates }) => {
									return (
										<Marker key={name} coordinates={coordinates}>
											<circle r={7.2} fill='#F6901E' stroke='#fff' strokeWidth={0} />
										</Marker>
									)
								})}
							</ComposableMap>
						</div>
					</div>
					<div className={`${toggleGraphScreen.horizontalBar ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} transition-all ease-in-out duration-100 delay-100 w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden`}>
						<div className='relative pr-12 mb-3'>
							<h6>{t('Goals vs Achievement')}</h6>
							<p className='text-xs md:text-sm'>{t('Planned Weight Input VS Actual Weight Input (MT)')}</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title=''>
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.horizontalBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, horizontalBar: !toggleGraphScreen.horizontalBar }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.horizontalBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, horizontalBar: !toggleGraphScreen.horizontalBar }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.horizontalBar && 'mt-auto'} max-xxs:-mx-3`}>
							<ReactApexChart options={HORIZONTAL_BAR.options as ApexOptions} series={HORIZONTAL_BAR.series} type='bar' height={350} />
						</div>
					</div>
					<div className={`${toggleGraphScreen.chartData ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden transition-all ease-in-out duration-100 delay-100`}>
						<div className='relative pr-12 mb-1'>
							<h6>{t('Input Vs Output Weights (MTs)')}</h6>
							<p className='h1 text-primary'>16.56 MT</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title='' >
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.chartData &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, chartData: !toggleGraphScreen.chartData }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.chartData &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, chartData: !toggleGraphScreen.chartData }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.chartData && 'mt-auto'}  -mx-5 max-xxs:-mx-7`}>
							<ReactApexChart
								options={CHART_DATA.options as ApexOptions}
								series={CHART_DATA.series}
								type='line'
								height={CHART_DATA.options.chart.height}
							/>
						</div>
					</div>
					<div className={`${toggleGraphScreen.pieChart ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden transition-all ease-in-out duration-100 delay-100`}>
						<div className='relative pr-12 mb-1'>
							<h6>{t('Aggregated Waste Diversion')}</h6>
							<p className='text-xs md:text-sm'>{t('Diversion In %')}</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title='' >
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.pieChart &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, pieChart: !toggleGraphScreen.pieChart }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.pieChart &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, pieChart: !toggleGraphScreen.pieChart }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.pieChart && 'mt-auto'}  flex justify-center max-xxs:-mx-3`}>
							<ReactApexChart
								options={PIE_CHART.options as ApexOptions}
								series={PIE_CHART.series}
								type='pie'
								width={PIE_CHART.options.chart.width}
							/>
						</div>
					</div>
					<div className={`${toggleGraphScreen.totalLift ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden transition-all ease-in-out duration-100 delay-100`}>
						<div className='relative pr-12 mb-1'>
							<h6>{t('Total Lifts and Weight Input')}</h6>
							<p className='h1 text-primary'>160 Lifts(s)</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title='' >
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.totalLift &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, totalLift: !toggleGraphScreen.totalLift }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.totalLift &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, totalLift: !toggleGraphScreen.totalLift }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.totalLift && 'mt-auto'} -mx-5 max-xxs:-mx-7`}>
							<ReactApexChart
								options={TOTAL_LIFT.options as ApexOptions}
								series={TOTAL_LIFT.series}
								type='line'
								height={TOTAL_LIFT.options.chart.height}
							/>
						</div>
					</div>
					<div className={`${toggleGraphScreen.columnBar ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden transition-all ease-in-out duration-100 delay-100`}>
						<div className='relative pr-12 mb-1'>
							<h6>{t('Time Spent Loading & Off Loading')}</h6>
							<p className='h1 text-primary'>4h 37m 40s</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title='' >
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.columnBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, columnBar: !toggleGraphScreen.columnBar }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.columnBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, columnBar: !toggleGraphScreen.columnBar }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.columnBar && 'mt-auto'} max-xxs:-mx-3`}>
							<ReactApexChart
								options={COLUMN_BAR.options as ApexOptions}
								series={COLUMN_BAR.series}
								type='bar'
								height={350}
							/>
						</div>
					</div>
					<div className={`${toggleGraphScreen.singleColumnBar ? 'fixed top-0 left-0 right-0 bottom-0 bg-white z-50' : 'rounded-xl 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)]'} w-full px-5 pt-5 pb-3 border border-solid border-border-primary flex flex-col overflow-hidden transition-all ease-in-out duration-100 delay-100`}>
						<div className='relative pr-12 mb-1'>
							<h6>{t('Overall Percentage of GHG Reduction')}</h6>
							<p className='h1 text-primary'>96%</p>
							<div className='absolute right-0 flex gap-4 top-1'>
								<Button label={t('')} title='' >
									<Eye className='fill-secondary' />
								</Button>
								{!toggleGraphScreen.singleColumnBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, singleColumnBar: !toggleGraphScreen.singleColumnBar }))} title='' >
										<FullScreenIn className='fill-secondary' />
									</Button>
								}
								{toggleGraphScreen.singleColumnBar &&
									<Button label={t('')} className='text-sm' onClick={() => setToggleGraphScreen((prevState) => ({ ...prevState, singleColumnBar: !toggleGraphScreen.singleColumnBar }))} title='' >
										<FullScreenOut className='fill-secondary' />
									</Button>
								}
							</div>
						</div>
						<div className={`${!toggleGraphScreen.singleColumnBar && 'mt-auto'}  max-xxs:-mx-3`}>
							<ReactApexChart
								options={SINGLE_COLUMN_BAR.options as ApexOptions}
								series={SINGLE_COLUMN_BAR.series}
								type='bar'
								height={350}
							/>
						</div>
					</div>
					<div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-19px)] justify-center items-center flex flex-col min-h-[200px] md:min-h-[360px] px-5 pt-5 pb-3 border border-solid border-border-primary rounded-xl'>
						<h5 className='mb-5'>Click to Add</h5>
						<Button className='btn-primary w-full sm:w-[125px] whitespace-nowrap' type='button' label={t('+ Add New')} 
						title={`${t('Add New')}`} />
					</div>
				</div>
			</div>
		</>
	);
};
export default Dashboard;
