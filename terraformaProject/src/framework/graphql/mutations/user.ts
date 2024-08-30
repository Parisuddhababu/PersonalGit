import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
	mutation Login($login: SignupUserDto!) {
		login(login: $login) {
			data {
				user {
					email
					first_name
					last_name
					phone_number
					uuid
					is_required_reset_password
					introductory_page
					user_type
				}
				token
			}
			message
		}
	}
`;
export const USER_FORGOT_PASSWORD = gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			message
		}
	}
`;
export const USER_RESET_PASSWORD = gql`
	mutation ForgotSetPassword($userData: ResetPasswordDto!) {
		forgotSetPassword(userData: $userData) {
			message
		}
	}
`;

export const CHANGE_USER_STATUS = gql`
	mutation ChangeUserStatus($changeUserStatusId: Int, $status: Int) {
		changeUserStatus(id: $changeUserStatusId, status: $status) {
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

export const DELETE_USER = gql`
	mutation DeleteUser($deleteUserId: Int) {
		deleteUser(id: $deleteUserId) {
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
				user_role_id
				created_at
				updated_at
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

export const CREATE_USER = gql`
	mutation CreateUser($firstName: String, $middleName: String, $lastName: String, $userName: String, $email: String, $gender: Int, $dateOfBirth: Date, $password: String, $phoneCountryId: Int, $role: Int, $userRoleId: Int, $phoneNo: String, $profileImg: String) {
		createUser(first_name: $firstName, middle_name: $middleName, last_name: $lastName, user_name: $userName, email: $email, gender: $gender, date_of_birth: $dateOfBirth, password: $password, phone_country_id: $phoneCountryId, role: $role, user_role_id: $userRoleId, phone_no: $phoneNo, profile_img: $profileImg) {
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
				user_role_id
				created_at
				updated_at
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

export const UPDATE_USER = gql`
	mutation UpdateUser($updateUserId: Int, $firstName: String, $middleName: String, $lastName: String, $userName: String, $email: String, $gender: Int, $dateOfBirth: Date, $phoneNo: String, $profileImg: String, $phoneCode: String, $address: String, $pincode: Int, $stateId: Int, $countryId: Int) {
		updateUser(id: $updateUserId, first_name: $firstName, middle_name: $middleName, last_name: $lastName, user_name: $userName, email: $email, gender: $gender, date_of_birth: $dateOfBirth, phone_no: $phoneNo, profile_img: $profileImg, phone_code: $phoneCode, address: $address, pincode: $pincode, state_id: $stateId, country_id: $countryId) {
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
				user_role_id
				created_at
				updated_at
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
export const CHANGE_USER_PASSWORD = gql`
	mutation ChangeUserPassword($changeUserPasswordId: Int, $oldPassword: String, $newPassword: String, $confirmPasssword: String) {
		changeUserPassword(id: $changeUserPasswordId, oldPassword: $oldPassword, newPassword: $newPassword, confirmPasssword: $confirmPasssword) {
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

export const GROUP_DELETE = gql`
	mutation GroupDeleteUsers($groupDeleteUsersId: [Int]) {
		groupDeleteUsers(id: $groupDeleteUsersId) {
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
export const GRP_DEL_USER = gql`
	mutation GroupDeleteUsers($groupDeleteUsersId: [Int]) {
		groupDeleteUsers(id: $groupDeleteUsersId) {
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
	mutation Logout {
		logout {
			message
		}
	}
`;