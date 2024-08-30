import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_STREAMING_TOKEN = gql`
  query GetStreamingToken($scheduleUuid: String) {
    getStreamingToken(schedule_uuid: $scheduleUuid) {
      data {
        uuid
        session_token
        channelName
        user_id
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

export const START_LIVE_STREAMING = gql`
  mutation StartStreaming($startStreamingInputParameters: startStreamingInputParameters) {
    startStreaming(startStreamingInputParameters: $startStreamingInputParameters) {
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

export const DELETE_LIVE_STREAMING = gql`
  mutation DeleteStreaming {
    deleteStreaming {
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

export const UPDATE_LIVE_STREAMING = gql`
  mutation UpdateStreaming($productUuid: String) {
    updateStreaming(product_uuid: $productUuid) {
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
        key_word
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

export const UPDATE_FACEBOOK_STREAMING_DETAILS = gql`
  mutation UpdateFacebookStreamingDetails($streamTitle: String, $streamDescription: String) {
    updateFacebookStreamingDetails(stream_title: $streamTitle, stream_description: $streamDescription) {
      data {
        uuid
        user_id
        parent_id
        stream_platform_id
        social_connection_id
        product_id
        stream_title
        stream_description
        is_joined
        is_live
        is_streaming
        start_time
        end_time
        converter_id
        stream_url
        live_video_id
        rtmp_converter_destroyed
        social_channel_cdn_destroyed
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

export const END_LIVE_STREAMING = gql`
  mutation EndliveStreaming($scheduledId: Int) {
    endliveStreaming(scheduled_id: $scheduledId) {
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

export const GET_COMMENTS = gql`
  query GetStreamingComments($filter: String, $date: String) {
    getStreamingComments(filter: $filter, date: $date) {
      data {
        uuid
        user_social_name
        comment_id
        comments
        comments_platform
        is_keyword
        is_other_post_comment
        created_at
        replies {
          uuid
          user_social_name
          comment_id
          comment_parent_id
          comments
          is_other_post_comment
          created_at
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

export const FETCH_VIEWS = gql`
  query FetchLiveViews {
    fetchLiveViews {
      data {
        live_views
        facebook_count
        instagram_count
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

export const LIST_SOCIAL_PAGES = gql`
  query ListSocialPages($facebookId: String) {
    listSocialPages(facebook_id: $facebookId) {
      data {
        uuid
        user_id
        social_connection_id
        facebook_id
        social_page_id
        social_page_title
        page_token_expires_at
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

export const GET_CURRENT_USER_STREAMING = gql`
  query GetCurrentUserStreaming {
    getCurrentUserStreaming {
      data {
        uuid
        stream_platform_id
        social_connection_id
        stream_title
        stream_description
        is_joined
        is_live
        is_streaming
        start_time
        end_time
        converter_id
        stream_url
        live_video_id
        rtmp_converter_destroyed
        social_channel_cdn_destroyed
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

export const SEND_COMMENT_REPLY = gql`
  mutation SendCommentReply($liveVideoId: String, $commentId: String, $comment: String) {
    sendCommentReply(live_video_id: $liveVideoId, comment_id: $commentId, comment: $comment) {
      data {
        id
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

export const SEND_COMMENT = gql`
  mutation SendComment($liveVideoId: String, $comment: String) {
    sendComment(live_video_id: $liveVideoId, comment: $comment) {
      data {
        id
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

export const SEND_INSTAGRAM_COMMENT = gql`
  mutation SendInstagramLiveStreamingComments($broadcastId: String, $comment: String) {
    sendInstagramLiveStreamingComments(broadcast_id: $broadcastId, comment: $comment) {
      data {
        uuid
        user_id
        stream_platform_id
        social_connection_id
        social_page_id
        user_social_id
        user_social_name
        product_id
        comment_id
        comment_parent_id
        comments
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

export const GET_INSTA_COMMENTS = gql`
  query GetInstagramComments($broadcastId: String) {
    getInstagramComments(broadcast_id: $broadcastId) {
      data {
        uuid
        user_id
        stream_platform_id
        social_connection_id
        social_page_id
        user_social_id
        user_social_name
        product_id
        comment_id
        comment_parent_id
        comments
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

export const GET_STREAMING_KEYWORD = gql`
  query GetStreamingKeyword($streamingUserId: Int, $streamingScheduleId: Int) {
    getStreamingKeyword(streaming_user_id: $streamingUserId, streaming_schedule_id: $streamingScheduleId) {
      data {
        key_word
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


export const LIVE_STREAMING_PRODUCT_UPDATE = gql`
  ${META_FRAGMENT}
  mutation LiveStreamingProductUpdate($displayProduct: Boolean) {
    liveStreamingProductUpdate(display_product: $displayProduct) {
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
        streaming_start_time
        streaming_end_time
        key_word
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