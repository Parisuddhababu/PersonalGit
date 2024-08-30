import { gql } from '@apollo/client';

export const CREATE_MATERIAL= gql`mutation CreateMaterial($materialData: CreateMaterialDto!) {
    createMaterial(materialData: $materialData) {
      message
      data {
        uuid
        name
        materialDetails {
          uuid
          type
          weight
        }
      }
    }
  }`;
export const EDIT_MATERIAL= gql`mutation UpdateMaterial($materialData: UpdateMaterialDto!) {
  updateMaterial(materialData: $materialData) {
    message
  }
}`;
export const DELETE_MATERIAL = gql`mutation DeleteMaterial($materialId: String!) {
  deleteMaterial(materialId: $materialId) {
    message
  }
}`;
