import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const LOGIN_USER = gql`
	${META_FRAGMENT}
	mutation Mutation($email: String, $password: String, $type: userType) {
		loginUser(email: $email, password: $password, type: $type) {
			data {
				user {
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
				token
				refreshToken
				permissions
				expiresIn
				expiresAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const USER_FORGOT_PASSWORD = gql`
	${META_FRAGMENT}

	mutation ForgotPassword($email: String, $type: userType) {
		forgotPassword(email: $email, type: $type) {
			meta {
				...MetaFragment
			}
		}
	  }
`;
export const USER_RESET_PASSWORD = gql`
	${META_FRAGMENT}

	mutation Mutation($password: String, $confirmPassword: String, $token: String) {
		resetPassword(password: $password, confirmPassword: $confirmPassword, token: $token) {
			meta {
				...MetaFragment
			}
		}
	  }
`;

export const CHANGE_USER_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeUserStatus($changeUserStatusId: UUID, $status: Int) {
		changeUserStatus(uuid: $changeUserStatusId, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_USER = gql`
	${META_FRAGMENT}
	mutation DeleteUser($deleteUserId: UUID) {
		deleteUser(uuid: $deleteUserId) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_USER = gql`
	${META_FRAGMENT}
	mutation CreateUser($firstName: String, $middleName: String, $lastName: String, $userName: String, $email: String, $gender: Int, $dateOfBirth: Date, $password: String, $phoneCountryId: Int, $phoneNo: String, $profileImg: String) {
		createUser(first_name: $firstName, middle_name: $middleName, last_name: $lastName, user_name: $userName, email: $email, gender: $gender, date_of_birth: $dateOfBirth, password: $password, phone_country_id: $phoneCountryId, phone_no: $phoneNo, profile_img: $profileImg) {
			data {
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

export const UPDATE_USER = gql`
	${META_FRAGMENT}
	mutation UpdateUser($updateUserId: UUID, $firstName: String, $middleName: String, $lastName: String, $userName: String, $email: String, $gender: Int, $dateOfBirth: Date, $phoneNo: String, $phoneCode: String, $address: String, $pincode: Int, $stateId: Int, $countryId: Int) {
		updateUser(uuid: $updateUserId, first_name: $firstName, middle_name: $middleName, last_name: $lastName, user_name: $userName, email: $email, gender: $gender, date_of_birth: $dateOfBirth, phone_no: $phoneNo, phone_code: $phoneCode, address: $address, pincode: $pincode, state_id: $stateId, country_id: $countryId) {
			data {
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
export const CHANGE_USER_PASSWORD = gql`
	${META_FRAGMENT}
	mutation ChangeUserPassword($changeUserPasswordId: UUID, $newPassword: String, $confirmPassword: String) {
		changeUserPassword(uuid: $changeUserPasswordId, newPassword: $newPassword, confirmPasssword: $confirmPassword) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const VERIFY_USER_RESET_PASSWORD = gql`
	mutation VerifyForgotPasswordToken {
		verifyForgotPasswordToken {
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

export const LOGOUT = gql`
	${META_FRAGMENT}
	mutation LogoutUser {
		logoutUser {
			meta {
				...MetaFragment
			}
		}
	}
`;
