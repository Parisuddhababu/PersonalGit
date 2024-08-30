import { useQuery } from '@graphcommerce/graphql'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { Trans } from '@lingui/react'
import { Box, IconButton, Link, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { compareListDocument } from '../../graphql/compare-product/CompareList.gql'
import { useRemoveFromCompareList } from '../../graphql/hooks'
import { Closemenu } from '../Icons'
import { ConfirmDialog } from '../common/ConfirmDialog'

export const MiniCompareProducts = () => {
  const router = useRouter()
  const customer = useCustomerQuery(CustomerDocument)
  let compareId = ''
  if (typeof window !== 'undefined') {
    compareId =
      customer?.data?.customer?.compare_list?.uid || localStorage.getItem('CompareListId') || ''
  }
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<number>(0)
  const [delId, setDelId] = useState<string | null | undefined>()
  const [name, setName] = useState<string>('')
  const { data } = useQuery(compareListDocument, { variables: { uid: compareId } })
  const { removeCompareProduct } = useRemoveFromCompareList()

  const items = data?.compareList?.items

  const handleRemoveProduct = (type) => {
    const idArr: string[] = []
    items?.map((item) => idArr.push(String(item?.product?.id)))
    const arr = type === 'all' ? [...idArr] : [String(delId)]
    async function closerFn() {
      await removeCompareProduct(type, name, compareId, arr)
    }
    closerFn()
      .then(() => {})
      .catch(() => {})
  }

  return (
    <Box 
      sx={{ 
        marginTop: {xs:'0', md:'2.5rem'},
        marginBottom: {xs:'1.5rem', md:'3rem'},
      }}
    >
      <Box
        sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: '1rem' 
        }}
      >
        <Typography
          sx={{
            fontSize: '1.125rem !important',
            fontWeight: '300 !important',
            marginRight: '0.25rem',
          }}
        >
          Compare Products
        </Typography>
        <Typography
          component='span'
          sx={{
            fontSize: '0.75rem !important',
            marginTop: '0.25rem'
          }}
        >
          {items && items?.length > 0 && (
            <Trans id={`(${items?.length} item${items?.length > 1 ? 's' : ''})`} />
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '0.75rem',
        }}
      >
        {items && items?.length > 0 ? (
          items?.map((item) => (
            <Box key={item?.uid}>
              <IconButton
                onClick={() => {
                  setDialogTitle(0)
                  setDelId(String(item?.product?.id))
                  setName(String(item?.product?.name))
                  setOpenDialog(true)
                }}
                size='small'
                sx={{
                  alignSelf: 'baseline',
                  padding: '0.313rem',
                  marginLeft: '-0.25rem',
                  marginRight: '0.188rem',
                  '& > svg': {
                    fontSize: '1rem',
                  },
                }}
              >
                <Closemenu fontSize="inherit" />
              </IconButton>
              <Link
                sx={{
                  color: '#000000',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
                href={`/p/${item?.product?.url_key}`}
                dangerouslySetInnerHTML={{ __html: item?.product?.name ?? '' }}
              />
            </Box>
          ))
        ) : (
          <Box>
            <Trans id='You have no items to compare.' />
          </Box>
        )}
      </Box>
      {items && items?.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: {xs:'column', md:'row'} 
        }}>
          <Button
            variant='contained'
            size='medium'
            onClick={() =>
              router
                .push('/compare')
                .then(() => {})
                .catch(() => {})
            }
            sx={{
              marginRight: {xs:'0', md: '1rem'},
              marginBottom: {xs:'0.75rem', md: '0'},
            }}
          >
            Compare
          </Button>
          <Link
            component="button"
            // variant="body2"
            underline="hover"
            onClick={() => {
              setDialogTitle(1)
              setOpenDialog(true)
            }}
          >
            Clear All
          </Link>
        </Box>
      )}
      <ConfirmDialog
        openDialog={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setDelId(undefined)
        }}
        title={
          dialogTitle === 0
            ? 'Are you sure you want to remove this item from your Compare Products list?'
            : 'Are you sure you want to remove all items from your Compare Products list?'
        }
        handleSubmit={() => {
          setOpenDialog(false)
          handleRemoveProduct(dialogTitle === 0 ? 'single' : 'all')
        }}
      />
    </Box>
  )
}
