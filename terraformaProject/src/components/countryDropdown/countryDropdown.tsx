import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Select from 'react-select';
import { GET_COUNTRY } from '@framework/graphql/queries/subscriber';
import { useDispatch, useSelector } from 'react-redux';
import { setCountryData } from 'src/redux/country-slice';
import { useParams } from 'react-router-dom';

interface CountryDropdownProps {
	error: string | undefined
}

interface Countries {
	value: string
	label: string;
}

const CountryDropdown = ({ error }: CountryDropdownProps) => {
	const [countries, setCountries] = useState<Countries[]>([]);
	const params = useParams();
	const { data } = useQuery(GET_COUNTRY);
	const dispatch = useDispatch();
	const { countryData } = useSelector((state: { country: { countryData: Countries } }) => state.country)

	useEffect(() => {
		if (data?.getCountries) {
			const tempDataArr = [] as Countries[];
			data?.getCountries?.data.map((data: { name: string, phoneCode: number, uuid: string }) => {
				tempDataArr.push({ value: data.uuid, label: `${data.phoneCode} ${data.name}` });
			});
			setCountries(tempDataArr);
		}
	}, [data]);

	useEffect(() => {
		if (!params?.id) {
			dispatch(setCountryData(countries?.[0]));
		} 
	}, [countries,params])

	
	return (
		<div className='inline-block w-full'>
			<Select
				options={countries}
				value={countryData}
				onChange={(countryData) => {dispatch(setCountryData(countryData))}}
				
				placeholder='Code'
				className='[&>div]:rounded-xl [&_div]:my-0 [&>div]:py-px md:[&>div]:py-1.5 [&_input]:h-[32px] [&_div]:py-0]'
			/>
			{error && <span className='relative block mt-1 md:text-xs-15 error'>{error}</span>}
		</div>
	);
};
	
export default React.memo(CountryDropdown);
