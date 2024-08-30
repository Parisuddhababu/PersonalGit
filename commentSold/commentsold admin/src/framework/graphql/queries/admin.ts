import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ADMIN = gql`
query GetProfile {
	getProfile {
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
	meta {...MetaFragment}
	}
  }
	${META_FRAGMENT}
`;
