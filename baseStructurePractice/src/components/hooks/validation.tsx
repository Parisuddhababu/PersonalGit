import commonValidation from './commonValidation';
import { validationProps } from 'src/types/common';
import * as Yup from 'yup';

const useValidation = () => {
	const { firstName, lastName, oldPassword, newPassword, confirmPassword, appLanguage, contactNo, favicon, logo, contactEmail, supportEmail, tagLine, siteName, role, title, description, startDate, endDate, bannerTitle, bannerImage, categoryName, parentCategory, email, password, logo1, favicon1, bannerImage1 } = commonValidation();

	const settingsValidation = {
		appLanguage: appLanguage,
		contactNo: contactNo,
		favicon: favicon,
		logo: logo,
		contactEmail: contactEmail,
		supportEmail: supportEmail,
		tagLine: tagLine,
		siteName: siteName,
	};

	const settingsVal = {
		appLanguage: appLanguage,
		contactNo: contactNo,
		favicon: favicon1,
		logo: logo1,
		contactEmail: contactEmail,
		supportEmail: supportEmail,
		tagLine: tagLine,
		siteName: siteName,
	};
	const passwordValidation = {
		oldPassword: oldPassword,
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	};
	const updateprofileValidation = {
		firstName: firstName,
		lastName: lastName,
	};
	const roleValidation = {
		role: role,
	};
	const AnnouncementValidation = {
		title: title,
		description: description,
		startDate: startDate,
		endDate: endDate,
	};
	const manageBannerValidation = ({ params }: validationProps) => {
		return Yup.object({
			bannerTitle: bannerTitle,
			bannerImage: bannerImage,
		});
	};
	const manageBannerValidation1 = {
		bannerTitle: bannerTitle,
		bannerImage: bannerImage1,
	};

	const categoryValidation = {
		categoryName: categoryName,
		parentCategory: parentCategory,
	};
	const loginValidation = {
		email: email,
		password: password,
	};
	return {
		settingsValidation,
		passwordValidation,
		updateprofileValidation,
		roleValidation,
		AnnouncementValidation,
		manageBannerValidation,
		categoryValidation,
		loginValidation,
		settingsVal,
		manageBannerValidation1,
	};
};

export default useValidation;
