import { ProductSpecsFragment } from '@graphcommerce/magento-product/components/ProductSpecs/ProductSpecs.gql'
import { RowProductFragment } from './RowProduct.gql'
import { Backstory, Grid, Swipeable, Upsells } from './variant'

type VariantRenderer = Record<
  NonNullable<RowProductFragment['variant']>,
  React.VFC<RowProductFragment>
>

type RowProductProps = RowProductFragment & {
  renderer?: Partial<VariantRenderer>
} & ProductSpecsFragment & { items?: unknown }

const defaultRenderer: Partial<VariantRenderer> = {
  Backstory,
  Grid,
  Upsells,
  Swipeable,
}

export function RowProduct(props: RowProductProps) {
  const { renderer, variant, ...RowProductProps } = props
  const mergedRenderer = { ...defaultRenderer, ...renderer } as VariantRenderer

  if (!variant) return null

  const RenderType =
    mergedRenderer?.[variant] ??
    (() => {
      return null
    })

  return <RenderType {...RowProductProps} />
}
