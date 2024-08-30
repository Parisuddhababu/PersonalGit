// eslint-disable-next-line import/no-unresolved
// import { useQuery } from '@graphcommerce/graphql'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import {
    DesktopNavActions,
    LayoutDefaultProps,
    NavigationProvider,
    NavigationOverlay,
    useNavigationSelection,
    useMemoDeep, iconSearch, IconSvg,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { IconButton, Divider, Link, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import {useContext, useEffect, useState} from 'react'
import { compareListDocument } from '../../graphql/compare-product/CompareList.gql'
import { Hamburger, Closemenu } from '../Icons'
import { SearchFormComp } from '../SearchFormComp/SearchFormComp'
import { UIContext } from '../common/contexts/UIContext'
import LayoutMiniCart from '../shopping-cart/components/MiniCart/LayoutMiniCart'
import { AccountManagementNav } from './AccountManagementNav'
import { Footer } from './Footer'
import { LayoutQuery } from './Layout.gql'
import { LayoutDefault } from './LayoutDefault'
import { Logo } from './Logo'
import {useLazyQuery} from "@graphcommerce/graphql";

export type LayoutNavigationProps = LayoutQuery &
  Omit<LayoutDefaultProps, 'footer' | 'header' | 'cartFab' | 'menuFab'>

export function LayoutNavigation(props: LayoutNavigationProps) {
  const { GetMegaMenu, children, ...uiProps } = props
  const customer = useCustomerQuery(CustomerDocument)
  const [state] = useContext(UIContext)

  let compareId = ''
  if (typeof window !== 'undefined') {
    compareId =
      customer?.data?.customer?.compare_list?.uid || localStorage.getItem('CompareListId') || ''
  }
  const [fetchCompareList, { data }] = useLazyQuery(compareListDocument)
  const selection = useNavigationSelection()
  const router = useRouter()

    useEffect(() => {
        if (compareId) {
            fetchCompareList({
                variables: { uid: compareId || state?.compareId },
            })
        }
    }, [compareId]);


  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !showMenu
      ? document.body.classList.add('menu-open')
      : document.body.classList.remove('menu-open')
  }
  const customStyles = (theme) => ({ my: theme.spacings.xs })
  
  return (
    <>
      <NavigationProvider
        selection={selection}
        items={useMemoDeep(
          () => [
            <SearchFormComp key='search_form' />,
            <Divider key='divier_head' sx={customStyles} />,
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
        noSticky={router.asPath.split('?')[0] === '/'}
        showMenu={showMenu}
        beforeHeader={<AccountManagementNav />}
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
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {data?.compareList?.items && data?.compareList?.items?.length > 0 && (
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
                    {data?.compareList?.items && data?.compareList?.items?.length > 0 && (
                      <Typography component='span' sx={{color: '#7d7d7d'}}>
                        <Trans id={`(${data?.compareList?.items?.length} item${data?.compareList?.items?.length > 1 ? 's' : ''})`} />
                      </Typography>
                    )}
                  </Link>
                )}
              </Box>
              <SearchFormComp showSearch={showSearch} />

              <IconButton
                size='small'
                aria-label='search'
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  fontSize: '1rem'
                }}
                onClick={() => setShowSearch(!showSearch)}
              >
                <IconSvg src={iconSearch} />
              </IconButton>

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
        {children}
      </LayoutDefault>
    </>
  )
}
