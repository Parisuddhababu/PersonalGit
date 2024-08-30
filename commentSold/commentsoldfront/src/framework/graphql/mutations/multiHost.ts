import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const INVITE_USERS = gql`
	${META_FRAGMENT}
	query InviteUserTojoinStreaming($email: [String]) {
		inviteUserTojoinStreaming(email: $email) {
			meta {
				...MetaFragment
			}
		}
	  }
`;

export const GET_STREAMING_TOKEN_MULTI_HOST = gql`
	${META_FRAGMENT}
	mutation GetStreamingToken( $token: String) {
		getStreamingToken(token: $token) {
		  data {
			uuid
			user_id
			channelName
			session_token
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;

export const JOIN_MULTI_LIVE_STREAMING = gql`
	${META_FRAGMENT}
	mutation JoinLiveStreaming($joinLiveStreamingInputParameters: joinLiveStreamingInputParameters) {
		joinLiveStreaming(joinLiveStreamingInputParameters: $joinLiveStreamingInputParameters) {
		  data {
			uuid
			user_id
			parent_id
			stream_platform_id
			stream_channel_id
			product_id
			stream_title
			stream_description
			host_type
			is_live
			is_streaming
			is_joined
			start_time
			end_time
			userStreamingPlatform {
			  uuid
			  user_id
			  user_stream_id
			  social_page_id
			  social_connection_id
			  streaming_platform
			  converter_id
			  stream_url
			  rtmp_converter_destroyed
			  social_channel_cdn_destroyed
			  live_video_id
			  video_id
			}
			product {
			  uuid
			  name
			  description
			  url
			  sku
			  color
			  size
			  price
			  images {
				uuid
				url
			  }
			}
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;

export const FETCH_STREAMING_PLATFORM_DETAILS = gql`
	${META_FRAGMENT}
	query FetchStreamPlatformsDetails {
		fetchStreamPlatformsDetails {
		  data {
			uuid
			title
			application_key
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;

export const START_INSTAGRAM_STREAMING = gql`
	${META_FRAGMENT}
	mutation StartInstragramStreaming(
		$instagramId: String
		$productId: String
		$password: String
		$streamTitle: String
		$streamDescription: String
	  ) {
		startInstragramStreaming(
		  instagram_id: $instagramId
		  product_id: $productId
		  password: $password
		  stream_title: $streamTitle
		  stream_description: $streamDescription
		) {
		  data {
			converter_id
			broadcast_id
			state
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
	  
`;

export const SEND_USER_COMMENT_CLICK = gql`
mutation SendUserCommentClick($hashCode: String, $headersInformation: String) {
	sendUserCommentClick(hash_code: $hashCode, headers_information: $headersInformation) {
	  data {
		product_details {
		  id
		  name
		  sku
		  description
		  color
		  size
		  price
		  url
		}
	  }
	  meta {
		message
		messageCode
		statusCode
		status
		type
		errors {
		  errorField
		  error
		}
		errorType
	  }
	}
  }
`;

export const GET_PRODUCT_BRAND_INFLUENCER = gql`
query GetProduct($streamingScheduleId: Int) {
	getProduct(streaming_schedule_id: $streamingScheduleId) {
	  data {
		uuid
		name
		description
		url
		sku
		color
		size
		price
		images {
		  uuid
		  url
		}
		productUser {
		  first_name
		  last_name
		  email
		  status
		}
	  }
	  meta {
		message
		messageCode
		statusCode
		status
		type
		errors {
		  errorField
		  error
		}
		errorType
	  }
	}
  } 
`;