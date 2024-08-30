import { CloseIcon } from '@components/Icons'
import { Button, ClickAwayListener, Popover, Typography, Box, IconButton } from '@mui/material'
import { useState } from 'react'

import { CheckoutEmailForm } from '@components/checkout'
import { ComposedForm } from '@graphcommerce/react-hook-form'
import { Closemenu } from '../Icons'

export const LoginPopUpModel = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [visibleCross, setVisibleCross] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setVisibleCross(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'login-popover' : undefined

  return (
    <>
      <Button
        onClick={handleClick}
        disableRipple
        sx={{ 
          padding: '0', 
          marginLeft: 'auto',
          minWidth: 'initial',
          color: '#1979c3',
          fontWeight: '400',
          fontVariationSettings: "'wght' 400",
          '&:hover': { 
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          } 
        }}
      >
        Sign in
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Adjust the opacity as needed
          },
        }}
        sx={[
          (theme) => ({
            [theme.breakpoints.down('sm')]: {
              backgroundColor: 'rgba(51,51,51,0.55)',
            },
            '& > .MuiPaper-root': {
              padding: '1.563rem',
              minWidth: '25.625rem',
              border: '1px solid #cccccc',
              borderRadius: '0',
              [theme.breakpoints.down('sm')]: {
                backgroundColor: '#f4f4f4',
                position: 'fixed',
                top: '0 !important',
                right: '0',
                bottom: '0',
                left: '2.75rem !important',
                height: '100%',
                maxHeight: '100%',
                minWidth: 'initial'
              }
            },
          })
        ]}
      >
        {visibleCross && (
          <IconButton 
            aria-label="Close" 
            onClick={handleClose}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
            }}
            size="small"
          >
            <Closemenu fontSize="small"/>
          </IconButton>
        )}
        <ClickAwayListener onClickAway={handleClose}>
          <ComposedForm>
            <Box sx={{
            }}>
              <Typography variant='h4' 
                sx={{ 
                  fontSize: {xs: '1.125rem !important', md:'1.625rem !important'},
                  fontWeight: '300',
                  fontVariationSettings: "'wght' 300",
                  marginBottom: '1.5rem'
                }}>
                Sign In
              </Typography>
              <CheckoutEmailForm loginPopUpProp='PopUpProp' sx={{
                '& .popoverFooterControl': {
                  justifyContent: 'space-between',
                  flexDirection: {xs: 'column', md:'row-reverse'},
                  alignItems: {xs: 'flex-start', md: 'center'},
                }
              }}/>
            </Box>
          </ComposedForm>
        </ClickAwayListener>
      </Popover>
    </>
  )
}
