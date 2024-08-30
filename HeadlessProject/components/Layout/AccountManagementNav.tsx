import { useApolloClient } from '@graphcommerce/graphql'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { SignOutFormDocument } from '@graphcommerce/magento-customer/components/SignOutForm/SignOutForm.gql'
import { useWishlistItems } from '@graphcommerce/magento-wishlist'
import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { Button, Container, Menu, MenuItem, Typography, Box, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { topMenu } from '../../config/topHeaderMenu'

export function AccountManagementNav() {
  const customer = useCustomerQuery(CustomerDocument)
  const wishlistItemsData = useWishlistItems()
  const router = useRouter()
  const client = useApolloClient()

  const itemCount =
    wishlistItemsData?.data && wishlistItemsData?.data?.length > 0
      ? ` (${wishlistItemsData?.data?.length} item${
          wishlistItemsData?.data?.length > 1 ? 's' : ''
        })`
      : ''
  const { handleSubmit } = useFormGqlMutation(
    SignOutFormDocument,
    {
      onComplete: async () => {
        await client.clearStore()
        router.push("/account/signin").then().catch()
      },
    },
    { errorPolicy: 'all' },
  )
  const submitHandler = handleSubmit(() => {})
  const customerInfo = customer?.data?.customer

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSignOut = async () => {
    await submitHandler()
  }

  const buttonStyle = {
    color: '#ffffff',
    paddingLeft: '8px',
    paddingRight: '8px',
    // justifyContent: 'center',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
    '&:active': {
      color: '#ffffff',
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  }

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: '#6e716e',
        color: '#ffffff',
        height: { xs: '36px', md:'42px' },
      }}
    >
      {customer && (
        <Container
          maxWidth='lg'
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <Typography
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center' 
            }}
            >
            {customerInfo
              ? <>
                Welcome, 
                <Typography 
                  component="span"
                  sx={{
                    display: 'inline-block',
                    padding: '0 3px',
                    maxWidth: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >{customerInfo?.firstname} {customerInfo?.lastname}</Typography>!
              </>
              : 'Welcome!'}
          </Typography>
          {!customerInfo && (
            <>
              <Link
                  underline='hover'
                  color= 'white'
                  sx={{ 
                    cursor:'pointer',
                    whiteSpace: 'nowrap',
                    padding: '0 6px'
                  }}
                  onClick={async () => {
                    await router.push(`/account/signin`)
                  }}
                >
                Sign In
              </Link>

              <Typography>or</Typography>
              <Link
                underline='hover'
                color= 'white'
                sx={{ 
                  cursor:'pointer',
                  whiteSpace: 'nowrap',
                  padding: '0 6px'
                }}
                onClick={async () => {
                  await router.push(`/account/signup`)
                }}
                >
                Create an Account                
              </Link>

            </>
          )}
          {customerInfo && (
            <Button
              onClick={handleClick}
              sx={{
                minWidth: '18px',
                height: '22px',
                padding: '0 0',
                transition: '0.1s ease-in-out',
                '&:hover': { backgroundColor: 'transparent' },
                '&:active': { backgroundColor: 'transparent' },
                ...(open && { transform: 'rotate(180deg)', transition: '0.1s ease-in-out' }),
              }}
            >
              <IconSvg src={iconChevronDown} size='medium' sx={{ fontSize:"20px", width: '18px', height: '18px' }} />
            </Button>
          )}
          <Menu
            id='basic-menu'
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              marginTop: '12px',
              minWidth: '175px',
            }}
            className='user-dropdown'
            PaperProps={{  
              style: {  
                width: 175,  
              },  
           }} 
          >
            {topMenu.map((item, index) => (
              <MenuItem
                sx={{
                  minHeight: 'auto',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  fontVariationSettings: "'wght' 400",
                }}
                key={item?.value}
                onClick={async () => {
                  handleClose()
                  if (item.label === 'My Account' || item.label === 'My Wish Lists') {
                    await router.push(item?.link ?? '')
                  }
                  if (item.label === 'Sign Out') {
                    await handleSignOut()
                  }
                }}
              >
                <Trans id={`${item.label}${index === 1 ? itemCount : ''}`} />
              </MenuItem>
            ))}
          </Menu>
        </Container>
      )}
    </Box>
  )
}
