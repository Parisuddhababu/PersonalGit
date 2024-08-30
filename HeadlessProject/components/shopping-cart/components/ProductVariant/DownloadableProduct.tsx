import { DownloadableCartItemFragment } from '@graphcommerce/magento-product-downloadable/DownloadableCartItem/DownloadableCartItem.gql'
import { Box, SxProps, Theme } from '@mui/material'

export type DownloadableProductProps = {
  sx?: SxProps<Theme>
} & DownloadableCartItemFragment
export const DownloadableProduct = (props: DownloadableProductProps) => {
  const { sx, links } = props

  if (links && links?.length < 0) {
    return <></>
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {links?.map((item, index) => (
        <span key={index}>
          <b>Links</b> : <span>{item?.title}</span>
        </span>
      ))}
    </Box>
  )
}

export default DownloadableProduct
