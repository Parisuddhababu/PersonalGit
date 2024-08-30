import * as Yup from 'yup';
import useCommanValidationFields from '@src/hooks/validations/common';
import useValidationFields from '@src/hooks/validations/fields';
import { validationProps } from '@src/types/common';

const useValidation = () => {
	const { email, password, firstName, lastName, status,
		contactNo,
		url,
		sku,
		images,
		color,
		size,
		price,
		password1

	} = useCommanValidationFields();
	const {
		newPassword,
		confirmPassword,
		description,
		descriptionenter,
		role,
		gender,
		roleDropDown,
		name,
		currentPassword,
		brandname,
		brandEmail,
		sessionTime,
		influencerCount,
		sessionCount,
		phoneCode,
		companyname,
		descriptionEnglish,
		planTitle,
		planFeature,
		PlanDescription,
		planPrice,
		noOfSessions
	} = useValidationFields();

	const loginValidationSchema = Yup.object({
		email: email,
		password: password1,
	});
	const suadminpasswordValidationSchema = Yup.object({
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const changeProfileValidationSchema = Yup.object({
		oldPassword: currentPassword,
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const updateAdminValidationSchema = Yup.object({
		firstName: firstName,
		lastName: lastName,
	});


	const addSettingValidationSchema = Yup.object({
		sessionTime: sessionTime,
		influencerCount: influencerCount,
		sessionCount: sessionCount
	});

	const addRoleValidationSchema = Yup.object({
		role: role,
		description: descriptionenter,
	});


	const forgotPasswordValidationSchema = Yup.object({
		email: email,
	});

	const resetPasswordValidationSchema = Yup.object({
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const catalougeValidationSchema = () => {
		return Yup.object({
			name,
			url,
			description,
			sku,
			images,
			color,
			size,
			price,
		});
	};

	const subAdminValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			email: email,
			role: roleDropDown,
			firstName: firstName,
			lastName: lastName,
			phoneNo: contactNo,
			status: status,
			gender: gender,
			...(params !== undefined
				? {}
				: {
					password: password,
				}),
		});
	};

	const influencerValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			firstName: firstName,
			lastName: lastName,
			phoneNo: contactNo,
			countryCodeId: phoneCode,
			gender: gender,
			email: email,
		});
	};
	const brandUserValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			domainName: brandname,
			companyName: companyname,
			firstName: firstName,
			lastName: lastName,
			email: brandEmail,
			countryCodeId: phoneCode,
			phoneNo: contactNo,
			influencerCount: influencerCount,
			sessionCount: sessionCount,
		});
	};

	const brandUserManagementValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			domainName: brandname,
			companyName: companyname,
			firstName: firstName,
			lastName: lastName,
			email: email,
			influencerCount: influencerCount,
			sessionCount: sessionCount,
			phoneNo: contactNo,
			countryCodeId: phoneCode,
		})
	}

	const addEditCmsValidationSchema = Yup.object({
		value: descriptionEnglish,
	});

	const subscriptionValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			planTitle: planTitle,
			planFeatures: planFeature,
			planDescription: PlanDescription,
			planPrice: planPrice,
			noOfSessions: noOfSessions
		})
	}
	return {
		loginValidationSchema,
		influencerValidationSchema,
		brandUserValidationSchema,
		changeProfileValidationSchema,
		updateAdminValidationSchema,
		addSettingValidationSchema,
		addRoleValidationSchema,
		forgotPasswordValidationSchema,
		resetPasswordValidationSchema,
		subAdminValidationSchema,
		suadminpasswordValidationSchema,
		catalougeValidationSchema,
		brandUserManagementValidationSchema,
		addEditCmsValidationSchema,
		subscriptionValidationSchema
	};
};

export default useValidation;
