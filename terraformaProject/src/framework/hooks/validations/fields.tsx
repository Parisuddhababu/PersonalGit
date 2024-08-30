/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Yup from 'yup';
import { NAME_VALIDATION, PASSWORD_REGEX, PHONE_REGEX, SUBSCRIBER_LOCATIONS } from '@config/regex';
import { translationFun } from '@utils/helpers';

const useValidationFields = () => {
	const commonYouTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/[^\/]+\/)?|youtu\.be\/)/;
	const watchLinkRegex = /(watch\?v=|embed\/|v\/|c\/|e\/|u\/\w+\/|user\/\w+\/videos\/)?/;
	const videoIdRegex = /([^#&?]+)/;
	const timeParameterRegex = /([?&]t=([^#&?]*))?/;

	const youtubeUrlMerge = new RegExp(
		commonYouTubeRegex.source +
		watchLinkRegex.source +
		videoIdRegex.source +
		timeParameterRegex.source
	);

	const oldPassword = Yup.string().required(translationFun('Please enter current password')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter a password'))
		.test(
			'no-spaces',
			translationFun('Spaces are not allowed in the password'),
			value => value !== undefined && !/\s/.test(value)
		);
	const newPassword = Yup.string().max(20, translationFun('Please enter valid password(only 20 characters allowed)')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter new password'))
		.test(
			'no-spaces',
			translationFun('Spaces are not allowed in the password'),
			value => value !== undefined && !/\s/.test(value)
		);
	const confirmPassword = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.oneOf([Yup.ref('newPassword'), null], translationFun('Confirm Password should match with password'))
		.matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter confirm password')).test(
			'no-spaces',
			translationFun('Spaces are not allowed in the password'),
			value => value !== undefined && !/\s/.test(value)
		);
	const descriptionEnglish = Yup.string().required(translationFun('Please enter description')!);
	const metaTitleEnglish = Yup.string().required(translationFun('Please enter meta title')!);
	const metaDescriptionEnglish = Yup.string().required(translationFun('Please enter meta description')!);
	const categoryId = Yup.string().required(translationFun('Please enter tag name')).min(2, 'tag should not be less than 2 characters Please enter valid subject(only character allow)').matches(NAME_VALIDATION, 'Please enter tag(only character allow)').max(100, translationFun('Enter less then 100 characters'));
	const categoryDescription = Yup.string().required(translationFun('Please enter tag description')).min(5, 'tag should not be less than 5 characters Please enter valid description').matches(NAME_VALIDATION, 'Please enter tag description (only character allow)').max(200, translationFun('Enter less then 200 characters'));
	const suggestion = Yup.string().required(translationFun('Please enter suggestion')!);
	const parentCategory = Yup.string().required(translationFun('Please Select Category')!);
	const suggestionstatus = Yup.string().required(translationFun('Please select status')!);
	const fromUserId = Yup.string().required(translationFun('Please enter from name')!);
	const toUserId = Yup.string().required(translationFun('Please enter to name')!);
	const review = Yup.string().required(translationFun('Please enter review')!);
	const rating = Yup.number().required(translationFun('Please enter rating')!).min(0, translationFun('Rating should not be less than 0')).max(5, 'Rating should not be greater than 5');
	const name = Yup.string().required(translationFun('Please enter country name')).matches(NAME_VALIDATION, translationFun('Please enter valid first name(only character allow)'));
	const countryCode = Yup.string().required(translationFun('Please enter country code')).max(3, translationFun('The country code may not be greater than 3 characters.'));
	const stateName = Yup.string().required(translationFun('Please enter stateName')).min(3, translationFun('State Name should not be less than 3 characters Please enter valid state name(only character allow)')).matches(NAME_VALIDATION, translationFun('Please enter valid state name(only character allow)'));
	const stateCode = Yup.string().required(translationFun('Please enter statecode')).max(3, translationFun('The state code may not be greater than 3 characters.'));
	const countryId = Yup.string().required(translationFun('Please select country code'));
	const cityName = Yup.string().required(translationFun('Please enter city name')).min(3, translationFun('city Name should not be less than 3 characters Please enter valid city name(only character allow)')).matches(NAME_VALIDATION, translationFun('Please enter valid city name(only character allow)'));
	const cityCountryId = Yup.string().required(translationFun('Please select country'));
	const stateId = Yup.string().required(translationFun('Please select state'));
	const topicId = Yup.string().required(translationFun('Please select FAQ topic'));
	const questionEnglish = Yup.string().required(translationFun('Please enter question'));

	const answerEnglish = Yup.string().required(translationFun('Please enter answer'));

	const enquirename = Yup.string().required(translationFun('Please enter name')).min(3, 'name should not be less than 3 characters Please enter name').matches(NAME_VALIDATION, 'Please enter name');

	const message = Yup.string().required(translationFun('Please enter message'));
	const subject = Yup.string().required(translationFun('Please enter subject')).min(3, 'subject should not be less than 3 characters Please enter valid subject(only character allow)').matches(NAME_VALIDATION, 'Please enter valid subject(only character allow)');
	const siteName = Yup.string().required(translationFun('Please enter site name')).min(3, 'site name should not be less than 3 characters Please enter valid site name(only character allow)').matches(NAME_VALIDATION, 'Please enter valid site name(only character allow)');
	const tagLine = Yup.string().required(translationFun('Please enter tag line')).min(3, 'tag line should not be less than 3 characters Please enter valid tag line(only character allow)').matches(NAME_VALIDATION, 'Please enter valid tag line(only character allow)');
	const supportEmail = Yup.string().email(translationFun('Please enter valid support email')).required(translationFun('Please enter valid support email'));
	const contactEmail = Yup.string().email(translationFun('Please enter contact email')).required(translationFun('Please enter contact email'));

	const contactNumber = Yup.string().matches(PHONE_REGEX, translationFun('Please enter valid phone number with atleast 10 digits')).required(translationFun('Please enter contact number'));
	const pronounce = Yup.string().required(translationFun('Please select pronounce'));
	const appLanguage = Yup.string().required(translationFun('Please select language'));
	const logo = Yup.mixed().notRequired();
	const eventName = Yup.string().required(translationFun('Please enter event name'));
	const announcementType = Yup.string().required(translationFun('Please select type'));
	const description = Yup.string().required(translationFun('Please enter description'));
	const categoryName = Yup.string().required(translationFun('Please enter category name'));
	const template = Yup.string().required(translationFun('Please enter template'));
	const BannerTitle = Yup.string().required(translationFun('Please enter banner title'));
	const BannerImage = Yup.string().required(translationFun('Please upload banner image'));
	const ruleName = Yup.string().required(translationFun('Please enter rule name'));
	const descriptionenter = Yup.string().required(translationFun('Please enter description'));
	const priority = Yup.string().required(translationFun('Please select priority'));
	const onAction = Yup.string().required(translationFun('Please select on action'));
	const role = Yup.string().required(translationFun('Please enter role name.')).min(3, 'role name should not be less than 3 characters Please enter valid role name').matches(NAME_VALIDATION, 'Please enter role name (only character allow)').max(100, translationFun('Enter less then 100 characters'));
	const couponName = Yup.string().required(translationFun('Please enter offer name'));
	const couponCode = Yup.string().length(6, 'Coupon code must 6 characters length').required(translationFun('Please select coupon code'));
	const percentage = Yup.number().required(translationFun('Please enter value')).min(0, translationFun('should not be less than zero')).max(100, translationFun('should be lessthan 100')).required(translationFun('Please enter value'));
	const startTime = Yup.date().required(translationFun('Please select the start date'));
	const expireTime = Yup.date().min(Yup.ref('startTime'), translationFun('End date cannot be earlier than start date')).required(translationFun('Please select the end date'));
	const selectedUsers = Yup.array().of(Yup.number());
	const couponType = Yup.string().required(translationFun('Coupon Type is required'));
	const isReusable = Yup.string().required(translationFun('Please select offer usage'));
	const applicable = Yup.string().required(translationFun('Please select applicable users'));
	const gender = Yup.string().required(translationFun('Please select your gender'));

	const dateOfBirth = Yup.date().max(new Date(), 'Date of birth cannot be in the future').required(translationFun('Please select date of birth'));
	const userName = Yup.string()
		.required(translationFun('Please enter username'))
		.matches(/^[a-zA-Z0-9_-]+$/, translationFun('Please enter valid username'));
	const contentpagetitle = Yup.string().required(translationFun('Please enter content page title'));
	const oldPasswordsubadmin = Yup.string().required(translationFun('Please enter old password'));
	const newPasswordsubadmin = Yup.string().max(15, translationFun('Enter less than 16 characters')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter a password')).test(
		'no-spaces',
		translationFun('Spaces are not allowed in the password'),
		value => value !== undefined && !/\s/.test(value)
	);
	const categorSuggestion = Yup.string().required(translationFun('Please select category'));
	const subscribedcompany = Yup.string()
		.required(translationFun('Please enter subscribed company'))
		.min(3, 'Subscribed company name should not be less than 3 characters')
		.test('is-valid', 'Please enter valid subscribed company name (only characters allowed)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Subscribed company name should not be more than 100 characters');
	const subscribername = Yup.string()
		.required(translationFun('Please enter name'))
		.min(1, 'Name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Name should not be more than 100 characters');
	const subscriberFirstName = Yup.string()
		.required(translationFun('Please enter first name'))
		.min(1, 'First name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid first name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Name should not be more than 100 characters');
	const subscriberLastName = Yup.string()
		.required(translationFun('Please enter last name'))
		.min(1, 'Last name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid last name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Name should not be more than 100 characters');
	const planstatusmonths = Yup.string().required(translationFun('Please select plan status'));
	const endadate = Yup.string().required(translationFun('Please select end date'));
	const numberusers = Yup.string().required(translationFun('Please select category'));
	const planstatus = Yup.string().required(translationFun('Please select status'));
	const plannumber =
		Yup.string()
			.trim()
			.matches(/^[^\s].*/, translationFun('Cannot start with a space'))
			.required(translationFun('Please enter phone number'))
			.min(10, translationFun('Please Enter 10 digits'));

	const SubscribercountryCode = Yup.string().when('PhoneNumber', {
		is: (value: string | number) => !!value,
		then: Yup.string().required(translationFun('Please select country code')),
		otherwise: Yup.string().notRequired()
	});
	const SubscriberImage = Yup.string().required(translationFun('Please upload subscriber image'));

	const technicalName =
		Yup.string()
			.required(translationFun('Please enter name'))
			.min(1, 'Name should not be less than 1 characters')
			.test('is-valid', 'Please enter valid name(only character allow)', value => {
				if (value) {
					return NAME_VALIDATION.test(value);
				}
				return true;
			})
			.max(100, 'Name should not be more than 100 characters');

	const technicalImageUrl = Yup.string().required(translationFun('Please upload image'));
	const technicalDescription = Yup.string().required(translationFun('Please enter description')!)
		.min(3, translationFun('Description must be at least 3 characters'))
		.max(200, translationFun('Description should not be more than 200 characters'));

	const technicalParentId = Yup.string().required(translationFun('Please select parent category name'))
	const selectCourse = Yup.string().required(translationFun('Please select course'));

	const highlights1 = Yup.string()
		.min(2, translationFun('Highlights 1 must be at least 2 characters'))
		.max(100, translationFun('Highlights 1 must be at most 100 characters'));

	const highlights2 = Yup.string()
		.min(2, translationFun('Highlights 2 must be at least 2 characters'))
		.max(100, translationFun('Highlights 2 must be at most 100 characters'));

	const highlights3 = Yup.string()
		.min(2, translationFun('Highlights 3 must be at least 2 characters'))
		.max(100, translationFun('Highlights 3 must be at most 100 characters'));

	const highlights4 = Yup.string()
		.min(2, translationFun('Highlights 4 must be at least 2 characters'))
		.max(100, translationFun('Highlights 4 must be at most 100 characters'));

	const courseSubTitle = Yup.string()
		.required(translationFun('Please enter course subtitle'))
		.min(2, translationFun('Course subtitle must be at least 2 characters'))
		.max(100, translationFun('Course subtitle must be at most 100 characters'));

	const courseTitle = Yup.string()
		.required(translationFun('Please enter course title'))
		.min(2, translationFun('Course title must be at least 2 characters'))
		.max(100, translationFun('Course title must be at most 100 characters'));

	const prerequisite = Yup.string()
		.required(translationFun('Please enter prerequisite'))
		.min(2, translationFun('Prerequisite must be at least 2 characters'))
		.max(100, translationFun('Prerequisite must be at most 100 characters'));

	const qualification = Yup.string()
		.min(2, translationFun('Qualification must be at least 2 characters'))
		.max(100, translationFun('Qualification must be at most 100 characters'));

	const instructorName = Yup.string()
		.required(translationFun('Please enter instructor name'))
		.min(2, translationFun('Instructor name must be at least 2 characters'))
		.max(100, translationFun('Instructor name must be at most 100 characters'));
	const courseDescription = Yup.string()
		.required(translationFun('Please enter course description'))
		.min(2, translationFun('course description must be at least 2 characters'))
		.max(1000, translationFun('course description must be at most 1000 characters'));

	const selectLevel = Yup.string().required(translationFun('Please select Level'));
	const category = Yup.string();
	const subCategory = Yup.string().required(translationFun('Please select sub category'));
	const addPrerequisite = Yup.boolean().oneOf([true], translationFun('You must accept the add prerequisite'));
	const instructorProfilePreview = Yup.string().required(translationFun('Please upload instructor profile'));
	const courseImagePreview = Yup.string().required(translationFun('Please upload course image'));
	const bannerImagePreview = Yup.string().required(translationFun('Please upload banner image'));
	const selectedIntendedLearners = Yup.array().min(1, (translationFun('Please selected intended learners')));
	const fileUploading = Yup.string().required('File Upload is required');
	const imageUploading = Yup.string().required('Image Upload is required');
	const userManualName = Yup.string()
		.required(translationFun('Please enter name'))
		.min(1, 'Name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Name should not be more than 100 characters');
	const question = Yup.string()
		.required(translationFun('Please enter Question'))
		.min(2, translationFun('Question must be at least 2 characters'))
		.max(200, translationFun('Question must be at most 200 characters'))
	const answer = Yup.string()
		.required(translationFun('Please enter answer'))
		.min(2, translationFun('Answer must be at least 2 characters'))
		.max(1000, translationFun('Answer must be at most 1000 characters'));
	const title = Yup.string().required(translationFun('Title is required'));
	const url = Yup.string().url('Invalid URL').required(translationFun('URL is required'));
	const attachment = Yup.mixed().required(translationFun('Attachment is required'));
	const youtubeUrl = Yup.string().matches(youtubeUrlMerge, 'Invalid YouTube URL').required(translationFun('YouTube URL is required'));
	const lessonImage = Yup.string().required(translationFun('Image is required'));
	const selectQuizTime = Yup.string().required(translationFun(translationFun('Please select Quiz Time')));
	const enterPassingCriterion = Yup.string()
		.required(translationFun('Please enter Passing Criterion'))
		.min(1, translationFun('Passing Criterion must be at least 1 number'))
		.max(3, translationFun('Passing Criterion must be at most 3 number'))
		.test(
			'is-between-30-and-100',
			translationFun('Passing Criterion must be between 30 and 100 percentage'),
			(value) => {
				if (!value) {
					return true;
				}
				return +value >= 30 && +value <= 100;
			}
		);
	const enterQuestion = Yup.string()
		.required(translationFun('Please enter Question'))
		.min(2, translationFun('Question must be at least 2 characters'))
		.max(50, translationFun('Question must be at most 50 characters'));
	const optionAnswer1 = Yup.string()
		.required(translationFun('Please enter Option 1'))
		.min(2, translationFun('Option 1 must be at least 2 characters'))
		.max(50, translationFun('Option 1 must be at most 50 characters'));
	const optionAnswer2 = Yup.string()
		.required(translationFun('Please enter Option 2'))
		.min(2, translationFun('Option 2 must be at least 2 characters'))
		.max(50, translationFun('Option 2 must be at most 50 characters'));
	const optionAnswer3 = Yup.string()
		.required(translationFun('Please enter Option 3'))
		.min(2, translationFun('Option 3 must be at least 2 characters'))
		.max(50, translationFun('Option 3 must be at most 50 characters'));
	const optionAnswer4 = Yup.string()
		.required(translationFun('Please enter Option 4'))
		.min(2, translationFun('Option 4 must be at least 2 characters'))
		.max(50, translationFun('Option 4 must be at most 50 characters'));
	const selectedAnswerOption = Yup.string().required(translationFun('Correct Answer Option is required'));

	const companyDescription = Yup.string().required(translationFun('Please enter a description'))
		.min(2, translationFun('Description must be at least 2 characters'))
		.max(1000, translationFun('Description must be at most 1000 characters'));
	const companyEmail = Yup.string().email(translationFun('Please enter valid email')).required(translationFun('Please enter email'));
	const companyLocation = Yup.string().required(translationFun('Please enter location'))
		.min(2, translationFun('Location must be at least 2 characters'))
		.max(100, translationFun('Location must be at most 100 characters'));
	const companyName = Yup.string().required(translationFun('Please enter company name')).min(3, translationFun('Company name should not be less than 3 characters')).max(100, translationFun('Company name should not more than 100 characters'));
	const companyPhoneNumber = Yup.string().matches(PHONE_REGEX, translationFun('Please enter valid phone number with atLeast 10 digits')).required(translationFun('Please enter phone number'));
	const companyWebsiteUrl = Yup.string().url('Invalid URL format').required('Website URL is required');
	const companyImage = Yup.string().required(translationFun('Please upload company image'));
	const userOldPassword = Yup.string().required(translationFun('Please enter current password')).max(20, translationFun('Please enter valid password(only 20 characters allowed)')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).test(
		'no-spaces',
		translationFun('Spaces are not allowed in the password'),
		value => value !== undefined && !/\s/.test(value.trim())
	);
	const userNewPassword = Yup.string().notOneOf([Yup.ref('oldPassword')], translationFun('New password must not be the same as the old password')).max(20, translationFun('Please enter valid password(only 20 characters allowed)')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter new password')).test(
		'no-spaces',
		translationFun('Spaces are not allowed in the password'),
		value => value !== undefined && !/\s/.test(value)
	);
	const userConfirmPassword = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.max(20, translationFun('Please enter valid password(only 20 characters allowed)'))
		.oneOf([Yup.ref('newPassword'), null], translationFun('Confirm password should match with password'))
		.matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character like ( @  $ % ^ & #) & minimum 8 characters')).required(translationFun('Please enter confirm password')).test(
			'no-spaces',
			translationFun('Spaces are not allowed in the password'),
			value => value !== undefined && !/\s/.test(value)
		);
	const role_id = Yup.string().required(translationFun('Please select assigned role'));
	const department = Yup.string()
		.required(translationFun('Please enter department'))
		.min(2, translationFun('Department must be at least 2 characters'))
		.max(25, translationFun('Department must be at most 25 characters'));
	const employee_id = Yup.string()
		.required(translationFun('Please enter employee id'))
		.max(10, translationFun('Employee id length must be 10 characters'))
		.matches(/[a-z,A-Z]/, translationFun('Employee id must contain atleast 1 alphabet'))
		.matches(/^[a-zA-Z0-9]+$/, 'Employee id cannot contain white space and special character')
		.matches(/\d/, translationFun('Employee id must contain atleast 1 number'));
	const location = Yup.string()
		.required(translationFun('Please enter Location'));

	const company_sub_admin = Yup.boolean();

	const reporting_manager_id = Yup.string().required(translationFun('Please select reporting manager'));
	const selectedDate = Yup.string().nullable().required('Date is required');

	const AuthorizedPersonId = Yup.array()
		.of(
			Yup.object({
				name: Yup.string().required(),
				key: Yup.string().required(),
			})
		)
		.min(1, translationFun('Please select at least one Authorized Person'));

	const UserFirstName = Yup.string()
		.required(translationFun('Please enter first name'))
		.min(1, 'First name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'first name should not be more than 100 characters');
	const UserLastName = Yup.string()
		.required(translationFun('Please enter last name'))
		.min(1, 'Last name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Last name should not be more than 100 characters');

	const UserLanguage = Yup.array().required(translationFun('Please select user language')).min(1, 'Please select user language');
	const UserEducation = Yup.array().required(translationFun('Please select user education')).min(1, 'Please select user education');
	const UserProfile = Yup.string().required(translationFun('Please upload user image'));

	const TenantCompanyName = Yup.string()
		.required(translationFun('Please enter company name'))
		.min(3, 'Company name should not be less than 3 characters')
		.test('is-valid', 'Please enter valid company name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Company name should not be more than 100 characters');
	const TenantName = Yup.string().required(translationFun('Please select type of tenant name'));
	const contractor_type_id = Yup.string().required(translationFun('Please select type of contractor name'));
	const TenantDescription = Yup.string()
		.required(translationFun('Please enter description'))
		.min(2, translationFun('Description must be at least 2 characters'))
		.max(1000, translationFun('Description must be at most 1000 characters'));
	const TenantIndustryType = Yup.string().required(translationFun('Please select industry type'));
	const TenantAttachments = Yup.mixed().required(translationFun('Attachment is required'));
	const TenantAddress = Yup.string()
		.required(translationFun('Please enter address'))
		.min(2, translationFun('Address must be at least 2 characters'))
		.max(1000, translationFun('Address must be at most 1000 characters'));
	const TenantWebsiteUrl = Yup.string().url('Invalid URL format').required('Website URL is required');
	const TenantFirstName = Yup.string()
		.required(translationFun('Please enter first name'))
		.min(1, 'First name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'First name should not be more than 100 characters');
	const TenantLastName = Yup.string()
		.required(translationFun('Please enter last name'))
		.min(1, 'Last name should not be less than 1 characters')
		.test('is-valid', 'Please enter valid name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Last name should not be more than 100 characters');
	const TenantPositionName = Yup.string()
		.required(translationFun('Please enter position name'))
		.min(3, 'position name should not be less than 3 characters')
		.test('is-valid', 'Please enter valid position name(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Position name should not be more than 100 characters');

	const branchId = Yup.array(
		Yup.object({
			key: Yup.string().required(),
			value: Yup.string().required()
		})
	)
	const selectLocation = Yup.string().required('Please select a location.');
	const companyId = Yup.string().required('Please select a contractor company.');
	const capture_rate = Yup.number()
		.required('Please enter a valid current rate.')
		.min(1, 'Value must be greater than or equal to 1')
		.max(100, 'Value must be less than or equal to 100');

	const performance_current = Yup.number()
		.required('Please enter a valid performance current.')
		.min(1, 'Value must be greater than or equal to 1')
		.max(100, 'Value must be less than or equal to 100');

	const performance_potential = Yup.number()
		.required('Please enter a valid performance potential.')
		.min(1, 'Value must be greater than or equal to 1')
		.max(100, 'Value must be less than or equal to 100');

	const locationlist = Yup.string().when('branches', {
		is: (value: string) => value && !value.length,
		then: Yup.string()
			.required(translationFun('Please enter location'))
			.min(3, 'location should not be less than 3 characters')
			.max(100, 'location should not be more than 100 characters'),
		otherwise: Yup.string()
			.notRequired()
			.min(3, 'location should not be less than 3 characters')
			.max(100, 'location should not be more than 100 characters'),
	})


	const city = Yup.string()
		.min(3, 'City should not be less than 3 characters')
		.test('is-valid', 'Please enter valid city(only character allow)', value => {
			if (value) {
				return SUBSCRIBER_LOCATIONS.test(value);
			}
			return true;
		})
		.max(100, 'City should not be more than 100 characters');
	const locationCrud = Yup.string()
		.required(translationFun('Please enter location'))
		.min(3, 'location should not be less than 3 characters')
		.max(100, 'location should not be more than 100 characters');

	const cityCrud = Yup.string()
		.required(translationFun('Please enter city'))
		.min(3, 'City should not be less than 3 characters')
		.max(100, 'City should not be more than 100 characters');

	const title_position = Yup.string()
		.required(translationFun('Please enter position'))
		.min(3, 'Position should not be less than 3 characters')
		.test('is-valid', 'Please enter valid position(only character allow)', value => {
			if (value) {
				return NAME_VALIDATION.test(value);
			}
			return true;
		})
		.max(100, 'Position should not be more than 100 characters');
	const subscriber_id = Yup.string().required('Please enter subscriber id').min(3, 'SubscriberId should not be less than 3 characters')
		.max(30, 'SubscriberId should not be more than 30 characters');

	const titleWebsite = Yup.string().required('Please enter title').min(3, 'Title should not be less than 3 characters')
		.max(100, 'Title should not be more than 100 characters');
	const subTitleWebsite = Yup.string().required('Please enter sub-title').min(3, 'Sub-title should not be less than 3 characters')
		.max(100, 'Sub-title should not be more than 100 characters');

	const serviceDescription = Yup.string().required('Please enter service description').min(10, 'Service description should not be less than 10 characters')
		.max(200, 'Service description should not be more than 200 characters');

	const serviceTitle = Yup.string().required('Please enter service title').min(3, 'Service title should not be less than 3 characters')
		.max(100, 'Service title should not be more than 100 characters');

	const serviceImage = Yup.string().required(translationFun('Service image is required'));

	const aboutTitle = Yup.string().required('Please enter title').min(3, 'Title should not be less than 3 characters')
		.max(100, 'Title should not be more than 100 characters');

	const aboutDescription = Yup.string().required('Please enter description').min(25, 'Description should not be less than 25 characters')
		.max(200, 'Description should not be more than 200 characters');

	const aboutCheckPointTitle = Yup.string().required('Please enter check point').min(3, 'Check point should not be less than 3 characters')
		.max(100, 'Check point should not be more than 100 characters');

	const ClientTitle = Yup.string().required('Please enter title').min(3, 'Title should not be less than 3 characters')
		.max(100, 'Title should not be more than 100 characters');

	const ClientDescription = Yup.string().required('Please enter description').min(25, 'Description should not be less than 25 characters')
		.max(200, 'Description should not be more than 200 characters');

	const ClientImage = Yup.string().required(translationFun('Client company logo is required'));

	const WasteTitle = Yup.string().required('Please enter title').min(3, 'Title should not be less than 3 characters')
		.max(100, 'Title should not be more than 100 characters');

	const WasteMangeTitle = Yup.string().required('Please enter collection title').min(3, 'Collection title should not be less than 3 characters')
		.max(100, 'Collection title should not be more than 100 characters');

	const WasteMangeDescription = Yup.string().required('Please enter collection description').min(25, 'Collection Description should not be less than 25 characters')
		.max(200, 'Collection Description should not be more than 200 characters');

	const WasteMangeImage = Yup.string().required(translationFun('Collection image is required'));

	const rateTitle = Yup.string().required('Please enter rating').min(3, 'Rating should not be less than 3 characters')
		.max(100, 'Rating should not be more than 100 characters');

	const rateDescription = Yup.string().required('Please enter rating description').min(5, 'Rating Description should not be less than 5 characters')
		.max(20, 'Rating Description should not be more than 200 characters');

	const WhyChooseTitle = Yup.string().required('Please enter title').min(3, 'Title should not be less than 3 characters')
		.max(100, 'Title should not be more than 100 characters');

	const WhyChooseDescription = Yup.string().required('Please enter description').min(25, 'Description should not be less than 25 characters')
		.max(1000, 'Description should not be more than 1000 characters');

	const WhyChooseImage = Yup.string().required(translationFun('Image is required'));


	const aboutCourseTitle = Yup.string().required('Please enter title').min(5, 'Title should not be less than 5 characters')
		.max(100, 'Title should not be more than 100 characters');

	const aboutCourseDescription = Yup.string().required('Please enter description').min(25, 'Description should not be less than 25 characters')
		.max(200, 'Description should not be more than 200 characters');


	const aboutCourseCheckPoint = Yup.string().required('Please enter checkpoint').min(5, 'Checkpoint should not be less than 5 characters')
		.max(42, 'Checkpoint should not be more than 42 characters');

	const testimonialTitle = Yup.string().required('Please enter title').min(5, 'Title should not be less than 5 characters')
		.max(100, 'Title should not be more than 100 characters');

	const testimonialDescription = Yup.string().required('Please enter description').min(25, 'Description should not be less than 25 characters')
		.max(200, 'Description should not be more than 200 characters');

	const testimonialName = Yup.string().required('Please enter name').min(2, 'Name should not be less than 2 characters')
		.max(100, 'Name should not be more than 100 characters');

	const testimonialImage = Yup.string().required(translationFun('Image is required'));

	const testimonialTag = Yup.string().required('Please enter tag').min(5, 'Tag should not be less than 5 characters')
		.max(25, 'Tag should not be more than 25 characters');

	const subscriptionTitle = Yup.string().required('Please enter title').min(5, 'Title should not be less than 5 characters')
		.max(100, 'Title should not be more than 100 characters');

	const subPlanName = Yup.string().required('Please enter plan').min(5, 'Plan should not be less than 5 characters')
		.max(100, 'Plan should not be more than 100 characters');
	const subPlanPrice = Yup.number().required(translationFun('Please enter price')!).min(1, translationFun('Price should not be less than 1'));

	const pointTitle = Yup.string().required('Please enter key point').min(5, 'Key point should not be less than 5 characters')
		.max(100, 'Key point should not be more than 100 characters');

	const tagTitle = Yup.string().required('Please enter title').min(2, 'Title should not be less than 2 characters')
		.max(100, 'Title should not be more than 100 characters');

	const tagDescription = Yup.string().required('Please enter description').min(3, 'Description should not be less than 3 characters')
		.max(200, 'Description should not be more than 200 characters');

	const tagType = Yup.number()
		.integer('Tag must be an integer')
		.required('Please enter tag')
		.min(0, 'Tag should not be less than 0')
		.max(3, 'Tag should not be more than 3')
		.test('is-valid-tag', 'Tag should be 1, 2, or 3', (value) => {
			return value !== undefined && [1, 2, 3].includes(value);
		});

	const category_main_id = Yup.string().required(translationFun('Please select parent category')!);
	const companyBranchId = Yup.array().of(
		Yup.object()).min(1, 'Please select location');

	const branchLocationId = Yup.string().required('Please select location');
	const diversionPercentage = Yup.number()
		.typeError(translationFun('Value must be a number'))
		.positive()
		.min(0.1, translationFun('Value cannot be zero. Please enter valid value'))
		.max(100, translationFun('Should be less than 100'))
		.test('maxDecimals', 'Diversion percentage should have up to 2 decimals', function (value) {
			if (value !== undefined && value !== null) {
				const decimalCount = (value.toString().split('.')[1] || []).length;
				return decimalCount <= 2;
			}
			return true;
		})
		.required(translationFun('Please enter value'));
	const zone = Yup.string()
		.required(translationFun('Please enter Zone'))
		.min(3, translationFun('Zone should not be less than 3 characters'))
		.max(100, translationFun('Zone should not be more than 100 characters'));
	const siteId = Yup.string().required(translationFun('Please select location'));
	const volumeTitle = Yup.string()
		.max(100, translationFun('Volume should not be more than 100 characters'))
		.required(translationFun('Please enter volume title'));
	const volumeCubicYard = Yup.number()
		.typeError(translationFun('Only number are allowed.Please enter valid value'))
		.positive(translationFun('Please enter positive numbers'))
		.required(translationFun('Please enter volume'));
	const volumeId = Yup.array().of(
		Yup.object().shape({
			uuid: Yup.string().required(translationFun('Please select volume'))
		})
	).required(translationFun('Please select volume'));
	const volumeDrp = Yup.string().required('Please select volume');
	const equipmentName = Yup.string().min(3, translationFun('Equipment name should be minimum 3 characters')).max(100, 'Equipment name should not ne more than 100 character.').required(translationFun('Please enter equipment Name'));

	const materialCategory = Yup.string().min(3, 'Material category should be min 3 characters.').max(100, 'Material category should not ne more than 100 character.').required('Please enter the material category');
	const materialType = Yup.string().min(3, 'Material type should be min 3 characters.').max(100, 'Material type should not ne more than 100 character.').required('Please enter the material type');
	const materialWeight = Yup.number()
		.typeError(translationFun('Value must be a number'))
		.positive()
		.min(0.1, translationFun('Value cannot be zero. Please enter valid value'))
		.required(translationFun('Please enter weight'));
	const materialDetails = Yup.array().of(
		Yup.object().shape({
			type: materialType,
			weight: materialWeight,
		})
	);
	const frequencyType = Yup.string()
		.min(3, 'Frequency type should be min 3 characters.')
		.max(100, 'Frequency type should not ne more than 100 character.')
		.required(translationFun('Please enter frequency type'));
	const frequency = Yup.number()
		.typeError(translationFun('Only number are allowed.Please enter valid value'))
		.positive(translationFun('Please enter positive numbers'))
		.min(0.1, translationFun('Value cannot be zero. Please enter valid value'))
		.required(translationFun('Please enter frequency'));
	const diversionUserId = Yup.string().required('Please select Employee');
	const locationId = Yup.string().notRequired();
	const materialId = Yup.string().required(translationFun('Please select material category'));
	const materialTypeId = Yup.string().required(translationFun('Please select material type')).test('isNotSelected', translationFun('Please select material type'), function () {		
		return true;
	});
	const equipmentId = Yup.string().required(translationFun('Please select equipment'));
	const location_Id = Yup.string().required(translationFun('Please select location'));
	const serviceType = Yup.string().required(translationFun('Please select service type'));

	const end_date = Yup.string().test('is-greater', translationFun('End date cannot be earlier than or equal to start date'), function (value) {
		const { start_date, end_month, start_month }: { start_date: string, end_month: string, start_month: string } = this.parent;
		const end = Number(value);
		const start = Number(start_date);
		if (end && start && start !== end && end_month === start_month) {
			return (start < end);
		}
		else if (start === end) {
			return true;
		}
		else {
			return true;
		}
	}).required(translationFun('Please select end date'));
	const end_month = Yup.string().test('is-greater', translationFun('End month cannot be earlier than or equal to start month'), function (value) {
		const { start_month }: { start_month: string } = this.parent;
		const end = Number(value);
		const start = Number(start_month);
		if (end && start && start !== end) {
			return (start < end);
		}
		else if (start === end) {
			return true;
		}
		else {
			return true;
		}
	}).when('frequency', {
		is: (value: string) => ['Monthly'].includes(value),
		then: Yup.string(),
		otherwise: Yup.string()
			.required(translationFun('Please select end month')),
	});
	const start_date = Yup.string().required(translationFun('Please select start date'));
	const start_month = Yup.string().when('frequency', {
		is: (value: string) => ['Monthly'].includes(value),
		then: Yup.string(),
		otherwise: Yup.string()
			.required(translationFun('Please select start month')),
	});
	const frequency_setting = Yup.string().required(translationFun('Please select frequency'));
	const createReport_userId = Yup.string().uuid('Please select report owner').required('Please select report owner');
	const add_units = Yup.number().positive().min(0, 'Please enter positive value').typeError('Only numbers are allowed').required('Please enter unit');
	const createReport_frequency = Yup.string().uuid('Please select frequecy').required('Please select frequecy');
	const createReport_zoneId = Yup.string().required('Please select zone');
	const weightZoneId = Yup.string().required('Please seclect zone');
	const weightServiceType = Yup.string().required('Please seclect service type');
	const weightMaterial_id = Yup.string().required('Please seclect material Category');
	const weightMaterial_type_id = Yup.string().required('Please seclect material type');
	const weightEquipmentId = Yup.string().required('Please seclect equipment');
	const weightEquipment = Yup.string().notRequired();
	const weightVolumeId = Yup.string();
	const weightfrequencyId = Yup.string().required('Please seclect frequency');
	const weightaddUnits = Yup.number().when('equipment', (equipment: string) => {
		return equipment === 'Compactor'
			? Yup.number().typeError('Only numbers are allowed')
			: Yup.number().positive('unit must be a positive number').typeError('Only numbers are allowed').required('Please enter units').when('service_type', (service_type: string) => {
				return service_type === 'Regular on call'
					? Yup.number().typeError('Only numbers are allowed')
					: Yup.number().positive('unit must be a positive number').min(0,'min value must be equal to 0').typeError('Only numbers are allowed').typeError('Only numbers are allowed').required('Please enter units').test('maxDecimals', 'Unit should have up to 2 decimals', function (value) {
						if (value !== undefined && value !== null) {
							const decimalCount = (value.toString().split('.')[1] || []).length;
							return decimalCount <= 2;
						}
						return true;
					});
			}

			);
	}

	);
	const weightLifts = Yup.number().min(0, 'min value must be equal to 0').when('equipment', (equipment: string) => {
		return ['compactor','Compactor'].includes(equipment) 
			? Yup.number().typeError('Only numbers are allowed').min(0, 'min value must be equal to 0')
			: Yup.number().positive('unit must be a positive number').min(0, 'min value must be equal to 0').typeError('Only numbers are allowed').test('maxDecimals', 'Lifts should have up to 2 decimals', function (value) {
				if (value !== undefined && value !== null) {
					const decimalCount = (value.toString().split('.')[1] || []).length;
					return decimalCount <= 2;
				}
				return true;
			}).required('Please enter lifts').when('service_type', (service_type: string) => {
				return service_type === 'Regular on call'
					? Yup.number().typeError('Only numbers are allowed').min(0, 'min value must be equal to 0')
					: Yup.number().positive('unit must be a positive number').min(0, 'min value must be equal to 0').typeError('Only numbers are allowed').test('maxDecimals', 'Lifts should have up to 2 decimals', function (value) {
						if (value !== undefined && value !== null) {
							const decimalCount = (value.toString().split('.')[1] || []).length;
							return decimalCount <= 2;
						}
						return true;
					}).required('Please enter lifts');
			}

			);
	}

	);
	const weightVolume = Yup.string().required('Please select volume');
	const weightEquipment1= Yup.string().required('Please select equipment');
	const weightapproxWeightperUnit = Yup.number();
	const weightapproxWeightperMonth = Yup.number().positive().typeError('Value must be number').min(0,'min value must be equal to 0').required('Please enter weight per month').test('maxDecimals', 'Value should have up to 2 decimals', function (value) {
		if (value !== undefined && value !== null) {
			const decimalCount = (value.toString().split('.')[1] || []).length;
			return decimalCount <= 2;
		}
		return true;
	});
	const reportDataLifts = Yup.number().positive('unit must be a positive number').typeError('Only numbers are allowed').min(0, 'min value must be equal to 0').when('service_type', (service_type: string) => {
		return service_type === 'Regular on call'
			? Yup.number().notRequired()
			: Yup.number().when('equipment', (equipment: string) => {
				return equipment === 'Compactor'
					? Yup.number().notRequired()
					: Yup.number().positive('unit must be a positive number').typeError('Only numbers are allowed').min(0, 'min value must be equal to 0').test('maxDecimals', 'Lifts should have up to 2 decimals', function (value) {
						if (value !== undefined && value !== null) {
							const decimalCount = (value.toString().split('.')[1] || []).length;
							return decimalCount <= 2;
						}
						return true;
					}).required('Please enter lifts')
			});
	});
	const reportApproxWeightpermonth = Yup.number().positive('Approx weight per month must be a positive number').when('service_type', (service_type: string) => {
		return service_type === 'Regular on call'
			? Yup.number().notRequired()
			: Yup.number().when('equipment', (equipment: string) => {
				return equipment === 'Compactor'
					? Yup.number().notRequired()
					: Yup.number().positive('Approx weight per month must be a positive number').min(0, 'min value must be equal to 0').typeError('Only numbers are allowed').test('maxDecimals', 'Approx weigth per month should have up to 2 decimals', function (value) {
						if (value !== undefined && value !== null) {
							const decimalCount = (value.toString().split('.')[1] || []).length;
							return decimalCount <= 2;
						}
						return true;
					}).required('Please enter approx weight per month')
			});
	}).typeError('Only numbers are allowed').min(0, 'min value must be equal to 0');
	const reportService = Yup.string().notRequired();
	const reportequip = Yup.string().notRequired();
	const reportdate = Yup.date().required('Please select date').typeError('Invalid entry');
	const reportWeight = Yup.number().min(0, 'min value must be equal to 0').typeError('Only numbers are allowed').required('Please enter weight');
	const contractorValidation = Yup.string().required('Please select Contractor');
	const locationCourseId = Yup.string().required('Please select location');
	const employeeId = Yup.string().required('Please select employee.');
	const option = Yup.string()
		.required(translationFun('Please enter option'))
		.min(2, translationFun('Option must be at least 2 characters'))
		.max(100, translationFun('Option must be at most 100 characters'));
	const file= Yup.string().required('File is required');
	const media = Yup.string().min(17,'Media must be at least 10 characters').required('Please enter media');
	const correctAnswer = Yup.array().min(1,'Please select atleast one correct answer');
	const minutes= Yup.number().typeError('Characters are not allowed').positive().required('Please enter mintutes').min(0).max(59,'Minutes must be less than 60.').test('maxDecimals', 'Decimals values are not allowed', function (value) {
		if (value !== undefined && value !== null) {
			const decimalCount = (value.toString().split('.')[1] || []).length;
			return !decimalCount ;
		}
		return true;
	});
	const hours = Yup.number().typeError('Characters are not allowed').positive().required('Please enter hours').min(0).test('maxDecimals', 'Decimals values are not allowed', function (value) {
		if (value !== undefined && value !== null) {
			const decimalCount = (value.toString().split('.')[1] || []).length;
			return !decimalCount;
		}
		return true;
	});
	return {
		tagTitle,
		tagDescription,
		tagType,
		subscriptionTitle,
		subPlanName,
		pointTitle,
		testimonialTitle,
		subPlanPrice,
		testimonialDescription,
		testimonialName,
		testimonialImage,
		testimonialTag,
		aboutCourseTitle,
		aboutCourseDescription,
		aboutCourseCheckPoint,
		WhyChooseTitle,
		WhyChooseDescription,
		WhyChooseImage,
		rateTitle,
		rateDescription,
		WasteTitle,
		WasteMangeTitle,
		WasteMangeDescription,
		WasteMangeImage,
		ClientTitle,
		ClientDescription,
		ClientImage,
		aboutTitle,
		aboutDescription,
		aboutCheckPointTitle,
		serviceDescription,
		serviceTitle,
		serviceImage,
		titleWebsite,
		subTitleWebsite,
		category_main_id,
		subscriber_id,
		city,
		capture_rate,
		performance_current,
		performance_potential,
		selectedDate,
		locationCrud,
		cityCrud,
		branchId,
		selectLocation,
		companyId,
		announcementType,
		oldPassword,
		contractor_type_id,
		role_id,
		department,
		employee_id,
		location,
		reporting_manager_id,
		pronounce,
		selectQuizTime,
		enterPassingCriterion,
		enterQuestion,
		optionAnswer1,
		optionAnswer2,
		optionAnswer3,
		optionAnswer4,
		selectedAnswerOption,
		lessonImage,
		title,
		url,
		attachment,
		youtubeUrl,
		question,
		answer,
		newPassword,
		instructorProfilePreview,
		courseImagePreview,
		bannerImagePreview,
		confirmPassword,
		descriptionEnglish,
		metaTitleEnglish,
		metaDescriptionEnglish,
		categoryId,
		categoryDescription,
		parentCategory,
		suggestion,
		fromUserId,
		toUserId,
		review,
		rating,
		name,
		countryCode,
		stateName,
		stateCode,
		countryId,
		cityName,
		cityCountryId,
		stateId,
		topicId,
		questionEnglish,
		answerEnglish,
		enquirename,
		message,
		subject,
		siteName,
		tagLine,
		appLanguage,
		logo,
		eventName,
		description,
		categoryName,
		template,
		BannerTitle,
		ruleName,
		descriptionenter,
		priority,
		onAction,
		role,
		couponName,
		couponCode,
		percentage,
		startTime,
		expireTime,
		selectedUsers,
		couponType,
		isReusable,
		applicable,
		gender,
		dateOfBirth,
		userName,
		contentpagetitle,
		BannerImage,
		supportEmail,
		contactEmail,
		contactNumber,
		suggestionstatus,
		oldPasswordsubadmin,
		newPasswordsubadmin,
		categorSuggestion,
		subscribedcompany,
		subscribername,
		planstatusmonths,
		endadate,
		numberusers,
		planstatus,
		plannumber,
		SubscribercountryCode,
		SubscriberImage,
		technicalName,
		technicalImageUrl,
		technicalDescription,
		technicalParentId,
		selectCourse,
		highlights1,
		highlights2,
		highlights3,
		highlights4,
		courseSubTitle,
		courseTitle,
		selectLevel,
		prerequisite,
		qualification,
		instructorName,
		category,
		subCategory,
		addPrerequisite,
		courseDescription,
		selectedIntendedLearners,
		companyDescription,
		companyEmail,
		companyImage,
		companyLocation,
		companyName,
		companyPhoneNumber,
		companyWebsiteUrl,
		fileUploading,
		imageUploading,
		userManualName,
		userOldPassword,
		userNewPassword,
		userConfirmPassword,
		UserFirstName,
		UserLastName,
		UserLanguage,
		UserEducation,
		UserProfile,
		TenantCompanyName,
		TenantName,
		TenantDescription,
		TenantIndustryType,
		TenantAttachments,
		TenantAddress,
		TenantWebsiteUrl,
		TenantFirstName,
		TenantLastName,
		TenantPositionName,
		AuthorizedPersonId,
		title_position,
		company_sub_admin,
		locationlist,
		subscriberLastName,
		subscriberFirstName,
		companyBranchId,
		branchLocationId,
		diversionPercentage,
		zone,
		siteId,
		diversionUserId,
		locationId,
		volumeTitle,
		volumeCubicYard,
		volumeId,
		equipmentName,
		materialCategory,
		materialType,
		materialWeight,
		materialDetails,
		frequencyType,
		frequency,
		createReport_userId,
		add_units,
		createReport_frequency,
		createReport_zoneId,
		materialId,
		materialTypeId,
		equipmentId,
		location_Id,
		serviceType,
		end_date,
		end_month,
		frequency_setting,
		start_date,
		start_month,
		weightZoneId, weightServiceType, weightMaterial_id, weightMaterial_type_id, weightEquipmentId, weightEquipment, weightVolumeId, weightfrequencyId, weightaddUnits, weightLifts, weightVolume, weightapproxWeightperUnit, weightapproxWeightperMonth, reportDataLifts, reportApproxWeightpermonth, reportService, reportequip, reportWeight, reportdate, contractorValidation
		,volumeDrp,weightEquipment1,
		locationCourseId,
		employeeId,
		option,
		file,
		media,
		correctAnswer,
		minutes,
		hours
	};
};

export default useValidationFields;
