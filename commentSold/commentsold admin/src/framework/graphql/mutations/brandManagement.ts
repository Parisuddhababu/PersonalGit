import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}
mutation CreateBrandUserRequest($brandName: String, $brandRepresentative: String, $brandEmail: String, $influencerCount: Int, $sessionCount: Int) {
	createBrandUserRequest(brand_name: $brandName, brand_representative: $brandRepresentative, brand_email: $brandEmail, influencer_count: $influencerCount, session_count: $sessionCount) {
	  data {
		uuid
		brand_name
		brand_representative
		brand_email
		request_status
		influencer_count
		session_count
		created_at
		updated_at
	  }
	  meta {
		...MetaFragment
	}
	}
  }
`;

export const UPDATE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}
mutation UpdateBrandUserRequest($uuid: UUID, $brandName: String, $brandRepresentative: String, $requestStatus: String, $influencerCount: Int, $sessionCount: Int) {
	updateBrandUserRequest(uuid: $uuid, brand_name: $brandName, brand_representative: $brandRepresentative, request_status: $requestStatus, influencer_count: $influencerCount, session_count: $sessionCount) {
	  data {
		uuid
		brand_name
		brand_representative
		brand_email
		request_status
		influencer_count
		session_count
		created_at
		updated_at
	  }
	  meta {
		...MetaFragment
	}
	}
  }
`;


export const CHANGE_BRAND_REQUEST_STATUS = gql`
${META_FRAGMENT}
mutation UpdateBrandUserRequestStatus($uuid: UUID, $requestStatus: String) {
	updateBrandUserRequestStatus(uuid: $uuid, request_status: $requestStatus) {
		meta {
			...MetaFragment
		}
	}
  }
`;


export const DELETE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}

mutation DeleteBrandUserRequest($uuid: UUID) {
	deleteBrandUserRequest(uuid: $uuid) {
		meta {
			...MetaFragment
		}
	}
  }

`;

export const APPROVE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}

mutation ApproveBrandUserRequest($uuid: UUID, $domainName: String,$companyName: String, $firstName: String, $lastName: String, $email: String, $phoneNumber: String, $countryCodeId: String, $sessionCount: Int, $influencerCount: Int) {
	approveBrandUserRequest(uuid: $uuid, domain_name: $domainName, company_name: $companyName, first_name: $firstName, last_name: $lastName, email: $email, phone_number: $phoneNumber, country_code_id: $countryCodeId, session_count: $sessionCount, influencer_count: $influencerCount) {
		meta {
			...MetaFragment
		}
	}
  }
`;