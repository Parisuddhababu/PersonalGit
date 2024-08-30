/* eslint-disable @typescript-eslint/no-explicit-any */

import { CityDataArr, CmsDataArr, CountryDataArr, AnnouncementDataArr, SubAdminDataArr } from '@framework/graphql/graphql';

import React, { SetStateAction } from 'react';

export type ResetPasswordNavParams = {
	token: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortField: string;
	sortOrder: string;
	search: string;
	index?: any
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
};
export type CommonModelProps = {
	onClose: () => void;
	action?: () => void;
	show?: boolean;
	warningText: string;
	disabled?: boolean;
	isLoading?: boolean
};
export type Step = {
	title?: string;
	icon?: React.ReactNode;
	content: React.ReactNode;
}
export type StepperProps = {
	steps: Step[];
	createYourContent: boolean;
	dynamicWidth?: number | string | null | undefined | unknown;
}
export type LanguageModelProps = {
	onClick: () => void;
	setState?: (value) => boolean;
};
export type ProfileModelProps = {
	profileHandler: () => void;
	logoutHandler: () => void;
};

export type ChangeStatusProps = {
	onClose: () => void;
	changeStatus: () => void;
	show?: boolean;
};

export type DeleteDataProps = {
	onClose: () => void;
	deleteData?: () => void;
	changeStatus?: () => void;
	show?: boolean;
};
export type DescriptionDataProps = {
	onClose: () => void;
	data: string;
	show?: boolean;
};
export type ImageDataProps = {
	onClose: () => void;
	data: string;
	show?: boolean;
};
export type TreeNode = {
	id: number;
	label: string;
	children?: TreeNode[];
};

export type TreeViewProps = {
	data1: TreeNode[];
};
export type validationProps = {
	params?: number | string | undefined;
};
export type EditComponentProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr | AnnouncementDataArr | CityDataArr | CountryDataArr | CmsDataArr;
	route?: string;
	onClick?: () => void;
};
export type ViewComponentProps = {
	data: NotificationDataArr | EventsDataArr | AnnouncementDataArr;
	route?: string;
};
export type DeleteComponentsProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr | ZoneDataArr | DiversionReportServicesListRes;
	setObj: React<SetStateAction<data>>;
	setIsDelete?: React<SetStateAction<boolean>>;
	className?: string;
	customClick?: (data) => void;
};
export type PasswordComponentsProps = {
	data: SubAdminDataArr | UserData
	setObj: React<SetStateAction<data>>;
	setIsChangePassword: React<SetStateAction<boolean>>
}
export type TreeRouteComponentProps = {
	route?: string;
};
export type RoleEditComponentsProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr;
	setRoleObj: React<SetStateAction<data>>;
	setIsRoleModelShow: React<SetStateAction<boolean>>;
	// setIsDelete: React<SetStateAction<boolean>>;
	setRoleVal: React<SetStateAction<string>>,
	setIsRoleEditable: React<SetStateAction<boolean>>
};

export type CoursesManagementState = {
	activeStep: number;
	createNewAccountStep: number;
	planYourCourseDetails: PlanYourCourseDetails[];
};

export type PlanYourCourseDetails = {
	id?: string,
	highlights1_id?: string,
	highlights2_id?: string,
	highlights3_id?: string,
	highlights4_id?: string,
	selectCourse: string | null;
	highlights1: string;
	highlights2: string;
	highlights3: string;
	highlights4: string;
	courseSubTitle?: string;
	courseTitle: string;
	prerequisite: string;
	qualification: string;
	instructorName: string;
	category: string;
	assessmentCertification: boolean;
	addPrerequisite: boolean;
	courseDescription?: string;
	courseImage?: File;
	instructorProfileImage?: File;
	courseImagePreview?: string,
	instructorProfilePreview?: string,
	categoryName?: string,
	subCategoryName?: string
	courseImageUploadFileName?: string,
	instructorImageUploadFileName?: string,
	bannerImageUploadFileName: string,
	bannerImage?: string,
	bannerImagePreview?: string;
	templateId?:string|null;
}

export type QuestionAnswerList = {
	question: string,
	answer1: string,
	answer2: string,
	answer3: string,
	answer4: string,
	correctAnswerOption: string,
	id?: string
	order?: number;
	answerOrder1?: number;
	answerOrder2?: number;
	answerOrder3?: number;
	answerOrder4?: number;
}

export type CreateQuizState = {
	quizCheckbox: boolean;
	correctAnswerCheckbox: boolean;
	applyTimerCheckbox: boolean;
	certificateCheckbox: boolean;
	selectQuizTime: string;
	enterPassingCriterion: string;
	enterQuestion: string;
	optionAnswer1: string;
	optionAnswer2: string;
	optionAnswer3: string;
	optionAnswer4: string;
	selectedAnswerOption: string;
	editedIndex: number | null;
	questionAnswerList?: QuestionAnswerList[];
	course_id?: string;
	order?: number;
}

export type RootState = {
	createQuizDetails: CreateQuizState[] | any;
};

export type Lesson = {
	uuid: string;
	name: string;
	video_url: string;
	title: string;
	attachment: string;
	video_time?: number;
	order?: number;
	image?: string;
}

export interface LessonWithCompletes {
	uuid: string;
	name: string;
	order: number;
	video_url: string;
	title: string;
	attachment: string;
	video_time?: number;
	order?: number;
	is_lesson_completed?: boolean;
	video_last_check_time?: number;
}

export type Faq = {
	uuid: string;
	question: string;
	answer: string;
	order: number;
}

export type Chapter = {
	uuid: string;
	name: string;
	order: number;
	lessons: LessonResponseData[];
}

export type ChapterUpdatedData = {
	chapterUuid: string;
	lessonUuid: string | undefined;
	videoUrl: string | undefined;
	videoLastCheckTime: number | null | undefined;
}

export type Course = {
	uuid: string;
	title: string;
	subtitle: string;
	description: string;
	total_duration: number;
	reward_point: number;
	level: number;
	is_certification: boolean;
	prerequisite: string;
	image: string;
	thumbnails: string;
	instructor_profile: string;
	instructor_name: string;
	instructor_qualification: string;
	is_template: boolean;
}
export type CourseClone = {
	uuid: string;
	title: string;
	subtitle: string;
	description: string;
	estimate_time: number;
	reward_point: number;
	level: number;
	is_certification: boolean;
	prerequisite: string;
	image: string;
	thumbnails: string;
	instructor_profile: string;
	instructor_name: string;
	instructor_qualification: string;
	is_template: boolean;
	createdAt: string;
	course_learners_count: string;
	category: {
		uuid: string;
		name: string;
	};
	highlights: {
		id: string;
		uuid: string;
		name: string;
	}[]
	is_assign:boolean;
	is_draft:boolean;
	is_published: boolean;
}

export type CourseDetailOverview = {
	overview: Course;
	contents: Chapter[];
	faqs: Faq[];
}

export type OperationCourseDetailOverviewSuccess = {
	message: string;
	data: CourseDetailOverview;
}

export type CourseDetailsData = {
	getCourseDetailOverview: OperationCourseDetailOverviewSuccess;
}

export type CourseDetailsPage = {
	getCourseDetailOverview: {
		data: {
			overview: {
				description: string;
				total_duration: number;
				is_certification: boolean;
				prerequisite: string;
				is_quiz_completed: boolean;
				instructor_profile: string;
				image: string;
				instructor_name: string;
				instructor_qualification: string;
				highlights: { uuid: string; name: string }[];
				total_duration: number;
				prerequisite: string;
				courseQuiz?: any;
				chapters?: any;
				createdAt?: string;
				courseLearnersCount?: number;
				title: string;
				isAssign?: boolean;
				is_show_certificate_tab: boolean;
				is_course_completed: boolean
			};
			contents: {
				name: string,
				uuid: string,
				is_chapter_completed: boolean,
				is_chapter_started: boolean,
				lessons: LessonResponseData[]
			}[]
			faqs: {
				length?: number,
				question: string;
				answer: string;
				uuid: string;
			}[]
		};
	};
}

export type QuestionAnswerListState = {
	selectedOptions: Array<{uuid: string; option: string; is_correct: boolean;
		order: number;}>;
}

export type LessonsData = {
	title: string;
	url: string;
	attachment: string;
	video_url: string;
	lessonIndex?: number;
	name?: string;
	video_time: number;
	image: string,
	uuid: string
}

export type LessonResponseData = {
	attachment: string;
	image?: string;
	is_lesson_completed?: boolean;
	name?: string
	order?: number
	title?: string
	url: string
	uuid?: string;
	video_last_check_time?: number | null;
	video_time: number;
	video_url?: string;
}

export type LessonData = {
	is_chapter_completed?: boolean;
	is_chapter_started?: boolean;
	uuid: string,
	name: string,
	order?: number,
	lessons: any
}


export type CourseQuizQuestionOptions = {
	id: number;
	uuid: string;
	option: string;
	is_correct: boolean;
}

export type UserQuizDetails = {
	uuid: string;
	question: string;
	selectedOption: string;
	is_right: boolean;
	courseQuizQuestionOptions: CourseQuizQuestionOptions[];
}

export type UserQuizCustom = {
	id: number;
	uuid: string;
	is_pass: boolean;
	passing_mark: number;
	user_percentage: number;
	total_questions: number;
	right_answers: number;
	time_taken: number;
	is_show_correct_ans: number;
	userQuizDetails: UserQuizDetails[];
}

export type QuizResultData = {
	quizResultData: {
		data: UserQuizCustom;
	}
}

export type QuestionData = {
	question: string;
	options: string[];
	correctAnswer: string;
	is_right: boolean;
	userSelectedAnswer: string;
	uuid: any;
}

export type UserRoles = {
	read: boolean,
	write: boolean,
	update: boolean,
	delete: boolean
}

export type CreateEmployeeData = {
	createEmployeeUserDetails: {
		email: string;
		// pronounce: string;
		last_name: string;
		first_name: string;
		phone_number: string;
		country_code: string;
		preferred_language: string
		role_id: string;
	}
	employeeDetailsData: {
		role_id: string,
		department: string,
		reporting_manager_id: string,
		branchId: string
		position: string,
		isSubAdmin: boolean,
	}
}

export type UserProfileType = {
	getProfile: {
		data: {
			profile_picture: string;
			introductory_page?: boolean;
			is_required_reset_password?: boolean;
			first_name: string;
			last_name: string;
			email: string;
			phone_number: string;
			preferred_language: any;
			educational_interests: any;
			country_code: any;
			uuid: string
			role_name: string
			subscriber_id?: any
			is_course_creator:boolean;
			is_course_admin:boolean;
			branch_id: {
				uuid: string
			}
			company_id: {
				uuid: string
			}
			user_type: number
			branch_locations: {
				uuid: string
			}[],
		}
	}
}

export type CreateTenantPersonalDetail = {
	country_id: string;
	phone_number: string;
	email: string;
	position: string,
	last_name: string,
	first_name: string,
	company_sub_admin: boolean,
	country_name: string
	authorized_person_id: any,
}

export type createTenantDetails = {
	name: string,
	company_type_id: string,
	description: string,
	industry_type_id: string,
	attachments: string,
	website_url: string,
	company_type_name: string,
	last_name: string,
	first_name: string,
	country_name: string
	company_branch_id: any
}

export type createContractorDetails = {
	name: string,
	industry_type_id: string,
	attachments: string,
	website_url: string,
	description: string,
	contractor_type_id: string,
	contractor_type_name: string,
	company_branch_id: any
	authorized_person_id: any,
}

interface CompanyOrTenantDetailsType {
	createNewCompany: boolean;
	selectFromExitingCompany: boolean
	companyType: number;
	createTenantPersonalDetail: CreateTenantPersonalDetail;
	createTenantDetails: createTenantDetails;
	selectFromExitingContractor: boolean;
	createNewContractor: boolean;
	createContractorDetails: createContractorDetails;
	companyDetails: any;
}

export type TenantDetailsData = {
	address: string
	authorized_person: []
	company_name: string
	email: string[],
	industry_type: string
	location: string
	phone_number: string[]
	country_code: string[]
	total_employees: number
	type: string
	website: string
}

export interface GetCompanyTenantDetails {
	getCompanyTenantDetails: TenantDetailsData
}

export interface Item {
	id: string;
	name: string;
	type: string;
}
export interface ChaptersType {
	chapter_id?: string;
	title: string;
	type: number | string;
	order: number;
	youtube?: {
		uuid: string;
		image: string;
		youtube_url: string;
	},
	quiz?: {
		delete_question_ids: string[];
		questions: Questiontype[];
	}
	text?: {
		uuid: string;
		description: string;
	}
	pdf?: {
		uuid: string;
		url: string;
	}
}


export type TranformationArrayType = {
	chapter_content: {
		image: string;
		uuid: string;
		description: string;
		youtube_url: string;
		pdf_url: string;
	}[],
	chapter_quiz: {
		uuid: string;
		question: string;
		order: number;
		type: number;
		quiz_question: {
			uuid: string;
			option: string;
			is_correct: boolean;
			order: number;
		}[]
	}[],
	user_course_progress:{
        uuid:string;
        video_last_check_time:string;
        is_chapter_completed:string;
      }[]
	order: number;
	title: string;
	type: number;
	uuid: string;
}

export interface DeleteImageData {
	courseImagePlanYourCourse: boolean;
	bannerImagePlanYourCourse: boolean;
  }

  export type YoutubeValues = {
    uuid:string;
    chapterName: string;
    chapterImage: string;
    youtubeUrl: string;
}
export interface YoutubefilterProps {
    onAddChapter: (values: YoutubeValues) => void;
    editData:null|ChaptersType;
    disabled:boolean
}

export type TextBasedValues = {
	chapter_id:string;
    uuid: string;
    chapterName: string;
    text: string;
}
export interface TextBasedComponentProps {
    onAddChapter: (values: TextBasedValues) => void;
    editData: null | ChaptersType;
    disabled:boolean
}
export interface Questiontype {
    uuid: string,
    type: number | null,
    order: number | null,
    question: string,
    delete_options_ids: string[],
    options: Options[]
}
export interface Options {
    uuid: string,
    option: string,
    is_correct: boolean,
    order: number,
    errorName?: string | FormikErrors<Options>;
}

export interface QuizProps {
    onAddChapter: (values: { questions: Questiontype[], chapterName: string, delete_question_ids: string[] }) => void;
    editData: null | ChaptersType;
    disabled: boolean
}

export type PdfValues = {
    uuid:string
    chapterName: string;
    fileName: string;
    attachments: string;
}
export interface PdfComponentProps {
    onAddChapter: (values: PdfValues) => void;
    editData:null|ChaptersType;
    disabled:boolean
}


export interface DeletePublishImageData {
	courseImagePublishYourCourse: boolean;
	bannerImagePublishYourCourse: boolean;
}

export type FAQItem = {
	uuid: string;
	question: string;
	answer: string;
	order?: number;
};

// Define a type for the form values
export type FormValues = {
	uuid: string;
	question: string;
	answer: string;
	editedIndex: number | null;
};

export type ChapterDataType = {
	chapter_content: {
		image: string;
		uuid: string;
		description: string;
		youtube_url: string;
		pdf_url: string;
	},
	chapter_quiz: {
		uuid: string;
		question: string;
		order: number;
		type: number;
		quiz_question: {
			uuid: string;
			option: string;
			is_correct: boolean;
			order: number;
		}[]
	}[],
	user_course_progress:{
        uuid:string;
        video_last_check_time:string;
        is_chapter_completed:boolean;
      }[]
	order: number;
	title: string;
	type: number;
	uuid: string;
}

export type CourseDetailsDataArray = {
	id:string;
	uuid:string;
	title:string;
	subtitle:string;
	description:string;
	category: {
	  uuid:string;
	  name:string;
	  description:string;
	  status:boolean;
	  image_url:string;
	}
	prerequisite:string;
	course_image:string;
	banner_image:string;
	instructor_profile:string;
	estimate_time:number;
	is_certification:booelan;
	instructor_name:string;
	course_learner_count:number;
	instructor_qualification:string;
	is_template:boolean;
	is_draft:boolean;
	createdAt:string;
	highlights :{
	  id:string;
	  uuid:string;
	  name:string;
	}[]
	is_editable:boolean;
	availability:number;
	is_published
	playlists :{
	  uuid:string;
	  name:string;
	  image:string;
	}[]
	is_assign:boolean
	template_uuid:string|null
}