import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_SETTINGS = gql`
	${META_FRAGMENT}
	mutation UpdateSetting($influencerCount: String, $sessionCount: String, $sessionTime: String) {
		updateSetting(influencer_count: $influencerCount, session_count: $sessionCount, session_time: $sessionTime) {
			meta {
				...MetaFragment
			}
		}
	  }
	
`;
