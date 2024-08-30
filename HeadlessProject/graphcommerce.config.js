/**
 * Docs: https://graphcommerce.org/docs/framework/config
 *
 * @type {import('@graphcommerce/next-config/src/generated/config').GraphCommerceConfig}
 */
const config = {
  hygraphEndpoint: 'https://api-ap-south-1.hygraph.com/v2/clfcipo1105i001uk4cwy9t5a/master',
  magentoEndpoint: 'https://headlessmagento.demo.ecomextension.com/graphql',
  canonicalBaseUrl: 'https://headless.ecomextension.com/',
  storefront: [{ locale: 'en', magentoStoreCode: 'default' }],
}

module.exports = config
