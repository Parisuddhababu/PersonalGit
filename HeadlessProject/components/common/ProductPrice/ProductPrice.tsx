import { usePrice, formatPrice } from './components'
import type { PriceRange } from '@graphql/schema/magentoSchema'
import cn from 'classnames'
import type { ReactElement } from 'react'
import s from './ProductPrice.module.scss'
import { useRouter } from 'next/router'

export type ProductPrice = {
    priceRange: PriceRange
    className?: string
    productType?: string
    bundlePrice?: { price: number; discountPrice: number } | null
    canUpdateBundlePrice?: boolean
}

export const ProductPrice = ({
    priceRange,
    className = '',
    productType,
    bundlePrice,
    canUpdateBundlePrice
}: ProductPrice): ReactElement => {
    const { locale = 'en' } = useRouter()
    const { subtotal, total } = usePrice(priceRange)

    const getConfigProductPrices = (price: PriceRange) => {
        const maxPrice = price?.maximum_price?.final_price
        const minPrice = price.minimum_price.final_price
        if (minPrice?.value! < maxPrice?.value!) {
            return `From ${formatPrice(minPrice, locale)} to ${formatPrice(
                maxPrice!,
                locale
            )}`
        }
        return null
    }

    if (
        productType === 'ConfigurableProduct' ||
        productType === 'BundleProduct'
    ) {
        if (bundlePrice?.price && canUpdateBundlePrice) {
            return (
                <div
                    className={cn(
                        s['product-price'],
                        'product-price',
                        className
                    )}
                >
                    <span>
                        {' '}
                        {formatPrice(
                            {
                                value: bundlePrice?.discountPrice,
                                currency:
                                    priceRange.minimum_price.regular_price
                                        .currency
                            },
                            locale
                        )}
                    </span>
                    {priceRange?.minimum_price?.regular_price?.value &&
                    bundlePrice?.price !== bundlePrice?.discountPrice ? (
                        <span className="line-through text-gs-2 pl-2 pr-3">
                            {formatPrice(
                                {
                                    value: bundlePrice?.price,
                                    currency:
                                        priceRange.minimum_price.regular_price
                                            .currency
                                },
                                locale
                            )}
                        </span>
                    ) : null}
                </div>
            )
        }
        const configProductPrices = getConfigProductPrices(priceRange)
        if (configProductPrices) {
            return (
                <div
                    className={cn(
                        s['product-price'],
                        'product-price',
                        className
                    )}
                >
                    <span>{configProductPrices}</span>
                </div>
            )
        }
    }

    return (
        <div className={cn(s['product-price'], 'product-price', className)}>
            <span>{total}</span>
            {priceRange?.minimum_price?.regular_price?.value &&
            subtotal !== total ? (
                <span className="line-through text-gs-2 pl-2 pr-3">
                    {subtotal}
                </span>
            ) : null}
        </div>
    )
}
