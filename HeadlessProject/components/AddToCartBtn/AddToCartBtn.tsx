import { Trans } from '@lingui/react'
import { Button, SxProps, Theme } from '@mui/material'
// Component used for configurable products and for routing grouped and bundle products to PDP page through productListRenderer component

export type AddToCartBtnProps = {
  disabled?: boolean;
  title?: string;
  onClick?: any;
  sx?: SxProps<Theme>
}

export const AddToCartBtn = (props: AddToCartBtnProps) => {
  const { disabled, title, onClick, sx } = props
  return (
    <Button
      disableRipple
      disabled={disabled || false}
      onClick={onClick}
      sx={{
        color: '#ffffff',
        backgroundColor: '#1979c3',
        border: '1px solid #1979c3',
        '&:hover, &:active': { backgroundColor: '#006bb4' },
        '&:disabled': {
          color: '#ffffff',
          opacity: '.5',
          backgroundColor: '#1979c3',
          pointerEvents: 'none',
        },
        ...sx,
      }}
      variant='contained'
      size='medium'
      color='secondary'
    >
      <Trans id={title || 'Add to Cart'} />
    </Button>
  )
}
