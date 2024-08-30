import { QuantityInput } from '@components/QuantityInput'
import { UpdateCartButton } from '@components/UpdateCartButton'
import { AddProductsToCartButton, AddProductsToCartQuantity } from '@graphcommerce/magento-product'
import { Trans } from '@lingui/react'

import { Box, Button, Divider, Grid, TextField, Typography, Link, InputLabel } from '@mui/material'

import { useEffect, useState } from 'react'

const BundleProductCategoryOption = ({
  product,
  setBundleProducts,
  setOpenBundleOptions,
  cartDetails,
}) => {
  const [selectedOptions, setSelectedOptions] = useState({})
  const [selectedQuantities, setSelectedQuantities] = useState({})
  const [selectedIds, setSelectedIds] = useState<String[]>([])
  const [payload, setPayload] = useState<
    Array<{ uid: string | undefined; value: string | undefined }>
  >([])
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {
    const enteredOptions = product?.items?.map((item) => {
      const optionUid = selectedOptions[item.uid]
      const quantity = selectedQuantities[item.uid] || 1
      return {
        uid: optionUid as string,
        value: quantity.toString() as string,
      }
    })
    setPayload(enteredOptions || [])
  }, [selectedOptions, selectedQuantities, product?.items])

  useEffect(() => {
    const defaultSelectedOptions = {}
    const defaultSelectedQuantities = {}
    const selectedIds: string[] = []
    product?.items?.forEach((item, index) => {
      if (item.options.length > 0) {
        const defaultOption = item.options.filter((option) => {
          if (cartDetails) {
            return option?.product?.sku === cartDetails?.editData?.[index]?.sku
          }
          return option.is_default
        })?.[0]
        selectedIds.push(defaultOption?.id)
        const defaultOptionUid = defaultOption ? defaultOption.uid : item.options[0].uid
        defaultSelectedOptions[item.uid] = defaultOptionUid
        defaultSelectedQuantities[item.uid] = Number(cartDetails?.editData?.[index]?.qty) ?? 1 // Set initial quantity to 1
      }
    })
    setSelectedIds(selectedIds)
    setSelectedOptions(defaultSelectedOptions)
    setSelectedQuantities(defaultSelectedQuantities)
  }, [product])

  useEffect(() => {
    let totalPrice = 0
    const selectedIds: string[] = []
    product?.items?.forEach((item) => {
      const selectedOption = item.options.find((option) => option.uid === selectedOptions[item.uid])
      selectedIds.push(selectedOption?.id ?? '')
      const selectedQuantity = selectedQuantities[item.uid] || 1
      if (selectedOption) {
        totalPrice += parseFloat(selectedOption.price) * selectedQuantity
      }
    })
    setSelectedIds(selectedIds)
    setTotalPrice(totalPrice)
  }, [selectedOptions, selectedQuantities, product?.items])

  const handleOptionChange = (itemUid, optionUid) => {
    const selectedItem = product?.items.find((item) => item.uid === itemUid)
    const canChangeQuantity = selectedItem?.options.find(
      (option) => option.uid === optionUid,
    )?.can_change_quantity

    if (canChangeQuantity) {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [itemUid]: optionUid,
      }))
      // Enable quantity input if can_change_quantity is true
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemUid]: selectedQuantities[itemUid] || 1,
      }))
    } else {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [itemUid]: optionUid,
      }))
      // Disable quantity input if can_change_quantity is false
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemUid]: undefined,
      }))
    }
  }

  const handleQuantityChange = (itemUid, quantity) => {
    const selectedItem = product?.items.find((item) => item.uid === itemUid)
    const canChangeQuantity = selectedItem?.options.find(
      (option) => option.uid === selectedOptions[itemUid],
    )?.can_change_quantity

    if (canChangeQuantity) {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemUid]: quantity,
      }))
    }
  }
  setBundleProducts(payload)

  return (
    <Grid
      container
      spacing={{ xs: 3, md: 2 }}
      sx={{
        paddingBottom: { xs: '1.5rem', md: '3rem' },
      }}
    >
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            maxWidth: { md: '25.125rem' },
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontWeight: 300,
              fontVariationSettings: "'wght' 300",
              marginBottom: '0.875rem',
            }}
          >
            Customize Sprite Yoga Companion Kit
          </Typography>

          <Link
            underline='hover'
            color='secondary'
            onClick={() => setOpenBundleOptions(false)}
            sx={{ cursor: 'pointer', display: 'inline-block', marginBottom: '1.65rem' }}
          >
            <Trans id='Go back to product details page' />
          </Link>

          {product?.items?.map((item, index) => (
            <Box
              key={item.uid}
              sx={{
                borderBottom: '1px solid #cccccc',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem',
                '&:last-child': {
                  borderBottom: '0',
                  paddingBottom: '0',
                  marginBottom: '0',
                },
              }}
            >
              <Box>
                <Typography variant='h4' sx={{ marginBottom: '0.5rem' }}>
                  {item.title}
                </Typography>

                {item.options.map((option) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginBottom: '0.125rem',
                    }}
                    key={option.uid}
                  >
                    <input
                      type='radio'
                      name={`option_${item.uid}`}
                      checked={selectedOptions[item.uid] === option.uid}
                      onChange={() => handleOptionChange(item.uid, option.uid)}
                    />
                    <Typography variant='body1'>{option.label}</Typography>{' '}
                    <span style={{ fontSize: '1.3rem' }}>+</span>{' '}
                    <Typography variant='body1'>${parseFloat(option.price)}</Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    marginTop: '0.75rem',
                    marginBottom: '0rem',
                  }}
                >
                  <InputLabel htmlFor='Quantity'>
                    <Trans id='Quantity' />
                  </InputLabel>
                  <TextField
                    type='number'
                    defaultValue={isNaN(selectedQuantities[item.uid]) ? 1 : Number(selectedQuantities[item.uid])}
                    inputProps={{ min: 1 }}
                    // value={selectedQuantities[item.uid] || 1}
                    onChange={(e) => handleQuantityChange(item.uid, parseInt(e.target.value, 10))}
                    sx={{
                      width: '3.25rem',
                      '& .MuiOutlinedInput-input': {
                        textAlign: 'center',
                        padding: '0.372rem 0.5rem',
                      },
                    }}
                  />
                </Box>
              </Box>
              {/* <Divider sx={{ mb: 2, mt: 3 }} /> */}
            </Box>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box
          sx={{
            maxWidth: { md: '28.5rem' },
            paddingTop: { md: '3.125rem' },
            marginLeft: { md: 'auto' },
          }}
        >
          <Typography variant='h4'> Your Customization</Typography>

          <Divider sx={{ marginTop: '1rem', marginBottom: '1.5rem' }} />

          <Box
            sx={{
              marginTop: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <InputLabel htmlFor='Qty'>
              <Trans id='Qty' />
            </InputLabel>
            <QuantityInput cartDetails={cartDetails} sx={{ flexShrink: '0' }} />
          </Box>

          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'start',
              columnGap: theme.spacings.xs,
              marginBottom: '1.875rem',
            })}
          >
            {cartDetails ? (
              <UpdateCartButton
                fullWidth
                product={product}
                editDetails={cartDetails}
                quantities={selectedQuantities}
                ids={selectedIds}
                sx={{
                  backgroundColor: '#1979c3',
                  color: '#ffffff',
                  borderRadius: '0',
                  fontWeight: '500',
                  ':hover': { backgroundColor: '#006bb4' },
                }}
              />
            ) : (
              <AddProductsToCartButton
                product={product}
                variant='contained'
                size='large'
                color='secondary'
              />
            )}
          </Box>

          <Typography
            variant='h3'
            sx={{
              color: '#575757',
              fontSize: '2.25rem !important',
              fontWeight: '600',
              fontVariationSettings: "'wght' 600",
              marginBottom: '0.65rem',
            }}
          >
            ${totalPrice.toFixed(2)}
          </Typography>

          <Box>
            <Typography variant='h4'> Summary</Typography>
            <Divider
              sx={{
                marginTop: '0.75rem',
                marginBottom: '1.5rem',
              }}
            />
            <Box>
              {product?.items?.map((item) => {
                const selectedOption = item.options.find(
                  (option) => option.uid === selectedOptions[item.uid],
                )
                const selectedQuantity = selectedQuantities[item.uid] || 1

                return (
                  <Box key={item.uid} sx={{ marginBottom: '1.25rem' }}>
                    <Typography
                      variant='body1'
                      sx={{
                        fontWeight: '700',
                        fontVariationSettings: "'wght' 700",
                      }}
                    >
                      {item.title}
                    </Typography>
                    {selectedQuantity} x {selectedOption?.label}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
export default BundleProductCategoryOption
