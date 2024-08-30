import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';


export const DELETE_CATALOGUE = gql`
	${META_FRAGMENT}
	mutation DeleteProduct($uuid: UUID) {
		deleteProduct(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	  }
`;

export const CREATE_CATALOGUE = gql`
	${META_FRAGMENT}
	mutation CreateProduct($name: String, $url: String, $description: String, $sku: String, $images: [String], $color: String, $size: String, $price: String) {
		createProduct(name: $name, url: $url, description: $description, sku: $sku, images: $images, color: $color, size: $size, price: $price) {
		  data {
			uuid
			name
			description
			url
			sku
			color
			size
			price
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;

export const UPDATE_CATALOUGE = gql`
	${META_FRAGMENT}
	mutation UpdateProduct($uuid: UUID, $name: String, $url: String, $description: String, $sku: String, $images: [String], $color: String, $size: String, $price: String) {
		updateProduct(uuid: $uuid, name: $name, url: $url, description: $description, sku: $sku, images: $images, color: $color, size: $size, price: $price) {
		  data {
			uuid
			name
			description
			url
			sku
			color
			size
			price
		  }
		  meta {
			...MetaFragment
		}
		}
	  }
`;


