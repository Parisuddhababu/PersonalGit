/* Service for axios api calls */

import { authToken, destroyAuth } from '@utils/helpers';
import axios from 'axios';
import { CopyActivity, CreateKaraokeActivity, FinalGetPreSignedUrls, GetPreSignedUrls, GetPreSignedUrlsArr, InitializeMultipartUpload, MultiDelete } from 'src/types/activities';
import { DragAndDropActivitySubmitData } from 'src/types/activities/dragAndDrop';
import { FillInTheBlanksActivitySubmitData } from 'src/types/activities/fillInTheBlanks';
import { FlashCardActivitySubmitData } from 'src/types/activities/flashCard';
import { ImageActivitySubmitData } from 'src/types/activities/image';
import { MatchingActivitySubmitData } from 'src/types/activities/matching';
import { MultipleChoiceActivitySubmitData } from 'src/types/activities/multipleChoice';
import { ReadingParagraphActivitySubmitData } from 'src/types/activities/readingComprehension';
import { StrokeOrderSubmitData } from 'src/types/activities/strokeOrder';
import { VideoActivitySubmitData } from 'src/types/activities/video';
import { CreateCountryData } from 'src/types/country';
import { googleAnalyticsType } from 'src/types/dashboard';
import { CreateLevelData } from 'src/types/exam';
import { AddFlashCard, CreateFlashCardCategory } from 'src/types/flashCardCategories';
import { OrderDataToSubmit } from 'src/types/lesson';
import { CreateLesson, LessonSubmitData } from 'src/types/lessons';
import { LevelForm, LevelStatusResponse } from 'src/types/levels';
import { OnboardingAPIData, OnboardingStatus } from 'src/types/onboarding';
import { CreatePetProductData } from 'src/types/petStoreProducts';
import { RoleUpdate, RoleUpdateApiResponse, UserPermissionsUpdate } from 'src/types/role';
import { CreateSeasonalTopic } from 'src/types/seasonalTopics';
import { CreateSettings, CreateStarManagement } from 'src/types/settings';
import { CreateSoundManagement } from 'src/types/soundManagement';
import { CreateSubAdmin } from 'src/types/subAdmin';
import { CreateSubscription, SubscriptionStatusChange } from 'src/types/subscription';
import { CreateTopic } from 'src/types/topic';
import { ChangePasswordVariable, UserPropsData, UserStatusData } from 'src/types/user';
import { ForgotPasswordInput, LoginInput, ResetPasswordInput, TranslateParams } from 'src/types/views';
import { CreateCMSPage } from './../../types/cms.d';
import { ContactUsStatus } from 'src/types/contactUs';
import { RunningGameActivitySubmitData } from 'src/types/activities/runningGameActivity';
import { CreateSchoolData, UpdateSchoolData } from 'src/types/schools';
import { CreateTeacherData, UpdateTeacherData } from 'src/types/teacher';
import { ChangeStudentStatus, CreateStudentData, MoveChild, UpdateStudentData } from 'src/types/student';
import { AssignTeacher } from 'src/types/classroom';

type APIMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
type APIData =
	| LoginInput
	| ForgotPasswordInput
	| ResetPasswordInput
	| CreateSettings
	| OnboardingAPIData
	| OnboardingStatus
	| CreateLevelData
	| UserPropsData
	| UserStatusData
	| CreateSubscription
	| SubscriptionStatusChange
	| LevelForm
	| LevelStatusResponse
	| OrderDataToSubmit
	| RoleUpdateApiResponse
	| ChangePasswordVariable
	| RoleUpdate
	| VideoActivitySubmitData
	| StrokeOrderSubmitData
	| ImageActivitySubmitData
	| MatchingActivitySubmitData
	| MultipleChoiceActivitySubmitData
	| ReadingParagraphActivitySubmitData
	| DragAndDropActivitySubmitData
	| FillInTheBlanksActivitySubmitData
	| FlashCardActivitySubmitData
	| CreateKaraokeActivity
	| CreateCountryData
	| CreateTopic
	| CreateLesson
	| CreateCMSPage
	| UserPermissionsUpdate
	| CreateSubAdmin
	| CreateSeasonalTopic
	| CreatePetProductData
	| FormData
	| CreateFlashCardCategory
	| AddFlashCard
	| CreateSoundManagement
	| TranslateParams
	| LessonSubmitData
	| googleAnalyticsType
	| InitializeMultipartUpload
	| GetPreSignedUrlsArr
	| GetPreSignedUrls
	| FinalGetPreSignedUrls
	| MultiDelete
	| CopyActivity
	| CreateStarManagement
	| ContactUsStatus
	| RunningGameActivitySubmitData
	| CreateSchoolData
	| UpdateSchoolData
	| CreateTeacherData
	| UpdateTeacherData
	| CreateStudentData
	| ChangeStudentStatus
	| AssignTeacher
	| MoveChild
	| UpdateStudentData
	| undefined;

export const APIService = {
	request: (method: APIMethods, url: string, data: APIData = undefined, headers = {}) => {
		const config = {
			method,
			url,
			data,
			headers: {
				Authorization: `Bearer ${authToken()}`,
				...headers,
			},
		};
		return axios.request(config).catch((err) => {
			if (err.response.data.message === 'Token expired') {
				setTimeout(() => {
					destroyAuth();
					window.location.href = '/login';
				}, 1000);
			}
			throw err;
		});
	},
	requestWithoutAuth: (method: APIMethods, url: string, data: APIData = undefined, headers = {}) => {
		const config = {
			method,
			url,
			data,
			headers: headers,
		};
		return axios.request(config);
	},
	getData: (url: string) => {
		return APIService.request('get', url);
	},
	getDataWithoutAuth: (url: string) => {
		return APIService.requestWithoutAuth('get', url);
	},
	postDataWithoutAuth: (url: string, data: APIData, headers = {}) => {
		return APIService.requestWithoutAuth('post', url, data, headers);
	},
	postData: (url: string, data: APIData, headers = {}) => {
		return APIService.request('post', url, data, headers);
	},
	patchData: (url: string, data: APIData, headers = {}) => {
		return APIService.request('patch', url, data, headers);
	},
	putData: (url: string, data: APIData, headers = {}) => {
		return APIService.request('put', url, data, headers);
	},
	deleteData: (url: string) => {
		return APIService.request('delete', url);
	},
};
