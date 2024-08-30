/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/rules-of-hooks */
import { NoOrdersFound } from '@graphcommerce/magento-customer'
import { AccountOrdersFragment } from '@graphcommerce/magento-customer/components/AccountOrders/AccountOrders.gql'

import { Money } from '@graphcommerce/magento-store'
import { Pagination, SectionContainer, extendableComponent } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  Box,
  Link,
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
  InputLabel,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { dateFormatSlash } from '../common/utils/date-time-format'
import { ReOrderBtn } from './ReOrderBtn'
import { ViewOrder } from './ViewOrder'

export type AccountOrdersProps = AccountOrdersFragment & {
  setPageSize: (number) => void
  pagesize: number
  sx?: SxProps<Theme>
}

const parts = ['root', 'older'] as const
const { classes } = extendableComponent('AccountOrders', parts)

export function AccountOrdersList(props: AccountOrdersProps) {
  const { orders, setPageSize, pagesize, sx = [] } = props
  const router = useRouter()

  const pageInfo = orders?.page_info
  const displayedOrders =
    router?.pathname === '/account' ? orders?.items?.slice(0, 5) : orders?.items?.slice()
  const startIndex = (pageInfo!.current_page! - 1) * pagesize + 1
  const endIndex = Math.min(startIndex + pagesize - 1, orders!.total_count!)

  return (
    <Box
      className={classes.root}
      // sx={[
      //   (theme) => ({
      //     typography: 'body2',
      //     marginBottom: theme.spacings.md,
      //     '.Pagination-root': { margin: '0px' },
      //     ...(router?.pathname === '/account' && {
      //       '.SectionHeader-root': { margin: '0px 0px', border: 'none' },
      //       th: { fontWeight: '700' },
      //     }),
      //   }),
      //   ...(Array.isArray(sx) ? sx : [sx]),
      // ]}
    >
      {displayedOrders && displayedOrders.length ? (
        <TableContainer>
          {/* <SectionContainer labelLeft=''> */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans id='Order #' />
                </TableCell>
                <TableCell>
                  <Trans id='Order Date' />
                </TableCell>
                <TableCell>
                  <Trans id='Order total' />
                </TableCell>
                <TableCell>
                  <Trans id='Status' />
                </TableCell>
                <TableCell>
                  <Box>
                    <Trans id='Action' />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedOrders?.map(
                (order) =>
                  order && (
                    <TableRow key={order.number}>
                      <TableCell data-th='Order #'>#{order.number}</TableCell>
                      <TableCell data-th='Date'>{dateFormatSlash(order.order_date)}</TableCell>
                      <TableCell data-th='Order Total'>
                        <Money {...order.total?.grand_total} />
                      </TableCell>
                      <TableCell data-th='Status'>
                        <Typography>{order?.status}</Typography>
                      </TableCell>
                      <TableCell data-th='Actions' className='actions' colSpan={2}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ViewOrder {...order} />
                          <Box
                            sx={{
                              display: 'inline-block',
                              width: '0.063rem',
                              height: '0.75rem',
                              backgroundColor: '#a6a6a6',
                              margin: '0 0.938rem',
                            }}
                          />
                          <ReOrderBtn number={order.number} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
          {/* </SectionContainer> */}
        </TableContainer>
      ) : (
        orders?.items && !orders?.items?.length && <NoOrdersFound />
      )}
      <Box
        sx={{
          ...(router?.pathname === '/account' ? { display: 'none' } : { display: 'flex' }),
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          marginTop: '1rem',
          gap: '0.65rem',
          alignItems: { xs: 'flex-start', md: 'center' },
          '& .Pagination-root ': {
            marginTop: '0 !important',
            marginBottom: '0 !important',
          },
        }}
      >
        <Box>
          {startIndex}-{endIndex} <Trans id='out of' /> {orders?.total_count} <Trans id='Orders' />
        </Box>
        <Pagination
          count={pageInfo?.total_pages ?? 1}
          page={pageInfo?.current_page ?? 1}
          renderLink={(p: number, icon: React.ReactNode) => (
            <Link
              href={p === 1 ? '/account/my-orders' : `/account/my-orders?page=${p}`}
              color='secondary'
              underline='hover'
            >
              {icon}
            </Link>
          )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <InputLabel
            id='items-to-show-label'
            sx={{
              marginBottom: '0',
              fontWeight: 400,
              fontVariationSettings: "'wght' 400",
            }}
          >
            <Trans id='Items to show' />
          </InputLabel>
          <Select
            labelId='items-to-show-label'
            id='items-to-show'
            value={pagesize}
            onChange={async (e) => {
              setPageSize(Number(e.target.value))
              await router.push('/account/my-orders')
            }}
            sx={{
              ml: 1,
              //   padding: '0',
              //   backgroundColor: '#f0f0f0',
              //   boxShadow: 'inset 0 1px 0 0 #fff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
              //   borderRadius: '3px',
              //   '& .MuiSelect-select': {
              //     padding: '4px 25px 5px 10px',
              //   }
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  )
}
