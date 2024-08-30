import * as Yup from 'yup';
import { FIRST_AND_LAST_NAME, IMAGESVALIDATION, NAMEVALIDATION, PASSWORD_REGEX, PASSWORD_REGEX1, PHONEREGEX } from '@config/regex';

const useCommanValidationFields = () => {
	const password = Yup.string().required('Password is required').matches(PASSWORD_REGEX, 'Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters').min(8, 'Password should not be less than 8 characters').max(20, 'Password should not be greater than 20 characters');
	const password1 = Yup.string().required('Password is required').matches(PASSWORD_REGEX1, 'Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters').min(8, 'Password should not be less than 8 characters').max(20, 'Password should not be greater than 20 characters');

	const confirmPasswordcomman = Yup.string()
		.required(('Confirm password is required'))
		.oneOf([Yup.ref('password'), null], ('Confirm Password should match with password'))
		.min(8, ('Confirm password should not be less than 8 characters'))
		.max(20, ('Confirm password should not be greater than 20 characters'));
	const firstName = Yup.string().required(('First name is required')).matches(FIRST_AND_LAST_NAME, 'First name special characters and numbers not allowed').max(50, ('First Name should not be greater than 50 characters')).matches(NAMEVALIDATION, ('Please enter valid first name (only character allow)'));
	const lastName = Yup.string().required(('Last name is required')).matches(FIRST_AND_LAST_NAME, 'Last name special characters and numbers not allowed').max(50, ('Last Name should not be greater than 50 characters')).matches(NAMEVALIDATION, ('Please enter valid last name (only character allow)'));
	const email = Yup.string().email(('Please enter valid email')).required(('Email is required'));
	const status = Yup.string().required(('Status is required'));
	const title = Yup.string().required(('Title is required'));
	const contactNo = Yup.string().matches(PHONEREGEX, ('Invalid Mobile Number')).required(('Mobile number is required'));
	const name = Yup.string().required(('Name is required')).min(3, ('Name should not be less than 3 characters')).max(50, ('Name should not be greater than 50 characters')).matches(NAMEVALIDATION, ('Please enter valid name (only character allow)'));
	const url = Yup.string().required(('Url is required'));
	const description = Yup.string().required(('Description is required'));
	const sku = Yup.string().required(('Sku is required'));
	const images = Yup.string().required(('Image is required')).matches(IMAGESVALIDATION, ('Please enter valid image URLs separated by commas. Each URL should start with "https://" or "http://".'));
	const color = Yup.string().required(('Color is required'));
	const size = Yup.string().required(('Size is required'));
	const price = Yup.string().required(('Price is required'));
	const brandname = Yup.string().required(('Brand name is required'));
	const brandRepresentative = Yup.string().required(('Brand representative is required'));
	const brandEmail = Yup.string().required(('Brand email is required'));
	const sessionTime = Yup.string().required(('Session time is required'));
	const influencerCount = Yup.string().required(('Influencer count is required'));


	return {
		password,
		password1,
		sessionTime,
		influencerCount,
		email,
		firstName,
		lastName,
		status,
		title,
		contactNo,
		confirmPasswordcomman,
		name,
		url,
		description,
		sku,
		images,
		color,
		size,
		price,
		brandname,
		brandRepresentative,
		brandEmail
	};
};

export default useCommanValidationFields;
