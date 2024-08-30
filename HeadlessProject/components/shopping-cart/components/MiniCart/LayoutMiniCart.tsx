import { CartIcon, CloseIcon } from '@components/Icons'
import { CartFab } from '@graphcommerce/magento-cart'
import { IconSvg } from '@graphcommerce/next-ui'
import { Box, Button, Popover, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import MiniCart from './MiniCart'
import MegaMenuCartTotal from '../MegaMenuCartTotal'
import * as React from 'react'
import { Closemenu } from '../../../../components/Icons'

const LayoutMiniCart = () => {
  const [open, setOpen] = useState(false)

  const icon = <IconSvg src={CartIcon} size='medium' />

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const openPopover = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <Typography
        component='span'
        sx={{
          padding: '0',
          minWidth: 'initial',
          marginLeft: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        aria-describedby={id}
        onClick={handleClick}
      >
        <CartFab
          icon={icon}
          sx={{
            height: '1.875rem',
            width: '1.875rem',
            '& .MuiButtonBase-root': {
              boxShadow: 'none',
              minHeight: 'initial',
              height: '1.875rem',
              width: '1.875rem',
              '&:active': {
                boxShadow: 'none',
              },
            },
            '&.CartFab-root': {
              '& .CartFab-shadow': {
                boxShadow: 'none',
              },
            },
          }}
        />
        <MegaMenuCartTotal />
      </Typography>
      {/* </Button> */}

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            width: '24.375rem',
            boxShadow: '0 3px 3px rgba(0,0,0,0.15)',
            border: '1px solid #bbbbbb',
            marginTop: '0.25rem',
            overflow: 'visible',
            borderRadius: '0',
            transform: 'translate( 0.5rem, 0 )',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::before, &::after': {
              content: `''`,
              display: 'block',
              position: 'absolute',
              top: '-0.75rem',
              left: '0',
              right: '0',
              marginLeft: 'auto',
              marginRight: '0.875rem',
              width: '0',
              height: '0',
              borderTop: '6px solid transparent',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
            },
            '&::before': {
              borderBottom: '6px solid #ffffff',
            },
            '&::after': {
              top: '-0.813rem',
              borderBottom: '6px solid #bbbbbb',
              zIndex: '-1',
            },
          }}
        >
          <IconButton
            onClick={() => handleClosePopover()}
            aria-label='close mini cart'
            size='small'
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              top: '0.125rem',
              right: '0.125rem',
            }}
          >
            <Closemenu fontSize='inherit' />
          </IconButton>
          <MiniCart setAnchorEl={setAnchorEl} />
        </Box>
      </Popover>
    </>
  )
}
export default LayoutMiniCart
