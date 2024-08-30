import { MetaRes } from "@/types/graphql/common";
import { Product } from '@/types/pages';

export type ChangePasswordResponse = {
	changeProfilePassword: {
		meta: MetaRes;
	};
};

export type ForgotPasswordResponse = {
	forgotPassword: {
		meta: MetaRes;
	};
};

export type GetBrandProduct = {
	getProduct: {
		meta: MetaRes;
		data: Product
	};
};

export type GetInstagramAccountResponse = {
	getInstaAccount: {
		meta: MetaRes;
		data: {
			facebook_id: string
			instagram_account_id: string
			is_selected: boolean
			uuid: string
			user_id: number
			social_page_title: string
		}
	};
};

export type GetSocialPageListResponse = {
	listSocialPages: {
		meta: MetaRes;
		data: SocialPage[]
	};
};

export type GetSocialTokenResponse = {
	getStreamingToken: {
		data: {
			session_token: string;
			uuid: string;
			channelName: string;
			user_id: string;
		};
		meta: MetaRes;
	};
};

export type ScheduleStreamingResponse = {
	scheduleStreaming: {
		meta: MetaRes;
		data: null
	};
};

export type InfluencerData = {
	first_name: string,
	last_name: string,
	email: string,
	gender: number | string,
	created_at: string,
	phone_number: string,
	status: string | number,
	uuid: string
};

export type DisconnectSocialPageListResponse = {
	disconnectFacebook: {
		meta: MetaRes;
		data: SocialPage[]
	};
};

export type FacebookLoginResponse = {
	name: string
	id: string
	userID: string
	expiresIn: number
	accessToken: string
	signedRequest: string
	graphDomain: string
	data_access_expiration_time: number
	error?: FacebookError
}

export type GetProfileResponse = {
	getProfile: {
		meta: MetaRes;
		data: LoggedInUser
	};
};

export type GetSocialPageParam = {
	accessToken: string
	facebookId: string
}

export type GetSocialPageResponse = {
	getUserSocialPages: {
		meta: MetaRes;
		data: SocialPage[]
	};
}

export type SelectSocialPageResponse = {
	selectSocialPage: {
		meta: MetaRes;
		data: null
	};
};

export type SocialPage = {
	facebook_id: string
	page_token_expires_at: string
	social_connection_id: string
	social_page_id: string
	social_page_title: string
	user_id: string
	uuid: string
	is_selected: boolean
	channel_name: string
}

export type FacebookError = {
	message: string;
	type: string;
	code: number;
	fbtrace_id: string;
};

export type SendUserCommentCLickResponse = {
	sendUserCommentClick: {
		meta: MetaRes;
		data: {
			product_details: {
				url: string
				name: string
			}
		}
	};
};

export type IReplayHistory = {
	uuid: string;
	stream_title: string;
	duration: string | number;
	start_time: string;
	schedule_stream_title?: string;
}

export type LoginResponse = {
	loginUser: {
		data: {
			token: string;
			user: LoggedInUser;
			expiresIn: string;
			permissions: string[];
			refreshToken: string;
			expiresAt: string;
			current_plan_details?: ICurrentPlanDetails,
			brand_user_setting?: {primary_color : string}
		};
		meta: MetaRes;
	};
};

export type RegisterUserResponse = {
	registerUser: {
		data: {
			uuid: string;
			email: string;
			user_type: string;
		};
		meta: MetaRes;
	};
};

export type JoinStreamingResponse = {
	joinLiveStreaming: {
		data: {
			uuid: string;
			user_id: string;
			product_id: string;
			product_uuid: string;
			live_video_id: string;
			start_time: string;
			end_time: string;
			product: Product
			userStreamingPlatform: {
				uuid: string
				user_id: string
				user_stream_id: string
				social_page_id: string
				social_connection_id: string
				streaming_platform: string
				converter_id: string
				stream_url: string
				rtmp_converter_destroyed: string
				social_channel_cdn_destroyed: string
				live_video_id: string
				is_joined: boolean
				start_time: string
				end_time: string
			}
		};
		meta: MetaRes;
	};
};

export type StartStreamingResponse = {
	startStreaming: {
		data: {
			uuid: string;
			user_id: string;
			start_time: string;
			end_time: string;
			userStreamingPlatform: {
				uuid: string
				user_id: string
				user_stream_id: string
				social_page_id: string
				social_connection_id: string
				streaming_platform: string
				converter_id: string
				stream_url: string
				rtmp_converter_destroyed: string
				social_channel_cdn_destroyed: string
				live_video_id: string
				is_joined: boolean
				start_time: string
				end_time: string
			}
		};
		meta: MetaRes;
	};
};

export type StreamingSocketResponse = {
	data: {
		uuid: string;
		user_id: string;
		start_time: string;
		end_time: string;
		key_word: string;
		userStreamingPlatform: {
			uuid: string
			user_id: string
			user_stream_id: string
			social_page_id: string
			social_connection_id: string
			streaming_platform: string
			converter_id: string
			stream_url: string
			rtmp_converter_destroyed: string
			social_channel_cdn_destroyed: string
			live_video_id: string
			is_joined: boolean
			start_time: string
			end_time: string
		}[]
	};
	extensions: {
		meta: MetaRes;
	}
	code?: string
	message?: string
	status?: number
	meta: MetaRes;
};

export type EndStreamingResponse = {
	endliveStreaming: {
		data: {
			uuid: string;
			user_id: string;
		};
		meta: MetaRes;
	};
};

export type SendCommentReplyResponse = {
	sendCommentReply: {
		meta: MetaRes;
		data: null
	};
};
export type SendCommentResponse = {
	sendComment: {
		meta: MetaRes;
		data: null
	};
};

export type UpdateStreamingResponse = {
	updateStreaming: {
		data: {
			uuid: string;
			user_id: string;
			key_word: string;
		};
		meta: MetaRes;
	};
};

export interface ICurrentPlanDetails {
	current_subscription_purchased_price
    available_session
    current_subscription_id
    active_session_id
    status
    plan_title
    plan_price
    plan_description
}

export type LoggedInUser = {
	email: string;
	uuid: string;
	first_name: string;
	last_name: string;
	profile_img: string;
	phone_number: string
	gender: string
	status: string
	user_type: string
	key_words: string
	key_word_count: number
	brand_id: number
	reset_password: boolean
}

export interface ITikTokSocialConnectionData {
	__typename: string;
	uuid: string;
	user_id: number;
	channel_name: string;
	channel_id: string;
	social_connection_id: number;
	facebook_id: string;
	last_access: boolean;
  }