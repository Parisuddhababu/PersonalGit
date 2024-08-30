/* eslint-disable @typescript-eslint/no-floating-promises */
import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui'
import { Typography, styled, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useRouter } from 'next/router'
import { menu } from '../../config/accountSidebarMenu'
import { MiniCompareProducts } from '../MiniCompareProducts'
import { MiniRecentOrders } from '../MiniRecentOrders'
import { MiniWishlist } from '../MiniWishlist'
import { useState } from 'react'

const CustomTab = styled(Tab)({
  textTransform: 'none',
  color: '#575757',
})

export const AccountSidebar = () => {
  const router = useRouter()
  const [isMyAccountTabActive, setIsMyAccountTab] = useState(false)

  const handleClick = () => {
    setIsMyAccountTab(!isMyAccountTabActive)
  }
  const activeTabIndex = menu.findIndex(
    (tab) => tab.link?.split('/')?.[2] === router.pathname?.split('/')?.[2],
  )

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: '17.25rem',
        [theme.breakpoints.down('md')]: {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          backgroundColor: '#ffffff',
          zIndex: '9',
          maxWidth: 'initial'
        },
        '&.active': {
          '& .account-sidebar-content': {
            display: 'block',
          },
          '& .accordion-sidebar-title': {
            '& .IconSvg-root': {
              transform: 'rotate(180deg)'
            }
          },
        },
      })}
      className={isMyAccountTabActive ? 'active' : ''}
      onClick={handleClick}
    >
      <Box
        className='accordion-sidebar-title'
        sx={{
          display: { xs: 'flex', md: 'none' },
          borderBottom: '1px solid #cccccc',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            width: '100%',
            padding: {xs:'0.763rem 2rem 0.763rem 0.938rem', md:'0.3rem 2rem 0.3rem 0.938rem'},
            cursor: 'pointer',
            '& svg': {
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
            },
          }}
        >
          My Account
          <IconSvg src={iconChevronDown} size='medium' />
        </Typography>
      </Box>

      <Box
        className='account-sidebar-content'
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            display: 'flex',
            height: 'fit-content',
            width: '100%',
            maxWidth: { xs: 'inherit', md: 'max-content' },
            marginBottom: '1.5rem',            
          }}
        >
          <Tabs
            TabIndicatorProps={{
              sx: {
                fontWeight: '600',
              },
            }}
            orientation='vertical'
            value={activeTabIndex}
            sx={{
              minWidth: { xs: '100%', md: '15.688rem' },
              borderBottom: {xs:'1px solid #cccccc', md:'0'},
              '.MuiButtonBase-root': {
                alignItems: 'baseline',
                marginTop: '0.188rem',
                fontWeight: 400,
                fontVariationSettings: "'wght' 400",
                minHeight: '1.875rem',
                padding: '0.375rem 1rem',
                maxWidth: 'inherit',
                '&:first-child': {
                  marginTop: '0',
                },
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                },
              },
              '.MuiTabs-indicator': {
                width: '0.188rem',
                left: '0',
                backgroundColor: '#ff5501',
              },
              '.MuiTabs-flexContainer': {
                padding: '0.938rem 0',
              },
              '.Mui-selected': {
                color: '#333 !important',
                fontWeight: 600,
                fontVariationSettings: "'wght' 600",
              },
            }}
          >
            {menu.map((tab) => (
              <CustomTab
                key={tab.label}
                label={tab.label}
                onClick={() => router.pathname !== tab.link && router.push(tab.link)}
              />
            ))}
          </Tabs>
        </Box>
        <Box
          sx={{
            display: {xs:'none', md:'block'},
            padding: { xs: '0 0.938rem', md: '0' },
          }}
        >
          <MiniCompareProducts />
        </Box>
        <Box
          sx={{
            display: {xs:'none', md:'block'},
            padding: { xs: '0 0.938rem', md: '0' },
          }}
        >
          <MiniRecentOrders />
        </Box>
        <Box
          sx={{
            display: {xs:'none', md:'block'},
            padding: { xs: '0 0.938rem', md: '0' },
          }}
        >
          <MiniWishlist />
        </Box>
      </Box>
    </Box>
  )
}
