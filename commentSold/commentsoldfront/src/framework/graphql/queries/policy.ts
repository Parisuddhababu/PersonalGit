import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const FETCH_POLICY_DETAILS = gql`
  ${META_FRAGMENT}
  query FetchPolicyDetails($page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    fetchPolicyDetails(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        uuid
        key
        value
        is_active
        created_at
        updated_at
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;
