import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const UPDATE_ADMIN_PROFILE = gql`
	${META_FRAGMENT}
	mutation UpdateUserProfile($firstName: String, $lastName: String) {
		updateUserProfile(first_name: $firstName, last_name: $lastName) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CHANGE_USERPROFILE_PASSWORD = gql`
	${META_FRAGMENT}
	mutation Mutation($oldPassword: String, $newPassword: String, $confirmPasssword: String) {
		changeUserProfilePassword(oldPassword: $oldPassword, newPassword: $newPassword, confirmPasssword: $confirmPasssword) {
			meta {
				...MetaFragment
			}
		}
	}
`;
