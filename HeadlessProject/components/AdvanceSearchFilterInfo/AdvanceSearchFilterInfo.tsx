import { AlertToast } from '@components/AlertToast'
import { ProductListParams } from '@graphcommerce/magento-product'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'

type filtersType = [string, { match?: string; in?: string[]; from?: string; to?: string }][]

export const AdvanceSearchFilterInfo = (props: {
  filters: filtersType
  noItems: Boolean
  totalCount: number | null | undefined
  params: ProductListParams
}) => {
  const { filters, noItems, totalCount, params } = props
  const router = useRouter()
  return (
    <Box>
      {noItems && (
        <AlertToast
          sx={{ marginLeft: '0 !important' }}
          alerts={[
            {
              type: 'error',
              targetLink: router.pathname,
              message: `<span>We can't find any items matching these search criteria. <a href='/catalogsearch/advanced?data=${encodeURIComponent(
                JSON.stringify(params.filters),
              )}'>Modify your search.</a></span>`,
            },
          ]}
          link={router?.pathname}
        />
      )}
      <Box
        sx={{
          padding: '1rem 0',
          '& p': {
            marginBottom: '0.5rem',
          }
        }}
      >
        {!noItems && (
          <Typography sx={{ fontWeight: '600', display: 'flex'}}>
            {totalCount} {`${totalCount && totalCount > 1 ? 'items' : 'item'}`}
            <Typography sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
              were found using the following search criteria
            </Typography>
          </Typography>
        )}
        {filters.map((el) => {
          if (el[0] === 'name') {
            return (
              <Typography
                key='name'
                sx={{ fontWeight: '600', display: 'flex'}}
              >
                Product Name:{' '}
                <Typography component='span' sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
                  {el?.[1]?.match?.replaceAll('+', ' ')}
                </Typography>
              </Typography>
            )
          }
          if (el[0] === 'sku') {
            return (
              <Typography key='sku' sx={{ fontWeight: '600', display: 'flex'}}>
                SKU:{' '}
                <Typography component='span' sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
                  {el?.[1]?.in?.map((el) => el.replaceAll('+', ' ')).join(',')}
                </Typography>
              </Typography>
            )
          }
          if (el[0] === 'description') {
            return (
              <Typography
                key='description'
                sx={{ fontWeight: '600', display: 'flex'}}
              >
                Description:{' '}
                <Typography component='span' sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
                  {el?.[1]?.match?.replaceAll('+', ' ')}
                </Typography>
              </Typography>
            )
          }
          if (el[0] === 'short_description') {
            return (
              <Typography
                key='short_description'
                sx={{ fontWeight: '600', display: 'flex'}}
              >
                Short Description:{' '}
                <Typography component='span' sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
                  {el?.[1]?.match?.replaceAll('+', ' ')}
                </Typography>
              </Typography>
            )
          }
          if (el[0] === 'price') {
            return (
              <Typography
                key='price'
                sx={{ fontWeight: '600', display: 'flex'}}
              >
                Price:{' '}
                <Typography component='span' sx={{ fontWeight: '200', paddingLeft: '0.5rem' }}>
                  {`${el?.[1]?.from?.replaceAll('+', ' ') || 'up to '}${
                    (el?.[1]?.from && el?.[1]?.to && '-') || ''
                  }${el?.[1]?.to?.replaceAll('+', ' ') || ' and greater'}`}
                </Typography>
              </Typography>
            )
          }
          return null
        })}
        {!noItems && (
          <AlertToast
            sx={{ marginLeft: '0 !important' }}
            alerts={[
              {
                type: 'warning',
                targetLink: router.pathname,
                message: `<span>Don't see what you're looking for? <a href='/catalogsearch/advanced?data=${encodeURIComponent(
                  JSON.stringify(params.filters),
                )}'>Modify your search.</a></span>`,
              },
            ]}
            link={router?.pathname}
          />
        )}
      </Box>
    </Box>
  )
}
