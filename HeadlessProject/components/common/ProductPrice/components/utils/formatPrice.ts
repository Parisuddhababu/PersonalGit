import { Money } from "@graphql/schema/magentoSchema"


/**
 * Returns formatted price
 * @example '0' => '$0.00'
 * @param price Price object
 * @param locale locale from `useRouter` or `getStaticProps`
 * @returns Formatted price
 */
export const formatPrice = (price: Money, locale: string): string => {
    // const { value = 0, currency = 'USD' } = price || {}
    const formatCurrency = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: price?.currency ? price?.currency as string : 'USD'
    })

    return formatCurrency.format(price?.value!)
}
