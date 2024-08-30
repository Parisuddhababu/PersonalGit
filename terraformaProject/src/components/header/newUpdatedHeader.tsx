import React, { useState } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Download, Equalizer, Filter, Layout, Map, Printer, Share1, Sorting } from '@components/icons/icons';
import { SettingsDrpData } from '@config/constant';
import DropDown from '@components/dropdown/dropDown';

const NewUpdatedHeader = () => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState<string>('0');

	const handleChange1 = (event: { target: { name: string } }) => {
		setChecked(event.target.name);
	}

	return (
		<div>
            {/* XD - 1,10 */}
			<div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('KPI Dashboard')}</h1>
                    <p className='text-primary'>{t('Welcome Smith')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-gray w-full md:w-[150px]' type='submit' label={t('All Locations')} title={`${t('All Locations')}`}>
                        <Map className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='btn btn-gray w-full md:w-[150px]' type='submit' label={t('Last Month')} title={`${t('Last Month')}`}>
                        <Calendar className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title=''>
                        <Equalizer className='order-2' fontSize='18' />
                    </Button>
                </div>
            </div>

            {/* XD - 3 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Composter Insights')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-gray w-full md:w-[150px]' type='submit' label={t('Last Month')} title={`${t('Last Month')}`}>
                        <Calendar className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title=''>
                        <Equalizer className='order-2' fontSize='18' />
                    </Button>
                </div>
            </div>

            {/* XD - 5 t0 9 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Pile Temperature')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-gray w-full md:w-[145px]' type='submit' label={t('North Dock')} title={`${t('North Dock')}`}>
                        <Map className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='btn btn-gray w-full md:w-[110px]' type='submit' label={t('Today')} title={`${t('Today')}`}>
                        <Calendar className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title=''>
                        <Share1 className='order-2' fontSize='16' />
                    </Button>
                    <Button className='w-full btn btn-primary md:w-[50px]' type='submit' label={''} title=''>
                        <Printer className='order-2 fill-white' fontSize='18' />
                    </Button>
                </div>
            </div>

            {/* XD - 12 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Diversion Report')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-gray w-full md:w-[192px]' type='submit' label={t('777 Hornby Street')} title={`${t('777 Hornby Street')}`}>
                        <Map className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='btn btn-gray w-full md:w-[110px]' type='submit' label={t('Month')} title={`${t('Month')}`}>
                        <Calendar className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='btn btn-gray w-full md:w-[94px]' type='submit' label={t('Year')} title={`${t('Year')}`}>
                        <Calendar className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-normal btn-secondary md:w-[160px] whitespace-nowrap' type='submit' label={'Schedule Report'} title={`${t('Schedule Report')}`} />
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title='Download'>
                        <Download className='order-2' fontSize='18' />
                    </Button>
                </div>
            </div>

            {/* XD - 15 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Waste Audit Reports')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='w-full btn btn-primary md:w-[50px]' type='submit' label={''} title=''>
                        <Layout className='order-2 fill-white' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title='Sort'>
                        <Sorting className='order-2' fontSize='18' />
                    </Button>
                    <DropDown placeholder={'New to Old'} label={t('Sort By')} name={checked} onChange={handleChange1} value='appLanguage' className='flex whitespace-nowrap flex-wrap [&>label]:m-0 items-baseline gap-3' error="" options={SettingsDrpData} id='appLanguage' />
                    <Button className='w-full btn btn-normal btn-secondary md:w-[200px] whitespace-nowrap' type='submit' label={'+ New Audit Request'} title={`${t('New Audit Report')}`} />
                </div>
            </div>

            {/* XD - 17 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    {/* <h1>{t('All Courses')}</h1> */}
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title='Filter'>
                        <Filter className='order-2' fontSize='17' />
                    </Button>
                    <Button className='w-full btn btn-primary md:w-[160px]' type='submit' label={'+ Create Course'} title={`${t('Create Course')}`} />
                </div>
            </div>

            {/* XD - 26 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('TFS Courses Templates')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='w-full btn btn-primary md:w-[50px]' type='submit' label={''} title='Filter'>
                        <Filter className='order-2 fill-white' fontSize='17' />
                    </Button>
                </div>
            </div>

            {/* XD - 45 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Tenant Details')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-gray w-full md:w-[190px]' type='submit' label={t('+ Add New Location')} title={`${t('Add New Location')}`}  />
                    <Button className='btn btn-gray w-full md:w-[210px]' type='submit' label={t('Toronto Eaton Center')} title={`${t('Toronto Eaton Center')}`} >
                        <Map className='order-2 ml-2 stroke-2' fontSize='18' />
                    </Button>
                </div>
            </div>

            {/* XD - 78 */}
            <div className='flex flex-wrap justify-between gap-3 p-5 shadow-header'>
                <div className='w-full md:w-auto'>
                    <h1>{t('Quiz')}</h1>
                    <p className='text-primary'>{t('Breadcrumbs')}</p>
                </div>
                <div className='flex flex-wrap w-full gap-3 md:gap-5 md:w-auto'>
                    <Button className='btn btn-large btn-normal btn-success w-full text-xl md:text-2xl md:w-[166px]' type='submit' label={t('00')} title=''>
                        <Clock className='mr-4 fill-white' fontSize='30' />
                    </Button>
                </div>
            </div>
		</div>
	);
};
export default NewUpdatedHeader;
