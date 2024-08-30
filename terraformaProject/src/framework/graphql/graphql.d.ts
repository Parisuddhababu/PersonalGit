import { roleData } from 'src/types/role';

export type LoginResponse = {
	login: {
		message: string
		data: {
			token: string;
			user: {
				email: string;
				first_name: string;
				last_name: string;
				phone_number: string;
				uuid: string;
				is_required_reset_password: boolean;
				introductory_page?:boolean;
				user_type:number;
			};
		};
	};
};

export type ForgotPasswordResponse = {
	forgotPassword: {
		message: string;
	};
};

export type ResetPasswordResponse = {
	forgotSetPassword: {
		message: string;
	};
};

export type RoleResponse = {
	fetchRoles: {
		data: {
			Roledata: roleDataArr[];
		};
		meta: MetaRes;
	};
};

export type DeleteRoleRes = {
	deleteRole: {
		data: roleData;
		message: string;
	};
};

export type MetaRes = {
	message: string;
	status: string;
	statusCode: number;
};

export type RoleCreateRes = {
	createRole: {
		data: roleData;
		message: string;
	};
};

export type RoleData = {
	Roledata: roleDataArr;
	count: number;
};

export type SubAdminData = {
	subAdminData: SubAdminDataArr;
	count: number;
};

export type UserDataType = {
	userList: UserData;
	count: number;
};

export type SubAdminDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	password: string;
	role: number;
	status: number;
	created_at: string;
	updated_at: string;
};

export type UserData = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
};

export type CMSdata = {
	ContentData: CmsDataArr;
	count: number;
};

export type CmsDataArr = {
	description_english: string;
	language: string;
	meta_title_english: string;
	meta_keywords: string;
	meta_description_english: string;
	title_english: string;
	status: number;
	id: string;
	key: object;
};

export type UpdateRoleStatusType = {
	activateRole: {
		data: roleData;
		message: string;
	};
};

export type UpdateSubAdminStatusType = {
	changeSubAdminStatus: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateUserStatusType = {
	changeUserStatus: {
		meta: MetaRes;
	};
};

export type DeleteUserType = {
	deleteUser: {
		data: UserData;
		meta: MetaRes;
	};
};

export type DeleteGroupBanner = {
	groupDeleteBanner: {
		data: UserData;
		meta: MetaRes;
	};
};
export type DeleteGroupCity = {
	groupDeleteCities: {
		data: CityData;
		meta: MetaRes;
	};
};
export type DeleteGroupCountry = {
	groupDeleteCountries: {
		data: CountryData;
		meta: MetaRes;
	};
};
export type DeleteGroupState = {
	groupDeleteStates: {
		data: StateData;
		meta: MetaRes;
	};
};
export type DeleteGroupCategory = {
	groupDeleteCategories: {
		data: CategoryData;
		meta: MetaRes;
	};
};
export type DeleteGroupEnq = {
	groupDeleteEnquiries: {
		data: EnquiryData;
		meta: MetaRes;
	};
};
export type DeleteGroupFaq = {
	groupDeleteFaqs: {
		data: FaqData;
		meta: MetaRes;
	};
};
export type DeleteGroupBanner = {
	groupDeleteBanner: {
		data: BannerData;
		meta: MetaRes;
	};
};
export type DeleteGroupSugg = {
	groupDeleteSuggestions: {
		data: SuggestionData;
		meta: MetaRes;
	};
};
export type DeleteGroupRole = {
	groupDeleteRoles: {
		data: roleData;
		meta: MetaRes;
	};
};
export type GroupDeleteUser = {
	groupDeleteUsers: {
		data: UserData;
		meta: MetaRes;
	};
};
export type DeleteSubAdminType = {
	deleteSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateRoleDataType = {
	updateRole: {
		data: roleData;
		message: string;
	};
};

export type RoleDataArr = {
	created_at: string;
	key: string;
	name: string;
	status: number;
	updated_at: string;
	uuid: string;
	id: string;
};

export type ChangeSubAdminPasswordRes = {
	changeSubAdminPassword: {
		meta: MetaRes;
	};
};

export type CreateSubAdminRes = {
	createSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateSubAdmin = {
	updateSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type StateDataArr = {
	id: number;
	uuid: string;
	name: string;
	state_code: string;
	country_id: number;
	status: number;
	created_at: string;
	updated_at: string;
	Country: countryArrList;
	state_id: number;
	title?: string
	location?:string;
	branch?: {
		location?: string;
		uuid?: string;
	}
};

export type StateDataArrList = {
	id: number;
	uuid: string;
	name: string;
	country_code: string;
	status: string;
	created_at: string;
	updated_at: string;
};

export type countryArrList = {
	country_code: string;
	name: string;
	status: number;
};
export type CreateStateRes = {
	createState: {
		data: StateData;
		meta: MetaRes;
	};
};
export type CreateSubscriberRes = {
	createSubscriber: {
		data: SubscriberData;
	};
};

export type SubscriberData = {
	SubscriberData: SubscriberDataArr;

};
export type SubscriberDataArr = {
	uuid: string;
	first_name:string;
	last_name: string;
	company_name: string;
	address: string;
	phone_number: number;
	country_code: {
		uuid: string;
		name: string;
		phoneCode: string;
		countryCode: string;
	};
	logo: string;
	subscribe_start: string;
	subscribe_end: string;
	email: string;
};

export type DeleteCmsType = {
	deletePage: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type RoleResponse = {
	fetchReviews: {
		data: {
			ResponseData: roleDataArr[];
		};
		meta: ReviewMeta;
	};
};

export type DeleteReviewRes = {
	deleteReview: {
		meta: ReviewMeta;
	};
};

export type ReviewMeta = {
	message: string;
	status: string;
	statusCode: number;
};

export type ReviewCreateRes = {
	createReview: {
		data: reviewData;
		meta: ReviewMeta;
	};
};

export type ReviewData = {
	Reviewdata: ReviewDataArr;
	count: number;
};

export type reviewData = {
	id: string;
	uuid: string;
	from_user_id: number;
	to_user_id: number;
	review: string;
	rating: string;
	status: boolean;
	created_at: number;
	updated_at: number;
};

export type UpdateReviewStatusType = {
	updateStatusReview: {
		meta: ReviewMeta;
	};
};

export type ReviewDataArr = {
	id: string;
	uuid: string;
	from_user_id: number;
	to_user_id: number;
	review: string;
	rating: string;
	status: number;
	created_at: string;
	updated_at: string;
	from_user: ReviewUserDataArr;
	to_user: ReviewUserDataArr;
	count: number;
};
export type ReviewUserDataArr = {
	id: string;
	uuid: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone_no: number;
	phone_country_id: number;
	role: number;
	profile_img: string;
	status: boolean;
	user_role_id: number;
};

export type UserReviewDetail = {
	id: string;
	uuid: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone_no: number;
	phone_country_id: number;
	role: string;
	profile_img: string;
	status: boolean;
	user_role_id: number;
};
export type CountryDataArr = {
	id: number;
	country_code: string;
	status: number;
	created_at: string;
	updated_at: string;
	name: string;
	uuid: string;
};

export type CreateCountryRes = {
	createCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type createCms = {
	createPage: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type createPlaylist = {
	createPlaylist: {
		data: {
			name: string,
			uuid: string,
		}
	};
	message: string,
};

export type CreateUser = {
	createUser: {
		data: UserData;
		meta: MetaRes;
	};
};

export type UpdateUser = {
	updateUser: {
		data: UserData;
		meta: MetaRes;
	};
};
export type updateUserProfile = {
	updateUserProfile: {
		data: UserData;
		meta: MetaRes;
	};
};
export type ChangeUserPasswordRes = {
	changeUserPassword: {
		meta: MetaRes;
	};
};
export type ChangeUserPasswordRes = {
	changeUserPassword: {
		meta: MetaRes;
	};
};
export type createPage = {
	data: CMSdata;
	meta: MetaRes;
};

export type StateData = {
	StateData: StateDataArr;
	count: number;
};


export type DeleteStateType = {
	deleteState: {
		data: StateData;
		meta: MetaRes;
	};
};

export type CountryData = {
	countryData: CountryDataArr;
	count: number;
};

export type CountryDataArr = {
	id: number;
	uuid: string;
	name: string;
	country_code: string;
	status: string;
	created_at: string;
	updated_at: string;
};

export type DeleteCountryType = {
	deleteCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type UpdateCms = {
	updatePage: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type UpdateState = {
	updateState: {
		data: StateData;
		meta: MetaRes;
	};
};

export type UpdateCountry = {
	updateCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type UpdateStateStatusType = {
	changeStateStatus: {
		data: StateData;
		meta: MetaRes;
	};
};

export type UpdateCountryStatusType = {
	changeCountryStatus: {
		data: CountryData;
		meta: MetaRes;
	};
};
export type FaqDataArr = {
	updatedAt: string;

	topic_id: number;

	status: number;

	question_hindi: string;

	question_english: string;

	question_arabic: string;

	id: number;

	createdAt: string;

	answer_hindi: string;

	answer_english: string;

	answer_arabic: string;
};

export type FaqData = {
	FaqData: FaqDataArr;
	count: number;
};

export type SettingsDataArr = {
	site_name: string;
	tag_line: string;
	support_email: string;
	contact_email: string;
	contact_no: string | number;
	app_language: string;
	address: string;
	logo: string;
	favicon: string;
	// sidebarShowType?:string
};

//Enquiry
export type EnquiryDataArr = {
	id: number;
	Name: string;
	Email: string;
	Subject: string;
	Message: string;
	status: number;
	sendAt: string;
};
export type EnquiryStatusData = {
	status: string;
	id: number;
};

export type EnquiryData = {
	EnquiryData: EnquiryDataArr;
	count: number;
};

export type AnnouncementDataArr = {
	id: number;
	title: string;
	status: number;
	created_at: string;
	announcement_type: string;
	uuid: string;
	platform: string;
};

export type AnnouncementData = {
	announcementData: AnnouncementDataArr;
	count: number;
};
export type ExcludeDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	device_type: string;
	role: number;
	created_at: string;
};

export type createAnnouncementRes = {
	createAnnouncement: {
		data: AnnouncementDataArr;
		meta: MetaRes;
	};
};
export type UserDataAnnounce = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
	profile_img: string;
	device_type: string;
};
export type EventsDataArr = {
	id: number;
	event_name: string;
	description: string;
	is_recurring: string;
	start_date: string;
	end_date: string;
	status: number;
	User: {
		user_name: string;
	};
};
export type EventsData = {
	FetchEventData: EventsDataArr;
	count: number;
};
export type DeleteEventType = {
	meta: MetaRes;
};
export type UpdateEventRes = {
	updateEvent: {
		meta: MetaRes;
	};
};
export type CreateEventRes = {
	createEvent: {
		meta: MetaRes;
	};
};

export type BannerDataArr = {
	id: number;
	banner_title: string;
	banner_image: string;
	created_at: string;
	created_by: string;
	status: number;
	User: {
		first_name: string;
		last_name: string;
	};
};
export type BannerData = {
	BannerData: BannerDataArr;
	count: number;
};

export type createBannerData = {
	createBanner: {
		data: BannerData;
		meta: MetaRes;
	};
};

export type EventsDataArr = {
	id: number;
	event_name: string;
	description: string;
	is_recurring: string;
	start_date: string;
	end_date: string;
	status: number;
	User: {
		user_name: string;
	};
};

export type EventsData = {
	FetchEventData: EventsDataArr;
	count: number;
};
export type DeleteEventType = {
	meta: MetaRes;
};
export type UpdateEventRes = {
	updateEvent: {
		meta: MetaRes;
	};
};
export type CreateEventRes = {
	createEvent: {
		meta: MetaRes;
	};
};
export type SingleEventDataArr = {
	id: number;
	address: string;
	event_name: string;
	send_notification: boolean;
	description: string;
	is_recurring: string;
	start_date: string;
	end_date: string;
	status: number;
	recurrence_date: string;
	participant_mail_ids: string[];
};
export type CityDataArr = {
	id: number;
	cityName: string;
	status: number;
	createdAt: string;
	updatedAt: string;
	State: StateDataName;
	state_id: number;
};
export type StateDataName = {
	country_id: number;
	name: string;
};
export type CityDataArrwithId = {
	id: number;
	uuid: string;
	name: string;
	country_id: number;
};
export type UpdateCity = {
	updateCity: {
		data: CityData;
		meta: MetaRes;
	};
};

export type CityData = {
	CityData: CityDataArr;
	count: number;
};
export type CreateCityRes = {
	createCity: {
		data: CityData;
		meta: MetaRes;
	};
};
export type DeleteCityType = {
	deleteCity: {
		data: CityData;
		meta: MetaRes;
	};
};
export type UpdateCityStatusType = {
	changeCityStatus: {
		data: CityData;
		meta: MetaRes;
	};
};
export type SuggestionData = {
	fetchSuggestion: SuggestionDataArr;
	count: number;
};
export type SuggestionDataArr = {
	id: number;
	category_id: number;
	suggestion: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	Category: {
		category_name: string;
	};
	User: {
		first_name: string;
		last_name: string;
		middle_name: string;
	};
};

export type CategoryDataArr = {
	id: number;
	uuid: string;
	description: string;
	parent_category: number;
	description: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	name: string;
	parentData: {
		id: number;
		uuid: string;
		category_name: string;
		parent_category: number;
		description: string;
		status: number;
		created_by: number;
		created_at: string;
		updated_at: string;
	};
	category: {
		name: string
	}
};

export type CategoryData = {
	Categorydata: CategoryDataArr;
	count: number;
};
export type NotificationDataArr = {
	id: string;
	uuid: string;
	template: string;
	status: number;
	created_at: string;
	updated_at: string;
};
export type NotificationData = {
	notificationdata: NotificationDataArr;
	count: number;
};
export type DeleteNotificationType = {
	deleteNotificationTemplate: {
		meta: MetaRes;
	};
};
export type UpdateNotificationStatusType = {
	updateNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type CreateNotificationRes = {
	createNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type UpdateNotificationRes = {
	updateNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type ManageRulesSetsDataArr = {
	id: number;
	rule_name: string;
	description: string;
	priority: string;
	on_action: string;
	times_triggered: number | null;
	status: number;
};
export type ManageRulesSetsData = {
	ruleData: ManageRulesSetsDataArr[];
	count: number;
};
export type UpdateManageRulesSetsStatusType = {
	updateRuleStatus: {
		data: ManageRulesSetsDataArr;
		meta: MetaRes;
	};
};
export type DeleteManageRulesSetsType = {
	deleteSetRule: {
		meta: MetaRes;
	};
};
export type CreateRulesSetRes = {
	createSetRule: {
		meta: MetaRes;
	};
};
export type UpdateRuleSetRes = {
	updateSetRule: {
		meta: MetaRes;
	};
};
export type GroupDeleteRulesSetsRes = {
	groupDeleteSetRules: {
		meta: MetaRes;
	};
};
export type RolePermissionsDataArr = {
	id: string;
	permission_name: string;
	key: string;
	status: number;
	created_by: unknown;
	createdAt: string;
	updatedAt: string;
	uuid?: string;
	name?: string
	children: [];
	is_read: number,
	is_remove: number,
	is_update: number,
	is_write: number,
	module_id?: {
		name: string;
		uuid: string
	}
	[key: string]: unknown
};
export type PermissionArr = {
	is_read: number;
	is_remove: number;
	is_update: number;
	is_write: number;
	uuid: string;
	children: PermissionChildrenArr[];
};
export type PermissionCheckAllCheckboxes = {
	is_read: number,
	is_remove: number,
	is_update: number,
	is_write: number,
	uuid: string,
	module_id: {
		name: string
		uuid: string
		description: string
	}
	role_id: {
		name: string
		uuid: string
		description: string
	}
	children: PermissionChildrenArr[]
};
export type PermissionChildrenArr = {
	is_read: number,
	is_remove: number,
	is_update: number,
	is_write: number,
	uuid: string,
	length?: number | undefined | null,
	module_id: {
		name: string
		uuid: string
		description: string
	}
	role_id: {
		name: string
		uuid: string
		description: string
	}
	value?: number
}
export type RolePermissionsCheckBoxData = {
	id: string;
	name: string;
	value: string;
}
export type RolePermissionsData = {
	permissionDataForRole: RolePermissionsDataArr[];
	count: number;
};

export type CreateAndRolePermissionsData = {
	meta: MetaRes;
	message?: string
};
export type FetchCouponsDataArr = {
	id: string;
	coupon_name: string;
	coupon_code: string;
	coupon_type: number;
	percentage: number;
	start_time: string;
	expire_time: string;
	applicable: number;
	is_reusable: number;
	status: number;
	total_usage: number;
};
export type FetchCouponsData = {
	Coupondata: FetchCouponsDataArr[];
	count: number;
};
export type DeleteCouponType = {
	deleteCoupon: {
		meta: MetaRes;
	};
};
export type UpdateCouponStatusType = {
	updateCouponStatus: {
		meta: MetaRes;
	};
};
export type UpdateCoupon = {
	updateCoupon: {
		meta: MetaRes;
	};
};
export type CreateCoupon = {
	createCoupon: {
		meta: MetaRes;
	};
};
export type GetSingleCoupon = {
	coupon: FetchCouponsDataArr;
	userList: UserData[];
};
export type CoponUserData = {
	userList: UserData[];
	count: number;
};
export type GroupDeleteCouponsRes = {
	groupDeleteCoupons: {
		meta: MetaRes;
	};
};

export type GroupDeleteEventsRes = {
	groupDeleteEvents: {
		meta: MetaRes;
	};
};
export type GroupDeleteNotificationsRes = {
	groupDeletenotificationTemplate: {
		meta: MetaRes;
	};
};
export type GroupDeleteRulesSetsRes = {
	groupDeleteSetRules: {
		meta: MetaRes;
	};
};
export type GroupDeleteSubAdmins = {
	groupDeleteSubAdmins: {
		meta: MetaRes;
	};
};

export type GroupDeleteStateRes = {
	groupDeleteStates: {
		meta: MetaRes;
	};
};
export type UpdateCmsStatusType = {
	changeCmsStatus: {
		data: CMSdata;
		meta: MetaRes;
	};
};
export type updateSubscriber = {
	updateSubscriber: {
		data: SubscriberData;
		meta: MetaRes;
	};
};

export type SubscriberData = {
	SubscriberData: SubscriberDatalist;
	count: number;
};

export type SubscriberDatalist = {
	uuid?: string;
	address: string,
	company_name: string,
	country_code: {
		id?: string
		uuid?: string
		name?: string
		countryCode?: string
		phoneCode?: string
	},
	logo: string,
	first_name: string,
	last_name:string,
	phone_number: number,
	subscribe_end: string
	subscribe_start: string
	email: sting
	id?: string
	status?: number
};

export type TechnicalDatalist= {
	name?: string
	image_url?: string
	name?: string
	description?: string
	uuid?: string
	parent?:{
		name?: string
	}
}

export type TechnicalDatalistWIthChildren= {
	name?: string
	image_url?: string
	name?: string
	description?: string
	uuid?: string
	children?: {
		name?: string
		image_url?: string
		name?: string
		description?: string
		uuid?: string
	}
}

export type AddNewCompanyArr={
	country_id?: string,
	description?: string,
	email?: string,
	location?: string,
	name?: string,
	phone_number?: string,
	website_url?: string,
	image_url?: string,
	uuid?: string
	is_vote?: boolean,
	vote_count?: number,
}