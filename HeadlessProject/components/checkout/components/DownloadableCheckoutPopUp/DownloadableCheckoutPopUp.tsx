import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
  Box
} from '@mui/material'
import { useState } from 'react'
import CheckoutEmailForm from '../CheckoutEmailForm'
import { ComposedForm } from '@graphcommerce/react-hook-form'
import { CloseIcon } from '@components/Icons'
import { Trans } from '@lingui/react'
import router from 'next/router'
// import { Closemenu } from '../Icons'
import { Closemenu } from '../../../../components/Icons'

export interface DialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
  openPopUp?: boolean
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        ></IconButton>
      ) : null}
    </DialogTitle>
  )
}

export default function DownloadableCheckoutPopUp(props: DialogTitleProps) {
  const { onClose } = props
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose() // Call the onClose function from props
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        maxWidth='xl'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '72rem',
            borderRadius: '0'
          }
        }}
      >
        <DialogContent
          sx={{
            padding:{xs: '2.625rem 1.5rem 1.5rem',md:'2.625rem 1.875rem 1.875rem'},
          }}
        >
          {open && (

            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
              }}
            >
              <Closemenu />
            </IconButton>
          )}
          <Divider />
          <Grid container rowSpacing={7}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRight: {md:'1px solid #cccccc'},
                  borderBottom: {xs:'1px solid #cccccc', md:'0'},
                  paddingTop: {md:'0.625rem'},
                  paddingRight: {md:'1.875rem'},
                  paddingBottom: {xs: '2rem', md:'0'},
                  height: '100%',
                  position: 'relative',
                  '&:after': {
                    content: `'OR'`,
                    height: '36px',
                    lineHeight: '34px',
                    margin: '-19px 0 0 -18px',
                    minWidth: '36px',
                    background: '#fff',
                    border: '1px solid #c1c1c1',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    color: '#c1c1c1',
                    display: 'inline-block',
                    padding: '0 0.2rem',
                    position: 'absolute',
                    top: {md:'50%'},
                    right: {xs: '50%', md:'-18px'},
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    bottom: {xs: '-18px', md: 'auto'}
                  }
                }}
              >
                <Typography
                  variant='h4'
                    sx={{ 
                      fontSize: '1.625rem !important',
                      marginBottom: {xs:'0.5rem', md: '1rem'},
                      marginTop: '1rem',
                    }}
                >
                  <Trans id='Checkout as a new Customer' />
                </Typography>
                <List
                  sx={{
                    '& li': {
                      padding: '0.25rem 0',
                    }
                  }}
                >
                  <ListItem>Creating an account has many benefits:</ListItem>
                  <ListItem>See order and shipping status</ListItem>
                  <ListItem>Track order history</ListItem>
                  <ListItem>Check out faster</ListItem>
                </List>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: {xs: '1rem', md: '3rem'}
                  }}
                >
                  <Button
                    sx={{
                      minWidth: { xs: '100%', md: '64px' },
                      padding: {xs: '0.5rem 1.063rem', md: '0.875rem 1.063rem'},
                      fontSize: {xs: '0.875rem', md: '1.125rem'},
                    }}
                    variant='contained'
                    size='large'
                    color='secondary'
                    onClick={() => {
                      router
                        .push('/account/signup')
                        .then(() => {})
                        .catch(() => {})
                    }}
                  >
                    <Trans id='Create an Account' />
                  </Button>
                </Box>
                
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  paddingTop: {md:'0.625rem'},
                  paddingLeft: {md:'2.5rem'}
                }}
              >
                <Typography
                  variant='h4'
                    sx={{ 
                      fontSize: '1.625rem !important',
                      marginBottom: '1.5rem',
                    }}
                >
                  <Trans id='Checkout using your account' />
                </Typography>
                <ComposedForm>
                    <CheckoutEmailForm loginPopUpProp='loginPopUpProp' />
                </ComposedForm>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}
