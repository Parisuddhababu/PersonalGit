import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const commonValidation = () => {
	const { t } = useTranslation();

	const firstName = Yup.string()
		.required(t('Please enter first name') as string)
		.matches(/^[A-Za-z]+$/, t('Please enter valid first name(only character allow)') as string)
		.test('no-spaces-or-numbers', 'First Name should not be less than 3 characters', (value) => !value || !/[0-9]/.test(value))
		.trim();
	const lastName = Yup.string()
		.required(t('Please enter last name') as string)
		.trim()
		.matches(/^[A-Za-z]+$/, t('Please enter valid last name(only character allow)') as string)
		.test('no-spaces-or-numbers', 'First Name should not be less than 3 characters', (value) => !value || !/[0-9\s]/.test(value))
		.trim();
	const oldPassword = Yup.string()
		.trim()
		.matches(/^[^\s].*/, t('Please enter current password') as string)
		.required(t('Please enter current password') as string);
	const newPassword = Yup.string()
		.required(t('Please enter new password') as string)
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, t('New Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @ ! $ % ^ & #) & minimum 8 characters') as string)
		.matches(/^[^\s].*/, t('Cannot start with a space') as string);
	const confirmPassword = Yup.string()
		.trim()
		.required(t('Please confirm your password') as string)
		.oneOf([Yup.ref('newPassword'), null], t('Confirm Password should match with password') as string);
	const siteName = Yup.string()
		.trim()
		.required(t('Please enter site name') as string);
	const tagLine = Yup.string()
		.trim()
		.required(t('Please enter tag line') as string);
	const supportEmail = Yup.string()
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,}/, t('Please Enter Valid Mail') as string)
		.required(t('Please enter support email') as string)
		.trim();
	const contactEmail = Yup.string()
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, t('Please Enter Valid Mail') as string)
		.required(t('Please enter contact email') as string)
		.trim();
	const logo = Yup.mixed().required(t('Please choose file') as string);

	const favicon = Yup.mixed().required(t('Please choose file') as string);

	const logo1 = Yup.mixed().required(t('Please choose file') as string);

	const favicon1 = Yup.mixed().required(t('Please choose file') as string);

	const contactNo = Yup.string()
		.trim()
		.matches(/^[^\s].*/, t('Cannot start with a space') as string)
		.required(t('Please enter contact number') as string)
		.min(10, t('Please Enter 10 digits') as string);
	const appLanguage = Yup.string().required(t('Please enter default  Language') as string);
	const role = Yup.string()
		.trim()
		.matches(/^[^\s\d].*/, t('Cannot start with a space or number') as string)
		.required(t('Please enter role') as string);
	const title = Yup.string()
		.trim()
		.matches(/^[^\s\d].*/, t('Cannot start with a space or number') as string)
		.required(t('Please enter announcement title') as string);
	const description = Yup.string()
		.trim()
		.matches(/^[^\s\d].*/, t('Cannot start with a space or number') as string)
		.required(t('Please Enter Description') as string);
	const startDate = Yup.string().required(t('Please Select StartDate') as string);
	const endDate = Yup.string().required(t('Please Select EndDate') as string);
	const bannerTitle = Yup.string()
		.trim()
		.matches(/^[^\s\d].*/, t('Cannot start with a space or number') as string)
		.required(t('Please enter banner title') as string);

	const bannerImage = Yup.mixed().required(t('Please select file') as string);

	const bannerImage1 = Yup.string().notRequired();

	const categoryName = Yup.string()
		.matches(/^[^\s\d].*/, t('Cannot start with a space or number') as string)
		.required(t('Please enter category name') as string);
	const parentCategory = Yup.string().required('parent category required' as string);
	const email = Yup.string()
		.email(t('Invalid email') as string)
		.required(t('Please enter email') as string);
	const password = Yup.string().required(t('Please enter password') as string);
	return {
		firstName,
		lastName,
		oldPassword,
		newPassword,
		confirmPassword,
		appLanguage,
		contactNo,
		favicon,
		logo,
		contactEmail,
		supportEmail,
		tagLine,
		siteName,
		role,
		title,
		description,
		startDate,
		endDate,
		bannerTitle,
		bannerImage,
		categoryName,
		parentCategory,
		email,
		password,
		logo1,
		favicon1,
		bannerImage1,
	};
};
export default commonValidation;
