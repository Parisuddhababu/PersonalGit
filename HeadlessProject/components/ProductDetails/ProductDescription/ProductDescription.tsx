import { ProductPageDescriptionFragment } from '@graphcommerce/magento-product/components/ProductPageDescription/ProductPageDescription.gql'
import { ColumnTwoWithTopProps, extendableComponent } from '@graphcommerce/next-ui'
import { RichContent } from '@lib/magento-page-builder'
import { Box, SxProps, Theme, Typography } from '@mui/material'
import { ColumnTwo } from './ColumnTwo/ColumnTwo'

export type ProductPageDescriptionProps = ProductPageDescriptionFragment &
  Omit<ColumnTwoWithTopProps, 'top' | 'left'> & {
    sx?: SxProps<Theme>
  }

const componentName = 'ProductPageDescription'
const parts = ['root', 'description'] as const

const { classes } = extendableComponent(componentName, parts)

export function ProductDescription(props: ProductPageDescriptionFragment) {
  const { description } = props

  return (
    <ColumnTwo
      className={classes?.root}
      top={<Typography variant='h1' component='h1' />}
      left={
        description && (
          <Box>
            <RichContent html={description.html} />
          </Box>
        )
      }
    />
  )
}
