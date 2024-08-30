import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_PRODUCTS = gql`
  ${META_FRAGMENT}
  query FetchProducts($page: Int, $limit: Int, $name: String, $sortBy: String, $sortOrder: String, $isAllProducts: Boolean) {
    fetchProducts(page: $page, limit: $limit, name: $name, sortBy: $sortBy, sortOrder: $sortOrder, isAllProducts: $isAllProducts) {
      data {
        productData {
          uuid
          name
          description
          url
          sku
          color
          size
          price
          images {
            uuid
            url
          }
          productUser {
            first_name
            last_name
            email
            status
          }
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  ${META_FRAGMENT}
  query FetchProduct($uuid: UUID) {
    fetchProduct(uuid: $uuid) {
      data {
        uuid
        name
        description
        url
        sku
        color
        size
        price
        images {
          uuid
          url
        }
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_CATALOG_BY_ID = gql`
  ${META_FRAGMENT}
  query FetchProduct($uuid: UUID) {
    fetchProduct(uuid: $uuid) {
      data {
        uuid
        name
        description
        url
        sku
        color
        size
        price
        images {
          uuid
          url
        }
        productUser {
          first_name
          last_name
          email
          status
        }
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const SYNC_WHI_PRODUCT = gql`
  ${META_FRAGMENT}
  query SyncWhiUserProduct {
    syncWhiUserProduct {
      meta {
        ...MetaFragment
      }
    }
  }
`;
