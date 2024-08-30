import { Trans } from '@lingui/react'
import { Box, InputLabel, TextField, Button, makeStyles, Theme, Typography } from '@mui/material'
import { priceNumRegex, skuRegex } from 'config/constants'
import { Dispatch, SetStateAction } from 'react'

type searchFormProps = {
  formDataState: [
    formData: {
      name: string
      sku: string
      description: string
      short_description: string
      pricefrom: string
      priceto: string
    },
    setFormData: Dispatch<
      SetStateAction<{
        name: string
        sku: string
        description: string
        short_description: string
        pricefrom: string
        priceto: string
      }>
    >,
  ]
  handleSearch: () => {}
}

export const AdvanceSearchForm = (props: searchFormProps) => {
  const { formDataState, handleSearch } = props
  const [formData, setFormData] = formDataState
  const fieldBoxStyle = {
    margin: '1rem 0 1rem 0',
  }

  const isBothPriceValid =
    formData.pricefrom && formData.priceto
      ? Number(formData.pricefrom) <= Number(formData.priceto)
      : true
  const isPriceFromValid = formData.pricefrom
    ? priceNumRegex.test(formData.pricefrom) && isBothPriceValid
    : true
  const isPriceToValid = formData.priceto
    ? priceNumRegex.test(formData.priceto) && isBothPriceValid
    : true
  const isSkuValid = formData.sku ? skuRegex.test(formData.sku) : true

  return (
    <Box
      sx={{
        maxWidth: {md:'37.5rem'},
        paddingBottom: {xs: '1.5rem', md:'2.5rem' },
      }}
    >
      <Box 
        sx={{ 
          ...fieldBoxStyle,
          marginTop: '0'
        }}>
        <InputLabel htmlFor='name'>
          Product Name
        </InputLabel>
        <TextField
          InputProps={{ sx: {  } }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          name='name'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box sx={{ ...fieldBoxStyle }}>
        <InputLabel htmlFor='sku'>
          SKU
        </InputLabel>
        <TextField
          value={formData.sku}
          error={formData.sku ? !isSkuValid : false}
          helperText={formData.sku && !isSkuValid && 'Please enter less or equal than 64 symbols'}
          InputProps={{ sx: { } }}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          name='sku'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box sx={{ ...fieldBoxStyle }}>
        <InputLabel htmlFor='description'>
          Description
        </InputLabel>
        <TextField
          value={formData.description}
          InputProps={{ sx: {  } }}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          name='description'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box sx={{ ...fieldBoxStyle }}>
        <InputLabel htmlFor='short_description'>
          Short Description
        </InputLabel>
        <TextField
          value={formData.short_description}
          InputProps={{ sx: {  } }}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          name='short_description'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box sx={{ ...fieldBoxStyle }}>
        <InputLabel htmlFor='pricefrom'>
          Price
        </InputLabel>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',

          }}
        >
          <TextField
            value={formData.pricefrom}
            error={formData.pricefrom ? !isPriceFromValid : false}
            helperText={formData.pricefrom && !isPriceFromValid && 'Please enter a valid number'}
            InputProps={{
              sx: { width: '260px', },
            }}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            name='pricefrom'
            variant='outlined'
            type='text'
          />

          <Typography
            component='span'
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.407rem 0.65rem'
            }}
          >
            <Trans id='-' />
          </Typography>

          <TextField
            value={formData.priceto}
            error={formData.priceto ? !isPriceToValid : false}
            helperText={formData.priceto && !isPriceToValid && 'Please enter a valid number'}
            InputProps={{
              sx: { width: '260px',},
            }}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            name='priceto'
            variant='outlined'
            type='text'
          />
          <Typography
            component='span'
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.407rem 0.563rem'
            }}
          >
            <Trans id='USD' />
          </Typography>
        </Box>
      </Box>
      <Button
        onClick={handleSearch}
        sx={{
          color: '#ffffff',
          backgroundColor: '#1979c3',
          width: {xs: '100%', md: 'auto' },
          '&:hover, &:active': { backgroundColor: '#006bb4' },
          '&:disabled': {
            color: '#ffffff',
            backgroundColor: '#1979c3',
            '&:hover, &:active': { backgroundColor: '#006bb4' },
          },
        }}
        disabled={!isPriceFromValid || !isPriceToValid || !isSkuValid}
        disableRipple
        type='submit'
        color='primary'
        variant='contained'
        size='small'
      >
        <Trans id='Search' />
      </Button>
    </Box>
  )
}
