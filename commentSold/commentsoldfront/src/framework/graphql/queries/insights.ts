import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_STREAMING_INSIGHTS = gql`
  ${META_FRAGMENT}
  query GetStreamingInsights {
    getStreamingInsights {
      data {
        session_views {
          platform
          view_platform_count
        }
        comment_count {
          comments_platform
          comments_platform_count
        }
        total_session
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_TOP_FIVE_COMMENT_INSIGHTS = gql`
  ${META_FRAGMENT}

  query GetTopFiveCommentsInsights($startDate: Date, $endDate: Date, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    getTopFiveCommentsInsights(start_date: $startDate, end_date: $endDate, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        comments {
          user_streaming_id
          facebook_comments
          instagram_comments
          youtube_comments
          tiktok_comments
          total_comments
          stream_title
          start_time
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_TOP_FIVE_INFLUENCER_INSIGHTS = gql`
  ${META_FRAGMENT}
  query GetTopFiveInfluencerInsights($startDate: Date, $endDate: Date, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    getTopFiveInfluencerInsights(start_date: $startDate, end_date: $endDate, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        influencer {
          name
          total_streaming_count
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_TOP_FIVE_PRODUCT_INSIGHTS = gql`
  ${META_FRAGMENT}
  query GetTopFiveProductInsights($startDate: Date, $endDate: Date, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    getTopFiveProductInsights(start_date: $startDate, end_date: $endDate, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        products {
          name
          total_click_count
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_TOP_FIVE_VIEWS_INSIGHTS = gql`
  ${META_FRAGMENT}
  query GetTopFiveViewsInsights($startDate: Date, $endDate: Date, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    getTopFiveViewsInsights(start_date: $startDate, end_date: $endDate, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        views {
          user_streaming_id
          facebook_views
          instagram_views
          youtube_views
          tiktok_views
          total_views
          stream_title
          start_time
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_STREAMING_SESSION_INSIGHT_DETAILS = gql`
  ${META_FRAGMENT}
  query GetStreamingSessionInsightsDetails($uuid: UUID) {
    getStreamingSessionInsightsDetails(uuid: $uuid) {
      data {
        uuid
        duration
        stream_title
        start_time
        end_time
        session_views {
          platform
          view_platform_count
        }
        multi_host_user_details {
          uuid
          email
          first_name
          last_name
        }
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_STREAMING_SESSION_PRODUCT_INSIGHT_DETAILS = gql`
  ${META_FRAGMENT}
  query GetStreamingSessionProductsInsightsDetails($streamId: UUID, $userId: UUID) {
    getStreamingSessionProductsInsightsDetails(stream_id: $streamId, user_id: $userId) {
      data {
        name
        image_url
        description
        color
        size
        click {
          Facebook
          Instagram
          Youtube
          TikTok
        }
        comment {
          Facebook
          Instagram
          Youtube
          TikTok
        }
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;
