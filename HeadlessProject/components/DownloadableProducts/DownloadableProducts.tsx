/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

import { AccountOrdersFragment } from '@graphcommerce/magento-customer/components/AccountOrders/AccountOrders.gql'
import { Trans } from '@lingui/react'
import {
  SxProps,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Link,
} from '@mui/material'
import DownloadButton from './DownloadButton'
import { dateFormatSlash } from '@components/common/utils'
import { useState } from 'react'

export type DownloadableProductsProps = AccountOrdersFragment & {
  sx?: SxProps<Theme>
}

export function DownloadableProducts(props: any) {
  const { productList } = props
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(event.target.value as number)
  }
  const startIndex = 0
  const endIndex = Math.min(startIndex + rowsPerPage - 1, productList.length - 1)
  const paginatedProducts = productList.slice(startIndex, endIndex + 1)
  const productListLength = productList.length
  return (
    <div>
      {productList && productList.length && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans id='Order #' />
                </TableCell>
                <TableCell>
                  <Trans id=' Date' />
                </TableCell>
                <TableCell colSpan={2}>
                  <Trans id='Title' />
                </TableCell>
                <TableCell>
                  <Trans id='Status' />
                </TableCell>
                <TableCell>
                  <Trans id='Remaining Downloads' />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.order}>
                  <TableCell>
                    <Link
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      href={`/account/my-orders/view?orderId=${product.order}`}
                    >
                      <Trans id={product.order} />
                    </Link>
                  </TableCell>
                  <TableCell>{dateFormatSlash(product.date)}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell sx={{ display: 'flex', flexDirection: 'row' }}>
                    {product.link && (
                      <>
                        <DownloadButton link={product.link} linkName={product.linkName} />
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </TableCell>
                  <TableCell>{product.remainingDownloads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
            {productList && productList.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Trans id={`${productListLength} Item(s)`} />
                </Box>
                <Box>
                  Show{' '}
                  <Select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>{' '}
                  per page
                </Box>
              </Box>
            )}
          </Box>
        </TableContainer>
      )}
    </div>
  )
}
