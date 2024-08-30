import { gql } from '@apollo/client'
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_PRODUCTS = gql`
${META_FRAGMENT}

query FetchProducts($page: Int, $limit: Int, $name: String, $sortBy: String, $sortOrder: String) {
  fetchProducts(page: $page, limit: $limit, name: $name, sortBy: $sortBy, sortOrder: $sortOrder) {
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
      }
      count
    }
    meta {  ...MetaFragment }
  }
}
`;


export const GET_CATALOUGE_BY_ID = gql`
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

