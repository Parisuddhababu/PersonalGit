import * as Yup from 'yup';
import { BRAND_NAME_VALIDATION, NAMEVALIDATION, ONLY_FLOAT, PASSWORD_REGEX, PHONECODE_REGEX, PHONEREGEX, VALID_NAME } from '@config/regex';

const useValidationFields = () => {
	const oldPassword = Yup.string().required('Old password is required');
	const currentPassword = Yup.string().required('Current password is required');
	const newPassword = Yup.string().required('New password is required').matches(PASSWORD_REGEX, ('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters')).max(20, 'Enter less than or equal to 20 characters');
	const confirmPassword = Yup.string()
		.required(('Confirm password is required'))
		.max(20, ('Enter less than or equal to 20 characters'))
		.oneOf([Yup.ref('newPassword'), null], ('Confirm password should match with new password'));
	const descriptionEnglish = Yup.string().required(('Description is required'));
	const metaTitleEnglish = Yup.string().required(('Meta title is required'));
	const metaDescriptionEnglish = Yup.string().required(('Meta description is required'));
	const name = Yup.string().required(('Country name is required')).matches(NAMEVALIDATION, ('Please enter valid first name(only character allow)'));
	const contactEmail = Yup.string().email(('Please enter contact email')).required(('Please enter contact email'));
	const contactNumber = Yup.string().matches(PHONEREGEX, ('Invalid Mobile Number')).required(('Please enter contact number'));
	const appLanguage = Yup.string().required(('Please enter default language'));
	const description = Yup.string().required(('Description is required'));
	const descriptionenter = Yup.string().required(('Description is required'));
	const role = Yup.string().min(3, ('Role should not be less than 3 characters Please enter valid role')).max(50, ('Enter less than or equal to 50 characters')).required(('Role name is required'));
	const gender = Yup.string().required(('Gender is required'));
	const userName = Yup.string().required(('Please enter username')).matches(VALID_NAME, ('Please enter valid username')).max(50, ('User name may not be greater than 50 characters.'));
	const contentpagetitle = Yup.string().required(('Please enter content page title'));
	const oldPasswordsubadmin = Yup.string().required(('New password is required')).matches(PASSWORD_REGEX, ('New Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters')).max(20, ('Enter less than or equal to 20 characters'));
	const newPasswordsubadmin = Yup.string()
		.required('Confirm password is required')
		.matches(PASSWORD_REGEX, ('Confirm Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters'))
		.max(20, ('Enter less than or equal to 20 characters'))
		.oneOf([Yup.ref('oldPasswordsubadmin'), null], ('Confirm Password should match with new password'));
	const roleDropDown = Yup.string().required('Role is required');
	const currencyCode = Yup.string().required('Currency symbol is required').max(4, ('The currency code may not be greater than 4 characters.'));
	const phoneCode = Yup.string().required('Phone code is required').matches(PHONECODE_REGEX, 'Phone code must contain only digits').max(4, 'The phone code may not be greater than 4 digits.');
	const brandname = Yup.string().required('Domain name is required').matches(BRAND_NAME_VALIDATION, 'Domain name special characters and uppercase letter are not allowed.');
	const companyname = Yup.string().required('Company name is required');
	const brandRepresentative = Yup.string().required('Brand representative is required');
	const brandEmail = Yup.string().required('Brand email is required');
	const sessionTime = Yup.string().required('Session time is required');
	const influencerCount = Yup.string().required('Influencer count is required');
	const sessionCount = Yup.string().required('Session count is required');
	const planTitle = Yup.string().required('Plan title is required');
	const PlanDescription = Yup.string().required('Plan description is required');
	const noOfSessions = Yup.string().required('Session count is required');
	const planPrice = Yup.string().required('Plan price is required').matches(ONLY_FLOAT, 'Only positive numbers are allowed');
	const planFeature = Yup.array().of(
		Yup.object().shape({
			name: Yup.string().required('Plan feature is required'),
		})
	);
	return {
		sessionTime,
		influencerCount,
		sessionCount,
		oldPassword,
		currentPassword,
		newPassword,
		confirmPassword,
		descriptionEnglish,
		metaTitleEnglish,
		metaDescriptionEnglish,
		name,
		appLanguage,
		role,
		gender,
		userName,
		contentpagetitle,
		contactEmail,
		contactNumber,
		oldPasswordsubadmin,
		newPasswordsubadmin,
		roleDropDown,
		currencyCode,
		phoneCode,
		brandEmail,
		brandRepresentative,
		brandname,
		description,
		descriptionenter,
		companyname,
		planTitle,
		PlanDescription,
		planFeature,
		planPrice,
		noOfSessions
	};
};

export default useValidationFields;
