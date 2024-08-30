import { Box, Button, Stack } from '@mui/material'

export const SizeColorOptions = (props) => {
  const { sizes, colors, selected, unavailable } = props
  const [selectedOptions, setSelectedOptions] = selected
  return (
    <>
      {sizes && (
        <Box 
          sx={{
            marginBottom: '0.5rem'
          }}
        >
          {sizes.map((option) => (
            <Button
              key={option?.uid}
              disableRipple
              onClick={(e) => {
                e.preventDefault()
                if (selectedOptions.selectedSize === option?.uid) {
                  setSelectedOptions((prev) => ({ ...prev, selectedSize: null }))
                  return
                }
                setSelectedOptions((prev) => ({
                  ...prev,
                  selectedSize: option?.uid ?? '',
                }))
              }}
              disabled={unavailable.unavailableSizes?.includes(option?.uid)}
              sx={{
                zIndex: '20',
                borderRadius: '0px',
                marginRight: '7px',
                height: '30px',
                minWidth: '40px',
                marginBottom: '7px',
                padding: '0 0 ',
                backgroundColor: '#f0f0f0',
                fontSize: '0.75rem !important',
                fontWeight: '700',
                fontVariationSettings: `'wght' 700`,
                color: '#949494',
                ...(selectedOptions?.selectedSize === option?.uid && {
                  backgroundColor: '#ffffff',
                  border: '1px solid #fff',
                  outline: '1px solid #999',
                  color: '#333',
                }),
                ...(!unavailable.unavailableSizes?.includes(option?.uid) && {
                  '&:hover': {
                    border: '1px solid #fff',
                    outline: '1px solid #999',
                    color: '#333',
                    backgroundColor: `${option?.swatch_data?.value}`,
                  },
                }),
              }}
            >
              {option?.swatch_data?.value}
            </Button>
          ))}
        </Box>
      )}
      {colors && (
        <Stack 
          spacing={1.15} 
          direction="row"
          flexWrap="wrap"
          >
          {colors.map((option) => (
            <Button
              key={option?.uid}
              onClick={(e) => {
                e.preventDefault()
                if (selectedOptions.selectedColor === option?.uid) {
                  setSelectedOptions((prev) => ({ ...prev, selectedColor: null }))
                  return
                }
                setSelectedOptions((prev) => ({
                  ...prev,
                  selectedColor: option?.uid ?? '',
                }))
              }}
              disabled={unavailable.unavailableColors?.includes(option?.uid)}
              sx={{
                zIndex: '20',
                borderRadius: '0px',
                // marginRight: '0.625rem',
                marginRight: '0',
                height: '24px',
                minWidth: '36px',
                // marginBottom: '0.313rem',
                marginBottom: '0',
                padding: '0 0',
                backgroundColor: `${option?.swatch_data?.value}`,
                color: '#949494',
                ...(selectedOptions?.selectedColor === option?.uid && {
                  border: '1px solid #fff',
                  outline: '2px solid #ff5501',
                }),
                ...(!unavailable.unavailableColors?.includes(option?.uid) && {
                  '&:hover': {
                    border: '1px solid #fff',
                    outline: '2px solid #ff5501',
                    backgroundColor: `${option?.swatch_data?.value}`,
                  },
                }),
                '&:disabled': {
                  '&:after': {
                    content: `""`,
                    bottom: '0',
                    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00ffffff, endColorstr=#00ffffff, GradientType=1)',
                    left: '0',
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    background:'linear-gradient(to left top, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 42%, #fff 43%, #fff 46%, #ff5216 47%, #ff5216 53%, #fff 54%, #fff 57%, rgba(255,255,255,0) 58%, rgba(255,255,255,0) 100%)', 
                  }
                }
              }}
            >
              {}
            </Button>
          ))}
        </Stack>
      )}
    </>
  )
}
