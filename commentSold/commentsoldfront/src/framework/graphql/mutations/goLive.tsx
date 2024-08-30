import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const LIVE_STREAMING_LAYOUT_UPDATE = gql`
  ${META_FRAGMENT}
  mutation LiveStreamingLayoutUpdate($isCamera: Boolean) {
    liveStreamingLayoutUpdate(is_camera: $isCamera) {
      meta {
        ...MetaFragment
      }
    }
  }
`;
