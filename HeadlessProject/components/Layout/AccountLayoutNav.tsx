import { useQuery } from '@graphcommerce/graphql'
import {
  AccountDashboardDocument,
  CustomerDocument,
  useCustomerQuery,
} from '@graphcommerce/magento-customer'
import { SearchLink } from '@graphcommerce/magento-search'
import {
  DesktopNavActions,
  LayoutDefaultProps,
  NavigationProvider,
  NavigationOverlay,
  useNavigationSelection,
  useMemoDeep,
  IconSvg,
  iconSearch,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Divider, IconButton, Link, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { compareListDocument } from '../../graphql/compare-product/CompareList.gql'
import { AccountSidebar } from '../AccountSidebar/index'
import { CartIcon, Closemenu, Hamburger } from '../Icons'
import { SearchFormComp } from '../SearchFormComp/SearchFormComp'
import { UIContext } from '../common/contexts/UIContext'
import { MegaMenuCartTotal } from '../shopping-cart/components'
import LayoutMiniCart from '../shopping-cart/components/MiniCart/LayoutMiniCart'
import { AccountManagementNav } from './AccountManagementNav'
import { Footer } from './Footer'
import { LayoutQuery } from './Layout.gql'
import { LayoutDefault } from './LayoutDefault'
import { Logo } from './Logo'
import { MiniCompareProducts } from '../MiniCompareProducts'
import { MiniRecentOrders } from '../MiniRecentOrders'
import { MiniWishlist } from '../MiniWishlist'

export type LayoutNavigationProps = LayoutQuery &
  Omit<LayoutDefaultProps, 'footer' | 'header' | 'cartFab' | 'menuFab'>

export function AccountLayoutNav(props: LayoutNavigationProps) {
  const dashboard = useCustomerQuery(AccountDashboardDocument, {
    fetchPolicy: 'cache-and-network',
  })
  const { GetMegaMenu, children, ...uiProps } = props
  const icon = <IconSvg src={CartIcon} size='large' />
  const customer = useCustomerQuery(CustomerDocument)
  const [state] = useContext(UIContext)

  const selection = useNavigationSelection()
  const router = useRouter()
  let compareId = ''
  if (typeof window !== 'undefined') {
    compareId =
      customer?.data?.customer?.compare_list?.uid || localStorage.getItem('CompareListId') || ''
  }

  const { data } = useQuery(compareListDocument, {
    variables: { uid: compareId || state?.compareId },
    skip: !state?.compareId
  })
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !showMenu
      ? document.body.classList.add('menu-open')
      : document.body.classList.remove('menu-open')
  }

  const items = data?.compareList?.items

  return (
    <>
      <AccountManagementNav />
      <NavigationProvider
        selection={selection}
        items={useMemoDeep(
          () => [
            <SearchLink
              href='/search'
              sx={(theme) => ({
                width: `calc(100% - ${theme.spacing(4)})`,
                m: 2,
                mb: theme.spacings.xs,
              })}
              aria-label={i18n._(/* i18n */ 'Search...')}
              key='search_type'
            >
              <Trans id='Search enire store here...' />
            </SearchLink>,
            <Divider key='divider_head' sx={(theme) => ({ my: theme.spacings.xs })} />,
          ],
          [],
        )}
      >
        <NavigationOverlay
          stretchColumns={false}
          variantSm='left'
          sizeSm='full'
          justifySm='start'
          itemWidthSm='70vw'
          variantMd='left'
          sizeMd='full'
          justifyMd='start'
          itemWidthMd='230px'
          mouseEvent='hover'
          itemPadding='md'
        />
      </NavigationProvider>

      <LayoutDefault
        {...uiProps}
          className="checkout-page"
        noSticky={router.asPath.split('?')[0] === '/'}
        showMenu={showMenu}
        header={
          <>
            <IconButton
              size='small'
              aria-label='Hamburger Menu'
              sx={{
                display: { xs: 'flex', md: 'none' },
                '& > svg': {
                  fontSize: '20px',
                },
              }}
              onClick={() => handleHamburgerClick()}
            >
              {!showMenu ? <Hamburger /> : <Closemenu />}
            </IconButton>
            <Logo />

            <DesktopNavActions
              sx={{
                marginLeft: 'auto',
                display: 'grid',
                pointerEvents: 'none !important' as 'none',
                '& > *': {
                  pointerEvents: 'all',
                },
                alignItems: 'center',
                gridAutoFlow: 'column',
                columnGap: 1,
              }}
            >
              <IconButton
                size='small'
                aria-label='search'
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
                onClick={() => setShowSearch(!showSearch)}
              >
                <IconSvg src={iconSearch} />
              </IconButton>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {items && items?.length > 0 && (
                  <Link
                    href='/compare'
                    sx={{
                      color: '#000000',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                      paddingRight: '0.5rem',
                    }}
                  >
                    Compare Products{' '}
                    {items && items?.length > 0 && (
                      <Typography component='span' sx={{color: '#7d7d7d'}}>
                        <Trans id={`(${items?.length} item${items?.length > 1 ? 's' : ''})`} />
                      </Typography>
                    )}
                  </Link>
                )}
              </Box>
              <SearchFormComp showSearch={showSearch} />
              <LayoutMiniCart />

              {/* The placeholder exists because the CartFab is sticky but we want to reserve the space for the <CartFab /> */}
              {/* <PlaceholderFab /> */}
            </DesktopNavActions>
          </>
        }
        footer={<Footer {...props} />}
        // cartFab={<CartFab />}
        // menuFab={<NavigationFab onClick={() => selection.set([])} />}
        megaMenu={GetMegaMenu?.content}
      >
        {dashboard?.data ? (
          <Container
            sx={{
              padding: {
                xs: '3.5rem 0.938rem 0.938rem !important',
                md: '2.8rem 2rem 2rem !important',
              },
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: {xs:'column', md:'row'},
                flexWrap: 'wrap',
              }}>
              <AccountSidebar />
              {children}
              <Box
                sx={{
                  display: {xs:'block', md:'none'}
                }}
              >
                <Box>
                  <MiniCompareProducts />
                </Box>
                <Box>
                  <MiniRecentOrders />
                </Box>
                <Box>
                  <MiniWishlist />
                </Box>
              </Box>
            </Box>
          </Container>
        ) : (
          <>{children}</>
        )}
      </LayoutDefault>
    </>
  )
}
