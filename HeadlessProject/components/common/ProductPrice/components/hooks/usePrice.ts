
import { Cart, CartItemPrices, CartPrices, CartTaxItem, Discount, Maybe, Money, PriceRange } from '@graphql/schema/magentoSchema'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { formatPrice } from '../'

export type UsePriceReturn = {
    subtotal?: string
    total: string
    discount?: string | null
    shipping?: string | null
    taxes?: string | null
    storeCredit?: string | null
}

/**
 * Returns price object
 * @param price Price object
 * @param cart Optional cart object to get `shipping` and `storeCredit`
 * @returns prices: subtotal, total, discount, shipping, taxes, storeCredit
 */
export default function usePrice(
    price?: Maybe<CartPrices | CartItemPrices | PriceRange>,
    cart?: Cart
): UsePriceReturn {
    const { locale = 'en' } = useRouter()

    const value = useMemo(() => {
        if (!price) {
            return {
                subtotal: '',
                total: '',
                discount: ''
            }
        }

        const { __typename } = price
        if (!__typename) {
            throw 'Add `__typename` to the `price` object (query) to use the `usePrice` hook'
        }

        switch (__typename) {
            case 'CartPrices':
                return getCartPrices(price as CartPrices, locale, cart)
            case 'CartItemPrices':
                return getCartItemPrices(price as CartItemPrices, locale)
            case 'PriceRange':
                return getProductPrices(price as PriceRange, locale)
            default:
                throw 'Price object should be instance of CartPrices, CartItemPrices or PriceRange'
        }
    }, [price, locale, cart])

    return value
}

const getTotalValue = (items: Array<CartTaxItem | Discount>) =>
    (items || []).reduce((acc, item) => (acc += item?.amount?.value ?? 0), 0)

const getCartPrices = (price: CartPrices, locale: string, cart?: Cart) => {
    const {
        grand_total,
        subtotal_excluding_tax,
        discounts,
        applied_taxes
    } = price

    const currency = grand_total!.currency
    const discountPrice = getTotalValue(discounts as Discount[])
    const discount = {
        value: discountPrice,
        currency
    }

    const shippingAddress = cart?.shipping_addresses?.[0]

    // Calculate taxes only when shipping address is set
    const taxes = shippingAddress && {
        value: getTotalValue(applied_taxes as CartTaxItem[]),
        currency
    }

    const shipping = shippingAddress?.selected_shipping_method?.amount

    // WARNING !!! START
    // There is a Magento BE issue related to incorrect store credit and grand total calculation.
    // Custom solution on FE is required to fix it!
    // Please, do not edit! Please, inform if you see any problems with services other than Magento!
    const storeCredit =
        cart?.applied_store_credit?.enabled &&
        cart?.applied_store_credit?.applied_balance?.value &&
        cart?.applied_store_credit?.applied_balance

    const totalValue = storeCredit
        ? grand_total!.value! - storeCredit!.value!
        : grand_total!.value!

    // if there was only 1 product in cart - total value after calculations can become negative.
    // Therefore make sure it is at least 0.
    const positiveTotalValue = totalValue > 0 ? totalValue : 0
    // WARNING !!! END

    const total = { value: positiveTotalValue, currency }

    const result = {
        total: formatPrice(total!, locale),
        subtotal: formatPrice(subtotal_excluding_tax!, locale),
        discount: discountPrice > 0 ? formatPrice(discount, locale) : null,
        taxes: taxes ? formatPrice(taxes, locale) : null,
        shipping: shipping ? formatPrice(shipping, locale) : null,
        storeCredit: storeCredit ? formatPrice(storeCredit, locale) : null
    }

    return result
}

const getCartItemPrices = (price: CartItemPrices, locale: string) => {
    const { row_total, total_item_discount } = price

    const result = {
        total: formatPrice(row_total as Money, locale),
        discount: formatPrice(total_item_discount as Money, locale)
    }

    return result
}

const getProductPrices = (price: PriceRange, locale: string) => {
    const {
        minimum_price: { discount, final_price, regular_price }
    } = price

    const result = {
        subtotal: formatPrice(regular_price, locale),
        total: formatPrice(final_price, locale),
        discount: formatPrice(
            { value: discount!.amount_off, currency: final_price.currency },
            locale
        )
    }

    return result
}
