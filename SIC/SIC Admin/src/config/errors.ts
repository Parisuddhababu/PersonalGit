import { AUDIO_SIZE_MB, IMAGE_SIZE_MB, PASSWORD_MAX_LIMIT, VIDEO_RESOLUTION_HEIGHT, VIDEO_RESOLUTION_WIDTH } from './constant';

export const MESSAGES = {
	HTML_CODE_NOTE: '# Please enter secure code only.',
};
export const Errors = {
	PLEASE_ENTER_VALID_EMAIL: 'Please enter valid email address.',
	PLEASE_ENTER_YOUR_REGISTERED_EMAIL: 'Please enter email address.',
	PLEASE_ENTER_PASSWORD: 'Please enter password.',
	PLEASE_ENTER_CONFIRM_PASSWORD: 'Please enter confirm password.',
	INVALID_EMAIL: 'Please enter valid email.',
	PASSWORD_MUST_BE_EIGHT_CHARACTERS: 'Password must be at least 8 characters.',
	PASSWORD_CHARACTERS_LIMIT: `Password should not be greater than ${PASSWORD_MAX_LIMIT} characters.`,
	PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS: 'Password must be at least 8 characters, and combination of uppercase, lowercase, number and special characters.',
	CONFIRM_PASSWORD_NOT_MATCH: 'Confirm password does not match.',
	CONTACT_NUMBER_LENGTH: 'Contact number must be a 10-digit number.',
	PLEASE_ENTER_SELECT_GENDER: 'Please select gender.',
	PLEASE_ENTER_DATE_OF_BIRTH: 'Please enter Date of Birth.',
	PLEASE_ENTER_DATE_OF_BIRTH_MAX: 'Must be at least 18 years old.',
	IMAGE_IS_REQUIRED: 'Image is required.',
	AUDIO_IS_REQUIRED: 'Audio file is required.',
	TEXT_IS_REQUIRED: 'Text file required.',
	UNSUPPORTED_FILE_FORMAT: 'Unsupported file format.',
	FILE_SIZE: `File size is too large, must be less than or equal to ${IMAGE_SIZE_MB} Mb.`,
	FILE_SIZE_AUDIO: `File size is too large, must be less than or equal to ${AUDIO_SIZE_MB} Mb.`,
	VIDEO_MAXIMUM_RESOLUTION: `File Resolutions must be less than or equal to ${VIDEO_RESOLUTION_WIDTH}px X ${VIDEO_RESOLUTION_HEIGHT}px.`,
	PLEASE_ENTER_CONTACT_NUMBER: 'Please enter contact number.',
	PLEASE_SELECT_PHONE_CODE: 'Please select phone code.',
	FILL_FORM_ERROR: 'Please fill all the fields.',
	maxGifDimensions: 'File dimensions cannot be more than',
	MAX_OPTION: 'No of options should not be greater than 6',
	PLEASE_ENTER_EVENT_NAME: 'Please enter event name.',
	PLEASE_ENTER_HTML_CODE: 'Please enter HTML Code.',
	PLEASE_ALLOW_MP3_WAV_FILE: 'Allow only mp3, wav file.',
	PLEASE_ALLOW_JPG_PNG_JPEG_FILE: 'Allow only png, jpg and jpeg file.',

	/* edit cms */
	PLEASE_ENTER_TITLE: 'Please enter title.',
	PLEASE_ENTER_DESCRIPTION: 'Please enter description.',
	PLEASE_ENTER_PHRASE: 'Please enter phrase.',

	/* edit country */
	PLEASE_ENTER_COUNTRY_NAME: 'Please enter country name.',
	COUNTRY_NAME_SHOULD_NOT_EXCEED: 'Country name should not exceed 60 characters.',
	PLEASE_ENTER_COUNTRY_CODE: 'Please enter country code.',
	COUNTRY_CODE_SHOULD_NOT_EXCEED: 'Country code should not exceed 10 characters.',
	PLEASE_ENTER_PHONE_CODE: 'Please enter phone code.',

	/* edit sub admin */
	PLEASE_SELECT_ROLE: 'Please select role.',
	PLEASE_ENTER_USER_NAME: 'Please enter user name.',
	PLEASE_ENTER_FIRST_NAME: 'Please enter first name.',
	PLEASE_ENTER_LAST_NAME: 'Please enter last name.',

	/* addEdit role */
	PLEASE_ENTER_ROLE: 'Please enter role.',

	/* subAdmin change password */
	PLEASE_ENTER_OLD_PASSWORD: 'Please enter old password.',
	PLEASE_ENTER_NEW_PASSWORD: 'Please enter new password.',

	/* Topic Add*/
	PLEASE_ENTER_TOPIC_NAME: 'Please enter topic name.',
	PLEASE_ENTER_SIMPLIFIED_CHINESE_NAME: 'Please enter simplified chinese name.',
	PLEASE_ENTER_PINYIN_TOPIC_NAME: 'Please enter pinyin topic name.',
	PLEASE_ENTER_TRADITIONAL_CHINESE_TOPIC_NAME: 'Please enter traditional chinese name.',

	/* onboarding */
	FILE_FORMAT_AND_SIZE: 'File must be (jpeg/png) and File size must be 10MB or below.',
	FILE_FORMAT_MP3_AND_SIZE: 'File must be (mp3) and File size must be 10MB or below.',
	FILE_FORMAT_TXT_AND_SIZE: 'File must be (txt) and File size must be 10MB or below.',

	/* Level management sign on placement */
	PLEASE_ENTER_LEVEL_NUMBER: 'Please enter level number.',
	PLEASE_SELECT_LEVEL: 'Please select level.',
	PLEASE_SELECT_TOPIC: 'Please select topic.',

	/* Question management */
	PLEASE_SELECT_ACTIVITY_TYPE: 'Please select activity type id.',
	PLEASE_ENTER_REQUIRED_PERCENTAGE: 'Please enter required percentage.',
	TOKEN_IS_MISSING: 'Token is missing.',

	/*Level management */
	PLEASE_ENTER_LEVEL_NAME: 'Please enter level name.',
	TITLE_SHOULD_NOT_EXCEED: 'Title should not exceed 60 characters.',
	SPECIAL_CHARACTERS_NOT_ALLOWED: 'Special characters not allowed.',
	NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED: 'Numbers and special characters not allowed.',

	/* SUbscription management */
	PLEASE_SELECT_SUBSCRIPTION_ID: 'Please select subscription type.',
	PLEASE_ENTER_PLAN_NAME: 'Please enter plan name.',
	PLEASE_ENTER_PLAN_DESCRIPTION: 'Please enter plan description.',
	PLEASE_ENTER_SPECIAL_NOTE: 'Please enter special note.',
	PLEASE_ENTER_PLAN_PRICE: 'Please enter plan price.',
	PLEASE_ENTER_PRICE_DESCRIPTION: 'Please enter price description.',
	PLEASE_ENTER_SPECIAL_PLAN_PRICE: 'Please enter special plan price.',
	PLEASE_ENTER_FREE_TRAIL_DURATION: 'Please enter free trial duration.',
	PLEASE_ENTER_ALLOWED_CHILD: 'Please enter number of child.',
	ALLOWED_CHILD_LIMIT: 'Allowed upto 3 child only.',
	PLEASE_ENTER_APP_STORE_ID: 'Please enter App store ID.',
	PLEASE_ENTER_PLAY_STORE_ID: 'Please enter Play store ID.',
	PLEASE_SELECT_FREE_TRAIL_OPTION: 'Please select free trial.',
	MAXIMUM_LIMIT_UPTO_60_CHARACTERS: 'Maximum limit upto 60 characters.',
	MAXIMUM_LIMIT_UPTO_150_CHARACTERS: 'Maximum limit upto 150 characters.',
	MINIMUM_CHARACTERS: 'Minimum 3 characters required.',

	/* Lesson management */
	PLEASE_ENTER_LESSON_NAME: 'Please enter lesson name.',
	PLEASE_ENTER_LESSON_TITLE: 'Please enter lesson title.',
	PLEASE_ENTER_VOCABULARY: 'Please enter vocabulary.',
	PLEASE_ENTER_WORD: 'Please enter a word.',
	PLEASE_ENTER_SENTENCES: 'Please enter sentences.',
	PLEASE_ENTER_NUMBER_OF_STARS: 'Please enter number of stars.',
	MAX_TRIAL_DAYS: 'Please enter small value for trail.',

	/*Karaoke management */
	PLEASE_ENTER_KARAOKE_ENGLISH_TITLE: 'Please enter karaoke title.',
	PLEASE_ENTER_KARAOKE_PINYIN_TITLE: 'Please enter karaoke pinyin title.',
	PLEASE_ENTER_KARAOKE_TRADITIONAL_CHINESE_TITLE: 'Please enter karaoke traditional chinese title.',
	PLEASE_ENTER_KARAOKE_SIMPLIFIED_CHINESE_TITLE: 'Please enter karaoke simplified chinese title.',
	PLEASE_ENTER_KARAOKE_DESCRIPTION: 'Please enter karaoke description.',
	PLEASE_UPLOAD_KARAOKE_LYRICS_FILE: 'Please upload karaoke lyrics file.',
	PLEASE_UPLOAD_KARAOKE_BACKGROUND_MUSIC_FILE: 'Please upload karaoke background music file.',
	PLEASE_ENTER_KARAOKE_DURATION: 'Please enter karaoke duration.',

	/* Pet store management */
	PLEASE_SELECT_PET_TYPE: 'Please select pet type.',
	PLEASE_ENTER_PET_NAME: 'Please enter pet name.',
	NAME_SHOULD_NOT_EXCEED: 'Name should not exceed 60 characters.',
	PLEASE_SELECT_LIFE_STAGE: 'Please select life stage.',
	PLEASE_SELECT_MOOD_LEVEL: 'Please select mood level.',
	PLEASE_SELECT_HEALTH_LEVEL: 'Please select health level.',
	PLEASE_SELECT_WATER_LEVEL: 'Please select water level.',
	PLEASE_SELECT_FOOD_LEVEL: 'Please select food level.',
	PLEASE_SELECT_POSITION: 'Please select position.',

	/* Activity */
	PLEASE_ENTER_ACTIVITY_TITLE: 'Please enter activity title.',
	PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED: 'Please select image / video.',
	PLEASE_SELECT_VIDEO_SIMPLIFIED: 'Please select video.',
	PLEASE_SELECT_IMAGE_SIMPLIFIED: 'Please select image.',

	PLEASE_ENTER_ACTIVITY_ENGLISH_TITLE: 'Please enter english title.',
	PLEASE_ENTER_ACTIVITY_PINYIN_TITLE: 'Please enter pinyin title.',
	PLEASE_ENTER_ACTIVITY_CHINESE_TITLE: 'Please enter chinese title.',

	PLEASE_ENTER_TEXT: 'Please enter text.',
	PLEASE_SELECT_TEXT_FILE: 'Please select text file.',

	PLEASE_SELECT_GIF: 'Please select gif file.',

	/* Activity-4 */
	PLEASE_SELECT_AUDIO: 'Please select audio',
	PLEASE_SELECT_IMAGE: 'Please select image',
	PLEASE_ENTER_TEXT_FOR_PRONUNCIATION: 'Please enter text for speech detection',
	/* Seasonal topics */
	PLEASE_ENTER_START_DATE: 'Please enter start date.',
	PLEASE_ENTER_END_DATE: 'Please enter end date.',
	DATE_MUST_BE_FUTURE: 'Date must be in future.',

	/* Pet Store Management */
	PLEASE_ENTER_PRODUCT_NAME: 'Please enter product name.',

	/* flash card categories */
	PLEASE_ENTER_CATEGORY_NAME: 'Please enter category name.',
	PLEASE_SELECT_CATEGORY: 'Please select category.',

	/*Multiple choice Activity */
	PLEASE_ENTER_QUESTION: 'Please enter question.',
	PLEASE_ENTER_OPTION: 'Please enter option.',
	PLEASE_SELECT_CORRECT_ANSWER: 'Please select correct answer.',

	/*Fill in the blanks activity */
	PLEASE_SELECT_CORRECT_OPTION: 'Please select correct option.',
	PLEASE_SELECT_CORRECT_AUDIO: 'Please select correct audio.',

	/*Multi questions in activityManagement */
	PLEASE_ENTER_QUESTION_TRADITIONAL: 'At least one question in traditional is required.',
	PLEASE_ENTER_QUESTION_SIMPLIFIED: 'At least one question in simplified is required.',
	PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL: 'Please select traditional correct answer.',
	PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED: 'Please select simplified correct answer.',
	/*Reading compensation*/
	PLEASE_ENTER_SIMPLIFIED_PHRASE: 'Please enter simplified phrase.',
	PLEASE_ENTER_TRADITIONAL_PHRASE: 'Please enter traditional phrase.',
	PLEASE_SELECT_SIMPLIFIED_PHRASE: 'At least one simplified phrase is required.',
	PLEASE_SELECT_TRADITIONAL_PHRASE: 'At least one traditional phrase is required.',

	/*Ad &Star management*/
	PLEASE_ENTER_MODULE_NAME: 'Please enter module name.',
};
