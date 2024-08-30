import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const SEARCH_SUBADMIN = gql`
	${META_FRAGMENT}
	query SearchSubAdmin($firstName: String, $lastName: String, $email: String, $status: Int, $role: Int) {
		searchSubAdmin(first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role) {
			data {
				count
				subAdminData {
					id
					first_name
					last_name
					user_name
					email
					password
					role
					status
					created_at
					updated_at
				}
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_SUBADMIN = gql`
${META_FRAGMENT}
query FetchSubAdmins($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
	fetchSubAdmins(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
	  data {
		subAdminData {
		  uuid
		  first_name
		  last_name
		  email
		  user_type
		  country_code_id
		  phone_number
		  status
		  RoleData {
			uuid
			role_name
			description
		  }
		  created_at
		  updated_at
		}
		count
	  }
	  meta {
		...MetaFragment
	}
	  
	}
  }
`;

export const GET_SUBADMIN_BY_ID = gql`
	${META_FRAGMENT}
	query FetchSubAdmin($uuid: UUID) {
		fetchSubAdmin(uuid: $uuid) {
		  data {
			uuid
			first_name
			last_name
			email
			user_type
			country_code_id
			phone_number
			status
			RoleData {
			  uuid
			  role_name
			  description
			}
			created_at
			updated_at
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;
