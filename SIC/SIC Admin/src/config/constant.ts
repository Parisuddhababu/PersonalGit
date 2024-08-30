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

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
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
};

export const KEYS = {
	authToken: 'authToken',
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

export const CHARACTERS_LIMIT = { name: 60, description: 250, min: 3 };

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

export const specialCharacters = ['?', '.', ',', '!', String.fromCharCode(39)];
