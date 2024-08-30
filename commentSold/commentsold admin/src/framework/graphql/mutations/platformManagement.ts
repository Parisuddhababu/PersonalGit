import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const SOCIAL_PLATFORM_STATUS_CHANGE = gql`
  ${META_FRAGMENT}
  mutation ActivateDeactivateSocialConnection($uuid: UUID, $status: ActivateDeactivate) {
    activateDeactivateSocialConnection(uuid: $uuid, status: $status) {
      meta {
        ...MetaFragment
      }
    }
  }
`;
