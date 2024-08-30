import { Money } from '@graphcommerce/magento-store'
import { TextInputNumber } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from '@mui/material'
import React, { useState } from 'react'

const GroupProductContainer = styled('span')(({ theme }) => theme.unstable_sx({}))

function GroupProductOptions(props: any) {
  const { setGroupProducts } = props
  const groupOptions = props?.product?.items

  const [productItems, setProductItems] = useState(
    groupOptions
      .filter((products) => products?.product.stock_status === 'IN_STOCK')
      .map((item) => ({
        ...item,
        quantity: item.qty,
      })),
  )

  const handleQuantityChange = (event, id) => {
    const value = parseInt(event.target.value, 10)

    if (value <= 0) {
      const updatedItems = productItems.map((item) => {
        if (item.product.id === id) {
          return { ...item, quantity: 0 }
        }
        return item
      })

      setProductItems(updatedItems)
      setGroupProducts(updatedItems)
    } else {
      const updatedItems = productItems.map((item) => {
        if (item.product.id === id) {
          const quantity = Number.isNaN(value) ? undefined : value
          return { ...item, quantity }
        }
        return item
      })

      let existingItem = updatedItems.find((item) => item.product.id === id)
      if (!existingItem) {
        existingItem = groupOptions.find((item) => item.product.id === id)
        updatedItems.push(existingItem)
      }

      setProductItems(updatedItems)
      setGroupProducts(updatedItems)
    }
  }

  return (
    <GroupProductContainer>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: '700', fontVariationSettings: "'wght' 700" }}
                >
                  ProductName
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: '700', fontVariationSettings: "'wght' 700" }}
                >
                  Qty
                </Typography>
              </TableCell>
            </TableRow>
            {groupOptions.map((products) => (
              <>
                <TableRow key={products.product.id}>
                  <TableCell>
                    <Typography variant='body1' sx={{ marginBottom: '0.5rem' }}>
                      {products.product.name}
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{ fontWeight: '700', fontVariationSettings: "'wght' 700" }}
                    >
                      <Trans
                        id=' <0/>'
                        components={{
                          0: <Money {...products.product.price_range.minimum_price.final_price} />,
                        }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {products.product.stock_status === 'IN_STOCK' ? (
                      <TextInputNumber
                        size='small'
                        variant='outlined'
                        inputProps={{ min: 0 }}
                        defaultValue={
                          productItems.find((item) => item.product.id === products.product.id)
                            ?.quantity || products.qty
                        }
                        onChange={(event) => handleQuantityChange(event, products.product.id)}
                        onKeyDown={(event) => {
                          if (event.key === '-') {
                            event.preventDefault()
                          }
                        }}
                      />
                    ) : (
                      <Typography variant='body1' color='error'>
                        Out of stock
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GroupProductContainer>
  )
}

export default GroupProductOptions
