import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useRemoveFromCompareList } from '../../graphql/hooks'
import { RichContent } from '../../lib/magento-page-builder'
import { Closemenu } from '../Icons'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { CompareItemCard } from './CompareItemCard'

export const CompareListTable = (props) => {
  const { items, compareId } = props
  const [openDialog, setOpenDialog] = useState(false)
  const [delId, setDelId] = useState<string | null | undefined>()
  const [name, setName] = useState<string>('')
  const { removeCompareProduct } = useRemoveFromCompareList()

  const handleRemoveProduct = (type: string) => {
    async function closerFn() {
      await removeCompareProduct(type, name, compareId, [delId])
    }
    closerFn()
      .then(() => {})
      .catch(() => {})
  }

  const tableColumn =  {
      minWidth: '210px',
      border: '0',
      verticalAlign: 'top',
  }
 
  const tableHeadColumn =  {
    borderRight: '1px solid #cccccc',
  }

  const tableDataColumn =  {
    fontSize: '0.813rem',
    '& p, & ul > li, & div': {
      fontSize: '0.813rem !important',
      lineHeight: '1.125rem !important',
    },
    '& ul > li:not(:last-child)': {
      marginBottom: '0.625rem'
    },
    '& p': {
      marginTop: '0',
    },
    '& strong': {
      fontWeight: 700,
      fontVariationSettings: "'wght' 700",
    }
  }

  const shortDescArr = items.map((el) => el.product.short_description.html)

  return (
    <Box
      sx={{
        borderTop: {xs:'1px solid #cccccc', md: '0'}
      }}
    >
      <TableContainer>
        <Table>
          <TableBody>
            <TableCell
              sx={{
                ...tableColumn,
                ...tableHeadColumn,
                borderBottom: '1px solid #cccccc',
                paddingTop: '0',
              }}
            >
              <Box />
            </TableCell>
            {items.map((item) => (
              <TableCell key={item.product.id} 
                sx={{
                  ...tableColumn, 
                  borderBottom: '1px solid #cccccc',
                  paddingTop: '0',
                }}>
                <IconButton
                  size='small'
                  sx={{
                    display: 'flex',
                    marginLeft: 'auto',
                    alignSelf: 'baseline',
                    '& > svg': {
                      fontSize: '15px',
                    },
                  }}
                  onClick={() => {
                    setDelId(String(item?.product?.id))
                    setName(String(item?.product?.name))
                    setOpenDialog(true)
                  }}
                >
                  <Closemenu />
                </IconButton>
                <CompareItemCard item={item.product} />
              </TableCell>
            ))}
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  ...tableColumn,
                  ...tableHeadColumn,
                }}
              >
                <Typography 
                  variant='body1' 
                  sx={{ 
                    fontWeight: '700',
                    fontVariationSettings: "'wght' 700",
                  }}
                >
                  SKU
                </Typography>
              </TableCell>
              {items.map((item) => (
                <TableCell key={item.product.id} sx={{...tableColumn, ...tableDataColumn }}>
                  <Typography>{item?.product?.sku}</Typography>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  ...tableColumn,
                  ...tableHeadColumn,
                }}
              >
                <Typography 
                  variant='body1' 
                  sx={{ 
                    fontWeight: '700',
                    fontVariationSettings: "'wght' 700",
                  }}
                >Description</Typography>
              </TableCell>
              {items.map((item) => (
                <TableCell sx={{...tableColumn, ...tableDataColumn }}>
                  <RichContent html={item?.product?.description?.html} />
                </TableCell>
              ))}
            </TableRow>
            {shortDescArr.some((el) => el !== '') && (
              <TableRow>
                <TableCell
                  sx={{
                    ...tableColumn,
                    ...tableHeadColumn,
                  }}
                >
                  <Typography
                    variant='body1' 
                    sx={{ 
                      fontWeight: '700',
                      fontVariationSettings: "'wght' 700",
                    }}
                  >Short Description</Typography>
                </TableCell>
                {shortDescArr.map((item) => (
                  <TableCell key={item} sx={{...tableColumn, ...tableDataColumn }}>
                    <RichContent html={item || 'N/A'} />
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        openDialog={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setDelId(undefined)
        }}
        title='Are you sure you want to remove this item from your Compare Products list?'
        handleSubmit={() => {
          setOpenDialog(false)
          handleRemoveProduct('single')
        }}
      />
    </Box>
  )
}
