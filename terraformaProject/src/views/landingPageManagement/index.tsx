import React from 'react';
import UpdatedHeader from '@components/header/updatedHeader';
import Tabs from '@components/whatIsOrganicWaste/tabs';
import { Tab } from 'src/types/component'
import Title from '@components/landingPageTab/TitleSubtitle';
import Services from '@components/landingPageTab/services';
import AboutUs from '@components/landingPageTab/aboutUs';
import OurClient from '@components/landingPageTab/ourClient';
import WasteCollection from '@components/landingPageTab/wasteCollection';
import CompanyRating from '@components/landingPageTab/companyRating';
import WhyChooseUs from '@components/landingPageTab/whyChooseUs';
import AboutCourses from '@components/landingPageTab/aboutCourses';
import Testimonials from '@components/landingPageTab/testimonials';
import SubscriptionPlan from '@components/landingPageTab/subscriptionPlan';
import Tag from '@components/landingPageTab/tag';

const Index = () => {
	const tabs: Tab[] = [
		{ label: 'Title & Sub-Title', content: <Title />, id: 1 },
		{ label: 'Services', content: <Services />, id: 2 },
		{ label: 'About Us', content: <AboutUs />, id: 3 },
		{ label: 'Our Client', content: <OurClient />, id: 4 },
		{ label: 'Waste Collection', content: <WasteCollection />, id: 5 },
		{ label: 'Company Rating', content: <CompanyRating />, id: 6 },
		{ label: 'Why Choose Us', content: <WhyChooseUs />, id: 7 },
		{ label: 'About Course', content: <AboutCourses />, id: 8 },
		{ label: 'Testimonials', content: <Testimonials />, id: 9 },
		{ label: 'Subscription Plan', content: <SubscriptionPlan />, id: 10 },
		{ label: 'Tag', content: <Tag />, id: 11 },
	];
	return (
		<>
			<UpdatedHeader />
			<div className='mb-5 [&>.tab]:h-full [&_.tab-item]:w-auto [&_.active]:h-full md:h-[calc(100%-155px)] h-[calc(100%-118px)] [&_.tab-content]:overflow-auto [&_.tab-list]:whitespace-nowrap [&_.tab-list]:pb-2 [&_.tab-item]:px-4 [&_.tab-list]:overflow-auto [&_.tab-content]:h-[calc(100%-70px)]'>
				<Tabs tabs={tabs} containerMinimize={false} />
			</div>
		</>
	);
};
export default Index;
