import { useCustomerSession } from '@graphcommerce/magento-customer'
import { LayoutDefaultProps } from '@graphcommerce/next-ui'
import { useRouter } from 'next/router'
import { LayoutQuery } from './Layout.gql'
import { Logo } from './Logo'
import { LayoutDefault } from './LayoutDefault'
import { Box } from '@mui/material'
import { LoginPopUpModel } from '@components/LoginPopModel/LoginPopUpModel'

export type LayoutMinimalProps = LayoutQuery &
  Omit<LayoutDefaultProps, 'header' | 'footer' | 'cartFab' | 'noSticky'>

export function LayoutMinimal(props: LayoutMinimalProps) {
  const { menu, children, ...uiProps } = props
  const router = useRouter()
  const { loggedIn } = useCustomerSession()
  return (
    <LayoutDefault
      {...uiProps}
        className="checkout-page"
      noSticky={router.asPath.split('?')[0] === '/'}
      header={
        <>
          <Logo />
          {!loggedIn ? <LoginPopUpModel /> : null}
        </>
      }
      footer={
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: '#6e716e',
            color: '#ffffff',
            display: 'block',
            padding: '10px 0',
          }}
        >
          Copyright © 2023-present Brainvire, Inc. All rights reserved.
        </Box>
      }
    >
      {children}
    </LayoutDefault>
  )
}
