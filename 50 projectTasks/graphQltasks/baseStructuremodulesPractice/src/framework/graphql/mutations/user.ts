import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
	mutation Mutation($email: String, $password: String) {
		loginUser(email: $email, password: $password) {
			data {
				user {
					id
					uuid
					first_name
					middle_name
					last_name
					user_name
					email
					gender
					date_of_birth
					phone_no
					phone_country_id
					role
					profile_img
					device_type
					status
					user_role_id
					created_at
					updated_at
				}
				token
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
export const USER_FORGOT_PASSWORD = gql`
	mutation ForgotPassword($email: String) {
		forgotPassword(email: $email) {
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
