import { gql } from '@apollo/client';

export const CREATE_EQUIPMENT = gql`mutation CreateEquipment($equipmentData: CreateEquipmentDto!) {
    createEquipment(equipmentData: $equipmentData) {
      message
      data {
        uuid
        name
        volume {
          uuid
          volume
          volume_cubic_yard
        }
      }
    }
  }`;
export const EDIT_EQUIPMENT = gql`mutation UpdateEquipment($equipmentData: UpdateEquipmentDto!) {
    updateEquipment(equipmentData: $equipmentData) {
      message
    }
  }`;
export const DELETE_EQUIPMENT = gql`mutation DeleteEquipment($equipmentId: String!) {
  deleteEquipment(equipmentId: $equipmentId) {
    message
  }
}`;
export const GET_EQUIPMENT_BY_NAME = gql`mutation GetEquipmentByName($equipmentName: String!) {
  getEquipmentByName(equipmentName: $equipmentName) {
    message
    data {
      uuid
      name
      volume {
        uuid
        volume
        volume_cubic_yard
      }
    }
  }
}`;
