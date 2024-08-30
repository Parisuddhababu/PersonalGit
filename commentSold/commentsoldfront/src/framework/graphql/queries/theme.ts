import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_PRIMARY_COLOR = gql`
  ${META_FRAGMENT}
  query GetPrimaryColor {
    getPrimaryColor {
      data {
        primary_color
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const FIND_BRAND_REGISTER = gql`
  ${META_FRAGMENT}
  query FindBrandRegister {
    findBrandRegister {
      data {
        is_brand_register
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;
