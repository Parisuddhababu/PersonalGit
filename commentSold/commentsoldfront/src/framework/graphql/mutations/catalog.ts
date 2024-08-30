import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

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

export const DELETE_CATALOG = gql`
	${META_FRAGMENT}
	mutation DeleteProduct($uuid: UUID) {
		deleteProduct(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	  }
`;

export const CREATE_CATALOG = gql`
	${META_FRAGMENT}
	mutation CreateProduct($name: String, $url: String, $description: String, $sku: String, $images: [String], $color: String, $size: String, $price: String) {
		createProduct(name: $name, url: $url, description: $description, sku: $sku, images: $images, color: $color, size: $size, price: $price) {
		  data {
			uuid
			name
			description
			url
			sku
			color
			size
			price
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;

export const UPDATE_CATALOG = gql`
	${META_FRAGMENT}
	mutation UpdateProduct($uuid: UUID, $name: String, $url: String, $description: String, $sku: String, $images: [String], $color: String, $size: String, $price: String) {
		updateProduct(uuid: $uuid, name: $name, url: $url, description: $description, sku: $sku, images: $images, color: $color, size: $size, price: $price) {
		  data {
			uuid
			name
			description
			url
			sku
			color
			size
			price

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

export const GROUP_DELETE = gql`
	${META_FRAGMENT}
	mutation GroupDeleteUsers($groupDeleteUsersId: [Int]) {
		groupDeleteUsers(id: $groupDeleteUsersId) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GRP_DEL_USER = gql`
	${META_FRAGMENT}
	mutation GroupDeleteUsers($groupDeleteUsersId: [UUID]) {
		groupDeleteUsers(uuid: $groupDeleteUsersId) {
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

export const GROUP_DELETE_PRODUCTS = gql`
	${META_FRAGMENT}
	mutation GroupDeleteProducts($uuid: [UUID]) {
		groupDeleteProducts(uuid: $uuid) {
		  meta {
			...MetaFragment
		  }
		}
	}
`