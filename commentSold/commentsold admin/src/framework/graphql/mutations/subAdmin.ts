import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CHANGE_SUBADMIN_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateSubAdminStatus($uuid: UUID, $status: UserStatus) {
		updateSubAdminStatus(uuid: $uuid, status: $status) {
			meta {
				...MetaFragment
			}
		}
	  }
`;

export const DELETE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation DeleteSubAdmin($uuid: UUID) {
		deleteSubAdmin(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	  }
`;


export const CREATE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation CreateSubAdmin($firstName: String, $lastName: String, $email: String, $gender: Gender, $password: String, $phoneNumber: String, $role: String, $status: UserStatus) {
		createSubAdmin(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, password: $password, phone_number: $phoneNumber, role: $role, status: $status) {
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

export const UPDATE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation UpdateSubAdmin($uuid: UUID, $firstName: String, $lastName: String, $gender: Gender, $countryCodeId: String, $phoneNumber: String, $status: UserStatus, $role: String) {
		updateSubAdmin(uuid: $uuid, first_name: $firstName, last_name: $lastName, gender: $gender, country_code_id: $countryCodeId, phone_number: $phoneNumber, status: $status, role: $role) {
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

