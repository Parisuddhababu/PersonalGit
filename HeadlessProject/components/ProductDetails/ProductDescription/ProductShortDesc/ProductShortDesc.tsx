import { ProductShortDescriptionFragment } from '@graphcommerce/magento-product'
import { RichContent } from '@lib/magento-page-builder'

type ProductShortDescriptionProps = ProductShortDescriptionFragment

export function ProductShortDesc(props: ProductShortDescriptionProps) {
  const { short_description } = props

  return <RichContent html={short_description?.html} />
}
