import { DownloadableProductOptionsFragment } from '@graphcommerce/magento-product-downloadable/components/DownloadableProductOptions/DownloadableProductOptions.gql'
import {
  Box,
  Checkbox,
  Divider,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ProductPagePriceFragment } from '@graphcommerce/magento-product'

type DownloadableProductOptionsProps = {
  product: DownloadableProductOptionsFragment & ProductPagePriceFragment
  linkType?: string
  setDownloadableProductsLinks?: (payload: any) => void
}

const Link = styled('span')({
  color: 'blue',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
})

export const DownloadableProductOption = (props: DownloadableProductOptionsProps) => {
  const { product, linkType, setDownloadableProductsLinks } = props

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleLinkClick = (url: string | undefined | null) => {
    if (url) {
      window.open(url, '_blank')
    }
    return null
  }

  useEffect(() => {
    if (setDownloadableProductsLinks) {
      const payload = {
        selectedOptions,
      }
      setDownloadableProductsLinks(payload)
    }
  }, [selectedOptions, setDownloadableProductsLinks])

  const handleCheckboxChange = (uid: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(uid)) {
        return prevSelectedOptions.filter((option) => option !== uid)
      } else {
        return [...prevSelectedOptions, uid]
      }
    })
  }

  return (
    <Box>
      {linkType === 'link' && (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <InputLabel required>{product.links_title}</InputLabel>
          {product?.downloadable_product_links?.map((prd) => (
            <List
              key={prd?.uid}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                right: '3.688rem',
                top: '0.438rem',
                bottom: '0.438rem',
              }}
            >
              <Checkbox
                checked={selectedOptions.includes(prd?.uid as string)}
                onChange={() => handleCheckboxChange(prd?.uid as string)}
              />
              <Typography>{prd?.title}</Typography>
              <Typography sx={{ paddingLeft: '0.5rem' }}>{'+'}</Typography>
              <Typography sx={{ paddingLeft: '0.5rem' }}>{'$'}</Typography>

              {<Typography>{prd?.price}</Typography>}
              <Box sx={{ marginLeft: '16px' }}>
                <ListItem
                  sx={{ paddingLeft: '0' }}
                  onClick={() => handleLinkClick(prd?.sample_url)}
                >
                  <ListItemText primary={<Link>{'sample'}</Link>} />
                </ListItem>
              </Box>
            </List>
          ))}
        </Box>
      )}
      {linkType === 'sample' && (
        <Box>
          {product?.downloadable_product_samples?.map((prd_smp) => (
            <List key={prd_smp?.sort_order}>
              <Typography>{product?.sample_links_title}</Typography>
              <ListItem
                sx={{ paddingLeft: '0' }}
                onClick={() => handleLinkClick(prd_smp?.sample_url)}
              >
                <ListItemText primary={<Link>{prd_smp?.title}</Link>} />
              </ListItem>
            </List>
          ))}
        </Box>
      )}
    </Box>
  )
}
