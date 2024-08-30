import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_CMS = gql`
${META_FRAGMENT}
mutation UpdatePolicy($key: String, $value: String, $isActive: Boolean) {
    updatePolicy(key: $key, value: $value, is_active: $isActive) {
      meta {
				...MetaFragment
			}
    }
  }
`