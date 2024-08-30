import { gql } from '@apollo/client';


export const CREATE_VOLUME = gql`mutation CreateVolume($volumeData: CreateVolumeDto!) {
    createVolume(volumeData: $volumeData) {
      message
      data {
        uuid
        volume
        volume_cubic_yard
      }
    }
  }`;

export const EDIT_VOLUME = gql`mutation UpdateVolume($volumeData: UpdateVolumeDto!) {
  updateVolume(volumeData: $volumeData) {
    message
    data {
      uuid
      volume
      volume_cubic_yard
    }
  }
}`;

export const DELETE_VOLUME= gql`mutation DeleteVolume($volumeId: String!) {
  deleteVolume(volumeId: $volumeId) {
    message
  }
}`;
