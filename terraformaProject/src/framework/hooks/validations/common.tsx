import * as Yup from 'yup';
import { EMAIL_REGEX, NAME_VALIDATION, PASSWORD_REGEX } from '@config/regex';
import { translationFun } from '@utils/helpers';

const useCommonValidationFields = () => {
	const password = Yup.string().max(20, translationFun('Please enter valid password(only 20 characters allowed)')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter a password'));
	const confirmPasswordCommon = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.oneOf([Yup.ref('password'), null], translationFun('Confirm Password should match with password'));
	const firstName = Yup.string()
		.required(translationFun('Please enter first name'))
		.min(1, translationFun('First Name should be at least 1 characters'))
		.max(100, translationFun('First Name should not exceed 100 characters'))
		.matches(NAME_VALIDATION, translationFun('Please enter a valid first name (only characters allowed)'));

	const lastName = Yup.string()
		.required(translationFun('Please enter last name'))
		.min(1, translationFun('Last Name should be at least 1 characters'))
		.max(100, translationFun('Last Name should not exceed 100 characters'))
		.matches(NAME_VALIDATION, translationFun('Please enter a valid last name (only characters allowed)'));
	const email = Yup.string().max(50, translationFun('Email must be less than 50 characters')).matches(EMAIL_REGEX, translationFun('Please enter a valid email')).required(translationFun('Please enter an email'));
	const status = Yup.string().required(translationFun('Please enter status'));
	const address = Yup.string()
		.required(translationFun('Please enter address'))
		.min(3, translationFun('Address should not be less than 3 characters.'))
		.max(200, translationFun('Address must be at most 200 characters'));
	const startDate = Yup.date().required(translationFun('Please select the start date'));
	const invoiceDate = Yup.date().required(translationFun('Please select the date.'));
	const endDate = Yup.date().min(Yup.ref('startDate'), translationFun('End date cannot be earlier than start date')).required(translationFun('Please select the end date'));
	const image = Yup.mixed()
		.required(translationFun('Image is required'))
		.test('fileFormat', 'Unsupported file format', (value) => value && ['image/jpeg', 'image/png'].includes(value.type))
		.test('fileSize', 'File size is too large Accept Only 2 Mb or less then 2 Mb Image', (value) => value && value.size <= 2000000);
	const title = Yup.string()
		.required(translationFun('Please enter title'))
		.min(2, translationFun('Title be at least 2 characters'))
		.max(100, translationFun('Title must be at most 100 characters'));
	const countryID = Yup.string().when('phone_number',{
		is:(value:string|number)=>!!value,
		then:Yup.string().required(translationFun('Please select country code')),
		otherwise:Yup.string().notRequired()
	});
	const contactNo = Yup.string()
		.matches(/^\d{8,14}$/, translationFun('Please enter a valid phone number between 8 to 14 digits'))
		.notRequired();
		const chapterName = Yup.string()
		.required(translationFun('Please enter chapter name'))
		.min(2, translationFun('Chapter name be at least 2 characters'))
		.max(100, translationFun('Chapter name must be at most 100 characters'));
	return {
		password,
		email,
		firstName,
		lastName,
		status,
		startDate,
		invoiceDate,
		endDate,
		address,
		image,
		title,
		contactNo,
		confirmPasswordCommon,
		countryID,
		chapterName
	};
};

export default useCommonValidationFields;
