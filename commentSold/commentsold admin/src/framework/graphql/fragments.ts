import { gql } from '@apollo/client';

export const META_FRAGMENT = gql`
	fragment MetaFragment on Meta {
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
`;
