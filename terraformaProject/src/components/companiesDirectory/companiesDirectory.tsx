/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import { DropdownArrowDown, Filter2, Location } from '@components/icons/icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsDrpData } from '@config/constant';
import image1 from '@assets/images/companiesDirectory/ecocycle.png';
import image2 from '@assets/images/companiesDirectory/green-gaurd.png';
import image3 from '@assets/images/companiesDirectory/recycle-hub.png';
import image4 from '@assets/images/companiesDirectory/solutions.png';
import image5 from '@assets/images/companiesDirectory/greencycle.png';
import image6 from '@assets/images/companiesDirectory/recyclean.png';

const CompaniesDirectoryComponent = () => {
	const { t } = useTranslation();
	const [value, setValue] = useState<string>('');

	const handleClick = useCallback(() => {
		console.log('Test')
	}, []);

	const handleChange = (e: any) => {
		setValue(e.target.value)
	}
	
	return (
		<div>

			<div className='p-5 border border-solid border-border-primary rounded-xl mb-7'>
				<div className="flex flex-wrap items-baseline justify-between gap-5 mb-5">

					<div className="flex flex-wrap w-full gap-3 xmd:gap-4 lg:w-auto lg:flex-nowrap">
						<div className='flex flex-wrap items-center w-full gap-4 xmd:w-auto'>
							<span className='leading-5.5 w-full xmd:w-auto whitespace-nowrap'>Sort By</span>
							<div className='w-full xmd:w-[150px]'>
								<DropDown placeholder={'Course'} className='w-full -mt-2' label='' inputIcon={<DropdownArrowDown fontSize='12' />} name='appLanguage' onChange={(e:string | undefined | unknown | void) => handleChange (e)} value={value} error="" options={SettingsDrpData} id='appLanguage' />
							</div>
						</div>

						<Button className='btn-normal w-full xmd:w-[160px] md:h-[50px] whitespace-nowrap ' label={t('Filter By')} onClick={handleClick} title={`${t('Filter By')}`}>
							<Filter2 className='order-2 ml-auto'/>
						</Button>
					</div>	
				</div>

				<div className="flex flex-wrap gap-5">
					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between'>
						<div className='flex flex-col gap-5 mb-5'>
							<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image1} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>EcoCycle Solutions</h6>
								<div className="flex gap-2.5 items-center mb-2.5">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Vancouver</span> 
								</div>
								<p>EcoCycle Solutions is your eco-friendly partner in waste management. We specialize in collecting and recycling various types of waste materials, reducing environmental impact and promoting a sustainable future.</p>
							</div>
						</div>

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick} title={`${t('Request a Vendor')}`}>
						</Button>
					</div>

					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between '>
						<div className='flex flex-col gap-5 mb-5'>
							<picture className='w-full  h-[100px] md-:h[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image2} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>GreenGuard Collectors</h6>
								<div className="flex gap-2.5 items-center">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Toronto</span> 
								</div>
								<p>GreenGuard Collectors is your trusted ally in responsible waste management. Our dedicated team is committed to safeguarding the environment by efficiently collecting and recycling various forms of waste.</p>
							</div>
						</div>						

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick}  title={`${t('Request a Vendor')}`}>
						</Button>
					</div>

					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between '>
						<div className="flex flex-col gap-5 mb-5 ">
							<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image3} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>RecycleHub Pro</h6>
								<div className="flex gap-2.5 items-center">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Edmonton</span> 
								</div>
								<p>RecycleHub Pro is the ultimate solution for streamlined recycling. Our professional services make recycling easier and more efficient than ever before.</p>
							</div>
						</div>						

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick}  title={`${t('Request a Vendor')}`}>
						</Button>
					</div>
					
					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between '>
						<div className='flex flex-col gap-5 mb-5'>
							<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image4} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>EcoCycle Solutions</h6>
								<div className="flex gap-2.5 items-center mb-2.5">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Vancouver</span> 
								</div>
								<p>Earthly Harvest Recycling is your eco-friendly partner in waste management. We specialize in collecting and recycling various types of waste materials, reducing environmental impact and promoting a sustainable future.</p>
							</div>
						</div>

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick} title={`${t('Request a Vendor')}`}>
						</Button>
					</div>

					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between '>
						<div className="flex flex-col gap-5 mb-5">
							<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image5} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>GreenCycle Pro</h6>
								<div className="flex gap-2.5 items-center mb-2.5">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Kingston</span> 
								</div>
								<p>GreenCycle Pro is your eco-friendly partner in waste management. We specialize in collecting and recycling various types of waste materials, reducing environmental impact and promoting a sustainable future.</p>
							</div>
						</div>
						

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick} title={`${t('Request a Vendor')}`}>
						</Button>
					</div>

					<div className='p-5 w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)] border-border-primary border rounded-xl flex flex-col justify-between '>
						<div className="flex flex-col gap-5 mb-5">
							<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
								<img src={image6} alt="image" title=""  />
							</picture>

							<div>
								<h6 className='mb-2 leading-5'>RecyClean Pros</h6>
								<div className="flex gap-2.5 items-center mb-2.5">
									<span className='text-lg'><Location /></span>
									<span className='text-light-grey'>Vancouver</span> 
								</div>
								<p >RecyClean Pros is your eco-friendly partner in waste management. We specialize in collecting and recycling various types of waste materials, reducing environmental impact and promoting a sustainable future.</p>
							</div>
						</div>						

						<Button className='btn-secondary btn-normal w-[160px] whitespace-nowrap hover:bg-primary hover:text-white hover:after:content-[""] hover:after:inline-block hover:after:px-1 hover:after:py-0.5 hover:after:-rotate-45 hover:after:border-white hover:after:border-t-0 hover:after:border-r-0 hover:after:border-l-2 hover:after:border-b-2 hover:w-[186px] hover:after:ml-2.5' label={t('Request a Vendor')} onClick={handleClick} title={`${t('Request a Vendor')}`}>
						</Button>
					</div>

				</div>
			</div>
				<div className="flex items-center justify-center">
					<Button className='btn-primary btn-normal w-[160px] whitespace-nowrap' label={t('Load More')} onClick={handleClick} title={`${t('Load More')}`}>
					</Button>
				</div>
		</div>
	);
};
export default CompaniesDirectoryComponent;