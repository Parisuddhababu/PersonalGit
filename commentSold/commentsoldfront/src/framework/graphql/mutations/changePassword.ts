import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const CHANGE_PROFILE_PASSWORD=gql`
	${META_FRAGMENT}
	mutation ChangeProfilePassword($confirmPassword: String, $newPassword: String, $currentPassword: String) {
		changeProfilePassword(confirmPassword: $confirmPassword, newPassword: $newPassword, currentPassword: $currentPassword) {
			meta {
				...MetaFragment
			}
		}
	  }
`;