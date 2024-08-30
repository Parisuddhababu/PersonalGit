export const PAGE_LENGTH = 2;
export const SHOW_PAGE_COUNT_ARR = [10, 20, 40, 50, 100];
export const IMAGE_SIZE = 10000000;
export const DEFAULT_RESOLUTION = '1920x1080';
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGINATION_LIMIT = 4;
export const DEFAULT_TRIAL_LIMIT = 7;
export const MAX_CHILDREN_ALLOWED = 3;
export const DEFAULT_GRID_VIEW_COLUMNS = 2;
export const MAX_GIF_DIMENSION = 600;
export const DEFAULT_REWARD_STARS = 0;
export const PASSWORD_MAX_LIMIT = 50;
export const MAX_IMAGE_DIMENSION = 128;
export const MAX_GAME_IMAGE_SIZE = 250000;
export const MAX_AUDIO_FILE_SIZE = 4;

export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';
export const DEFAULT_TIME_FORMAT = 'hh:mm:ss A';

export const ROUTES = {
	login: 'login',
	app: 'app',
	authentication: 'authentication',
	dashboard: 'dashboard',
	onboarding: 'onboarding',
	forgotPassword: 'forgot-password',
	resetPassword: 'reset-password',
	role: 'role',
	subAdmin: 'sub-admin',
	state: 'state',
	faq: 'faq',
	settings: 'settings',
	CMS: 'cms',
	privacy: 'privacy',
	review: 'review',
	country: 'country',
	enquiry: 'enquiry',
	user: 'user',
	profile: 'profile',
	profilePassword: 'profilePassword',
	geg: 'geg',
	signOnPlacement: 'signOnPlacement',
	sopActivities: 'signOnPlacement/list/activities',
	list: 'list',
	add: 'add',
	edit: 'edit',
	view: 'view',
	examResults: 'examResults',
	verifyEmail: 'verify-email',

	level: 'level',
	topic: 'level/list/topic',
	lessons: 'level/list/lessons',
	activities: 'level/list/activities',

	subscription: 'subscription',
	pages: 'pages',
	pet: 'pet',
	petStore: 'petStore',
	userPermissions: 'userPermissions',

	seasonalTopic: 'seasonalTopics',
	seasonalLesson: 'seasonalTopics/lesson',
	seasonalActivities: 'seasonalTopics/activities',

	flashCard: 'flashCard',
	flashCardList: 'flashCard/list',
	whyItWorks: 'whyItWorks',
	sound: 'sound',
	vocabularies: 'vocabulary',
	contactUs: 'contactUs',
	school: 'school',
	teacher: 'teacher',
	classroom: 'classroom',
	student: 'student',
	videos: 'videos',
	child: 'child',
};

export const KEYS = {
	authToken: 'authToken',
	UserDetails: 'userDetails',
	role: 'role',
	permissions: 'permissions',
};

export const STATUS_DRP = [
	{ name: 'Active', key: 1 },
	{ name: 'Inactive', key: 0 },
];

export const GENDER_DRP = [
	{ name: 'Male', key: '1' },
	{ name: 'Female', key: '2' },
	{ name: 'Other', key: '3' },
];
export const ACTIVITY_TYPES = {
	video: 'videos',
	image: 'images',
	videoOrImage: 'video-or-image',
	dragAndDrop: 'drag-and-drop',
	fillInTheBlank: 'fill-in-the-blank',
	multipleChoice: 'multiple-choice',
	speechToText: 'speech-to-text',
	flashCard: 'flash-card',
	matching: 'matching',
	strokeOrder: 'stroke-order-1',
	qna: 'question-and-answer-based-reading-paragraph',
	karaoke: 'karaoke',
	runningGame: 'running-game',
	slashNinjaGame: 'slash-ninja-game',
};

export const SELECT_ACTIVITY_TYPE = [
	{ name: 'Multiple choice', key: '1' },
	{ name: 'Fill in the blanks', key: '2' },
	{ name: 'Drag and drop', key: '3' },
	{ name: 'Reading comprehension', key: '4' },
];

export const TRAIL_OPTIONS = [
	{ name: 'Yes', key: true },
	{ name: 'No', key: false },
];

export const CHARACTERS_LIMIT = { name: 60, description: 250, min: 3, limit: 20 };

export const PET_TYPE = [
	{ name: 'Pet 1', key: 1 },
	{ name: 'Pet 2', key: 2 },
];

export const PET_LIFE_STAGE = [
	{ name: 'Kitten', key: 0 },
	{ name: 'Young', key: 1 },
	{ name: 'Mature', key: 2 },
];

export const PET_MOOD_LEVEL = [
	{ name: 'Happy', key: 0 },
	{ name: 'Sad', key: 1 },
	{ name: 'Upset', key: 2 },
];

export const PET_HEALTH_FOOD_WATER_LEVEL = [
	{ name: 'Low', key: 0 },
	{ name: 'Moderate', key: 1 },
	{ name: 'Mid', key: 2 },
	{ name: 'High', key: 3 },
];

export const PET_POSITION = [
	{ name: 'FACE', key: 1 },
	{ name: 'SIDE', key: 2 },
	{ name: 'HEALTH', key: 3 },
];

export const FILE_TYPE = {
	textType: 'text/plain',
	audioType: 'audio/mpeg',
	videoType: 'video/mp4',
	m4aType: 'audio/x-m4a',
	movVideoType: 'video/quicktime',
	pngType: 'image/png',
	jpegType: 'image/jpeg',
	jpgType: 'image/jpg',
	gifType: 'image/gif',
	htmlType: 'text/html',
	webmType: 'video/webm',
	wavType: 'audio/wav',
};

export const IMAGE_SIZE_MB = 50;
export const AUDIO_SIZE_MB = 100;
export const TEXT_SIZE_MB = 20;
export const VIDEO_RESOLUTION_WIDTH = 1280;
export const VIDEO_RESOLUTION_HEIGHT = 720;
export const CHUNK_SIZE = 1024 * 1024 * 5; // 1MB chunk size

export enum fileTypeEnum {
	image = 'image',
	audio = 'audio',
	text = 'text',
	video = 'video',
}

export const OPTION_LIMIT = 5;
export const ENGLISH_CODE = 'en';
export const SIMPLIFIED_CHINESE_CODE = 'zh-CN';
export const TRADITIONAL_CHINESE_CODE = 'zh-Hant';

export const videoNote = 'mp4, mov, webm files only, 1280 X 720 would look better on devices';
export const IMAGE_NOTE = 'png, jpeg files only, 1280 X 720 would look better on devices';
export const GAME_IMAGE_NOTE = 'png, jpeg files only, 128 X 128 would look better on devices';
export const specialCharacters = ['?', '.', ',', '!', String.fromCharCode(39)];

export const SidebarValues = {
	subAdminModule: 'Sub Admin Management',
	endUsersModule: 'End Users Management',
	onboardingModule: 'Onboarding Management',
	sopModule: 'Sign On Placement',
	examResultModule: 'Exam Results',
	levelModule: 'Level Management',
	subscriptionModule: 'Subscription Management',
	countryModule: 'Country Management',
	cmsModule: 'CMS Management',
	seasonalModule: 'Seasonal management',
	vocabularyModule: 'Vocabularies',
	flashCardModule: 'Flash Card Category',
	petStoreModule: 'Pet Store Management',
	soundModule: 'Sound Management',
	whyItWorksModule: 'Why It Works ?',
	settingsModule: 'Settings',
	contactUsModule: 'Contact Us',
	rolesModule: 'Role Management',
	userPermissionModule: 'User Permissions',
	schoolModule: 'School Management',
	teacherModule: 'Teacher Management',
	classModule: 'Classroom Management',
	studentModule: 'Student Management',
	videoModule: 'Video Management',
};

export const fileTypes = {
	image: 0,
	video: 1,
};
export const imageType = ['jpeg', 'png', 'jpg'];
export const videoType = ['mp4', 'mov'];
export const acceptAll = `${FILE_TYPE.jpegType}, ${FILE_TYPE.pngType}, ${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType}`;

export const FlashcardData = {
	yes: 'Yes',
	no: 'No',
	text: 'Text',
	image: 'Image',
};

export const activityPaths = {
	dragAndDrop: 'drag-and-drop',
	fillBlanks: 'blank',
	readingParagraph: 'reading-paragraph',
	mcq: 'mcq',
	mcqCreate: 'mcq-create',
	mcqUpdate: 'mcq-update',
	flashCard: 'flash-card',
	flashCardUpdate: 'flash-card-update',
	flashCardCreate: 'flash-card-create',
	image: 'images',
	matching: 'matching',
	strokeOrder: 'stroke-order',
	strokeOrderCreate: 'stroke-order-create',
	strokeOrderUpdate: 'stroke-order-update',
	isForSeasonal: 'isForSeasonal=true',
	isForSop: 'isForSop=true',
	runningGame: 'running-game',
	slashNinjaGame: 'slash-ninja-game',
};

export const endPoint = {
	groupDelete: 'group-delete',
	duplicate: 'duplicate',
	list: 'list',
	status: 'status',
	order: 'order',
	getSingle: 'get-single',
	update: 'update',
	create: 'create',
	changeStatus: 'change-status',
	changeOrder: 'change-order',
	result: 'result',
	flashcard: 'flashcard',
	statusChange: 'status-change',
	roleList: 'rolelist',
	role: 'role',
	getPermissions: 'get-permissions',
	changePassword: 'change-password',
	all: 'all',
	assignTeacher: 'assign-teacher',
	unAssignTeacher: 'unassign-teacher',
	topics: 'topics',
	childProgress: 'child-progress',
	edit: 'edit',
	imports: 'imports',
};

export const PAYMENT_TYPES = [
	{ name: 'Offline', key: 1 },
	{ name: 'Online', key: 2 },
];

export const PAYMENT_STATUS = [
	{ name: 'Paid', key: 1 },
	{ name: 'Unpaid', key: 2 },
];

export const CHILD_GENDER = [
	{ name: 'Girl', key: 'F' },
	{ name: 'Boy', key: 'M' },
];

export const CHILD_LANGUAGE = [
	{ name: 'SIMPLIFIED', key: 1 },
	{ name: 'TRADITIONAL', key: 0 },
];


// # REACT_APP_API_GATEWAY_URL=https://devapi.singlearning.com/api/v1
// REACT_APP_GOOGLE_API_KEY=AIzaSyDoGwwwkVwLLRCu74XwB_Z0T7m_-HD6CBI
// REACT_APP_PROPERTY_ID=276138574
// REACT_APP_CLIENT_ID=247558522712-dg3jh4b4fiuboi6u43apg2c0r5ifllj3.apps.googleusercontent.com
// REACT_APP_GOOGLE_TRANSLATE=https://translation.googleapis.com/language/translate/v2
// REACT_APP_GOOGLE_ANALYTICS=https://analyticsdata.googleapis.com/v1beta/properties/
// REACT_APP_ANALYTICS_SCOPE=https://www.googleapis.com/auth/analytics
// REACT_APP_IMPORT_SAMPLE_FILE=https://singinchinese-dev-media.s3.amazonaws.com/sample/sample_file_bulk_user_import.csv


// REACT_APP_API_GATEWAY_URL=https://stagingapi.singlearning.com/api/v1
// # REACT_APP_API_GATEWAY_URL=https://mobileappapi.singinchinese.com/api/v1