import { gql } from '@apollo/client';

export const CREATE_FREQUENCY = gql`mutation CreateFrequency($frequencyData: CreateFrequencyDto!) {
    createFrequency(frequencyData: $frequencyData) {
      message
      data {
        uuid
        frequency_type
        frequency
      }
    }
  }`;
export const EDIT_FREQUENCY = gql`mutation UpdateFrequency($frequencyData: UpdateFrequencyDto!) {
  updateFrequency(frequencyData: $frequencyData) {
    message
    data {
      uuid
      frequency_type
      frequency
    }
  }
}`;
export const DELETE_FREQUENCY= gql`mutation DeleteFrequency($frequencyId: String!) {
  deleteFrequency(frequencyId: $frequencyId) {
    message
  }
}`;

