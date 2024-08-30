import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_SETTINGS_BY_ID = gql`
	${META_FRAGMENT}
	query FetchSettingsDetails($page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
		fetchSettingsDetails(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
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
