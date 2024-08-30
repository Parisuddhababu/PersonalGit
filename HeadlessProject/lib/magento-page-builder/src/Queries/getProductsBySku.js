export const GET_PRODUCTS_BY_SKU_QUERY = /* GraphQL */ `
    query getProductsBySku($skus: [String]) {
        products(filter: { sku: { in: $skus } }) {
            items {
                id
                name
                sku
                small_image {
                    url
                }
                url_key
                price_range {
                    __typename
                    minimum_price {
                        regular_price {
                            value
                            currency
                        }
                        final_price {
                            value
                            currency
                        }
                        discount {
                            amount_off
                        }
                    }
                }
                special_price
            }
            total_count
            aggregations {
                attribute_code
                count
                label
                options {
                    label
                    value
                    count
                }
            }
        }
    }
`
