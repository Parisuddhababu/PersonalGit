import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const UPDATE_ADMIN_PROFILE = gql`
	${META_FRAGMENT}
	mutation UpdateProfile($firstName: String, $lastName: String) {
		updateProfile(first_name: $firstName, last_name: $lastName) {
		  data {
			uuid
			first_name
			last_name
			email
			gender
			phone_number
			user_type
			country_code_id
			status
			created_at
			updated_at
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;
export const CHANGE_USERPROFILE_PASSWORD = gql`
	${META_FRAGMENT}
	mutation ChangeProfilePassword($confirmPassword: String, $newPassword: String, $currentPassword: String) {
		changeProfilePassword(confirmPassword: $confirmPassword, newPassword: $newPassword, currentPassword: $currentPassword) {
			meta {
				...MetaFragment
			}
		}
	  }
`;
