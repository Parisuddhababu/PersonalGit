import { Logo as LogoBase } from '@graphcommerce/next-ui'
import svgLogo from './magento.png'


export function Logo() {
  return (
    <LogoBase
      sx={{
        display: 'block',
        marginLeft: '0',
        '& .GcLogo-logo': {
          width: 'auto',
          height: { xs: '30px', md: '40px', lg: '50px' },
          paddingLeft: { xs: '10px', md: 0 },
          filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(100%)' : 'none'),
          verticalAlign: 'middle'
        },
      }}
      image={{ alt: 'Magento Logo', src: svgLogo, unoptimized: false }}
    />
  )
}
