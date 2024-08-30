import { phoneNumberRegex } from '@components/common/utils/formRegex'
import { TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { InputLabel, TextField, Box } from '@mui/material'

export function ContactForm(props) {
  const { form } = props

  const { formState, required, muiRegister } = form
  const labelStyle = {
    color: '#000',
    marginBottom: '0.5rem',
    fontWeight: '600',
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='First Name'>
          <Trans id='First Name' />
        </InputLabel>
        <TextFieldElement
          control={form.control}
          name='firstname'
          required={required.firstname}
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
        <InputLabel required sx={{ ...labelStyle }} htmlFor='Last Name'>
          <Trans id='Last Name' />
        </InputLabel>
        <TextFieldElement
          control={form.control}
          name='lastname'
          required={required.lastname}
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
        <InputLabel sx={{ ...labelStyle }} htmlFor='Company'>
          <Trans id='Company' />
        </InputLabel>
        <TextField
          variant='outlined'
          type='text'
          required={required.company}
          {...muiRegister('company', {
            required: required.company,
          })}
          disabled={formState.isSubmitting}
        />
      </Box>

      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='Phone Number'>
          <Trans id='Phone Number' />
        </InputLabel>
        <TextField
          variant='outlined'
          type='text'
          error={!!formState.errors.telephone}
          required={required.telephone}
          {...muiRegister('telephone', {
            required: required.telephone,
            pattern: {
              value: phoneNumberRegex,
              message: i18n._(/* i18n */ 'Invalid phone number'),
            },
          })}
          helperText={formState.isSubmitted && formState.errors.telephone?.message}
          disabled={formState.isSubmitting}
        />
      </Box>
    </Box>
  )
}
