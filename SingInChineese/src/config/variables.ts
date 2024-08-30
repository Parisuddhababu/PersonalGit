const BASE_URL = process.env.REACT_APP_API_GATEWAY_URL;
const AUTH_URL = '/authentication';
const ADMIN_URL = '/admin';

export const URL_PATHS = {
	// authentication
	login: `${BASE_URL}${AUTH_URL}${ADMIN_URL}/login`,
	logOut: `${BASE_URL}${AUTH_URL}/admin-logout`,
	forgotPassword: `${BASE_URL}${AUTH_URL}${ADMIN_URL}/forgot-password`,
	resetPassword: `${BASE_URL}${AUTH_URL}${ADMIN_URL}/reset-password?token=`,
	resetChildPassword: `${BASE_URL}${AUTH_URL}/reset-password/child?token=`,
	changePassword: `${BASE_URL}${AUTH_URL}${ADMIN_URL}/change-password`,
	verifyEmail: `${BASE_URL}${AUTH_URL}/verify-email?token=`,

	// Onboarding
	onboarding: `${BASE_URL}${ADMIN_URL}/onboarding`,

	// User management
	userManagement: `${BASE_URL}${ADMIN_URL}/users/`,
	exportUserManagement: `${BASE_URL}${ADMIN_URL}/users/export`,

	// Sign On Placement
	signOnPlacementLevel: `${BASE_URL}${ADMIN_URL}/sign-on-placement/level`,
	signOnPlacementAddActivity: `${BASE_URL}${ADMIN_URL}/sign-on-placement/activity`,

	// Exam Result
	examResultDetail: `${BASE_URL}${ADMIN_URL}/sign-on-placement/users`,

	// General setting
	setting: `${BASE_URL}${ADMIN_URL}/general-setting`,

	//Level Listing
	level: `${BASE_URL}${ADMIN_URL}/level`,

	//subscription
	subscription: `${BASE_URL}${ADMIN_URL}/subscription`,
	subscriptionTypeList: `${BASE_URL}${ADMIN_URL}/subscription-type/list`,

	//Role Management
	role: `${BASE_URL}${ADMIN_URL}/role`,

	//Role Permissions
	rolePermissions: `${BASE_URL}${ADMIN_URL}/role-permissions`,

	//Country management
	country: `${BASE_URL}${ADMIN_URL}/country-code`,

	//Lesson management
	lesson: `${BASE_URL}${ADMIN_URL}/lesson`,

	//Topic Management
	topic: `${BASE_URL}${ADMIN_URL}/topic`,

	// Activity Management
	activityTypeListing: `${BASE_URL}${ADMIN_URL}/activity/types`,
	allActivityListing: `${BASE_URL}${ADMIN_URL}/activity/list`,
	addActivity: `${BASE_URL}${ADMIN_URL}/activity`,
	uploadMultiPart: `${BASE_URL}${ADMIN_URL}/activity/upload-files-multipart`,

	// Multi-part Upload
	initializeMultipartUpload: `${BASE_URL}${ADMIN_URL}/activity/uploads/initializeMultipartUpload`,
	getMultipartPreSignedUrls: `${BASE_URL}${ADMIN_URL}/activity/uploads/getMultipartPreSignedUrls`,
	finalizeMultipartUpload: `${BASE_URL}${ADMIN_URL}/activity/uploads/finalizeMultipartUpload`,

	//CMS page management
	pages: `${BASE_URL}${ADMIN_URL}/cms/page`,

	// Pet store management
	pet: `${BASE_URL}${ADMIN_URL}/pet/`,

	// Sub Admin management
	subAdmin: `${BASE_URL}/sub-admin/`,

	//Karaoke Management
	karaoke: `${BASE_URL}${ADMIN_URL}/karaoke`,

	// User role permissions
	adminUsersPermissions: `${BASE_URL}${ADMIN_URL}/user-permissions/`,

	//Seasonal topics
	seasonalTopics: `${BASE_URL}${ADMIN_URL}/seasonal-topic`,
	seasonalLessons: `${BASE_URL}${ADMIN_URL}/seasonal-lesson`,
	seasonalActivities: `${BASE_URL}${ADMIN_URL}/seasonal-activities`,

	//PetStore Management
	petStore: `${BASE_URL}${ADMIN_URL}/pet-store-products`,

	// flashCard categories
	flashCardCategories: `${BASE_URL}${ADMIN_URL}/flash-card-category`,
	flashCard: `${BASE_URL}${ADMIN_URL}/flash-card`,

	// whyItWorks
	whyItWorks: `${BASE_URL}${ADMIN_URL}/whyitworks`,

	//SoundManagement
	sound: `${BASE_URL}${ADMIN_URL}/sound`,

	// Dashboard
	dashboardDetails: `${BASE_URL}${ADMIN_URL}/dashboard/details`,
	dashboardSubscriptionPlan: `${BASE_URL}${ADMIN_URL}/dashboard/subscriptions`,
	dashboardRevenue: `${BASE_URL}${ADMIN_URL}/dashboard/revenue`,
	dashboardKidsGraph: `${BASE_URL}${ADMIN_URL}/dashboard/kids-graph`,
	dashboardKidsGenderGraph: `${BASE_URL}${ADMIN_URL}/dashboard/kids-gender-graph`,
	dashboardSchool: `${BASE_URL}${ADMIN_URL}/dashboard/school-admin`,
	dashboardTeacher: `${BASE_URL}${ADMIN_URL}/dashboard/teacher-admin`,
	dashboardSchoolDueDate: `${BASE_URL}${ADMIN_URL}/dashboard/school-due-date`,
	dashboardSchoolRevenue: `${BASE_URL}${ADMIN_URL}/dashboard/school-revenue`,

	//Ad & Star Management
	starManagement: `${BASE_URL}${ADMIN_URL}/adv-star-management`,

	// Vocabularies
	vocabularies: `${BASE_URL}${ADMIN_URL}/vocabulary`,

	// Contact Us
	contactUs: `${BASE_URL}${ADMIN_URL}/contact-us`,

	//School management
	schools: `${BASE_URL}${ADMIN_URL}/school`,
	topics: `${BASE_URL}${ADMIN_URL}/level/topics`,
	teacher: `${BASE_URL}${ADMIN_URL}/teacher`,
	classroom: `${BASE_URL}${ADMIN_URL}/class-room`,
	parent: `${BASE_URL}${ADMIN_URL}/parent`,
	student: `${BASE_URL}${ADMIN_URL}/child`,
};
