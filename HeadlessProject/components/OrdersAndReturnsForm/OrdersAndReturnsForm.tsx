import { LayoutTitle } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  Box,
  InputLabel,
  TextField,
  Button,
  makeStyles,
  Theme,
  Divider,
  Typography,
  Select,
  MenuItem,
} from '@mui/material'
import { emailRegex, priceNumRegex, skuRegex } from 'config/constants'
import { Dispatch, SetStateAction } from 'react'

type searchFormProps = {
  formDataState: [
    formData: {
      orderId: string
      lastName: string
      findBy: string
      emailZip: string
    },
    setFormData: Dispatch<
      SetStateAction<{
        orderId: string
        lastName: string
        findBy: string
        emailZip: string
      }>
    >,
  ]
  handleSubmit: () => void
  loading: Boolean
}

export const OrdersAndReturnForm = (props: searchFormProps) => {
  const { formDataState, handleSubmit, loading } = props
  const [formData, setFormData] = formDataState
  // const labelStyle = {
  //   color: '#000',
  //   marginBottom: '0.5rem',
  //   fontWeight: '600',
  // }
  // const textFieldStyle = {
  //   borderRadius: '0',
  //   width: '600px',
  //   height: '35px',
  // }
  // const fieldBoxStyle = {
  //   margin: '1rem 0 1rem 0',
  //   maxWidth: '600px',
  // }

  const isEmailValid = formData.emailZip ? emailRegex.test(formData.emailZip) : true

  return (
    <Box
      sx={{
        paddingBottom: '2.5rem',
      }}
    >
      <Typography
        variant='h4'
        sx={{
          color: '#333',
          fontSize: { xs: '1rem', md: '1.375rem' },
          fontWeight: '300',
          fontVariationSettings: `'wght' 300`,
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #c6c6c6',
          marginBottom: { xs: '0.875rem', md: '1.5rem' },
        }}
      >
        <Trans id='Order Information' />
      </Typography>
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required htmlFor='orderId'>
          Order ID
        </InputLabel>
        <TextField
          required
          value={formData.orderId}
          onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          name='orderId'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required htmlFor='lastName'>
          Billing Last Name
        </InputLabel>
        <TextField
          required
          value={formData.lastName}
          onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          name='lastName'
          variant='outlined'
          type='text'
        />
      </Box>
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required htmlFor='orderBy'>
          Find Order By
        </InputLabel>
        <Select
          labelId='find-order-by'
          id='findBy'
          sx={{ width: '600px', height: '35px' }}
          value={formData.findBy}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, findBy: e.target.value }))
          }}
        >
          <MenuItem value={'Email'}>Email</MenuItem>
          <MenuItem value={'ZIP Code'}>ZIP Code</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required htmlFor='emailZip'>
          {formData.findBy === 'Email' ? 'Email' : 'Billing ZIP Code'}
        </InputLabel>
        <TextField
          required
          error={formData.findBy === 'Email' && !isEmailValid}
          helperText={
            formData.findBy === 'Email' &&
            !isEmailValid &&
            'Please enter a valid email address (Ex: johndoe@domain.com).'
          }
          value={formData.emailZip}
          onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          name='emailZip'
          variant='outlined'
          type='email'
        />
      </Box>
      <Button
        onClick={handleSubmit}
        sx={{
          color: '#ffffff',
          backgroundColor: '#1979c3',
          '&:hover, &:active': { backgroundColor: '#006bb4' },
          '&:disabled': { color: 'white', opacity: '0.5' },
          // '&:disabled': {
          //   color: '#ffffff',
          //   backgroundColor: '#1979c3',
          //   '&:hover, &:active': { backgroundColor: '#006bb4' },
          // },
        }}
        disabled={
          !formData.emailZip ||
          !formData.lastName ||
          !formData.orderId ||
          (formData.findBy === 'Email' && !isEmailValid) ||
          !!loading
        }
        disableRipple
        type='submit'
        color='primary'
        variant='contained'
        size='small'
      >
        <Trans id='Continue' />
      </Button>
    </Box>
  )
}
