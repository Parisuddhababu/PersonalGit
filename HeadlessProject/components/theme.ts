/// <reference types="@graphcommerce/next-ui/types" />

import {
  responsiveVal,
  breakpointVal,
  MuiButtonPill,
  MuiButtonResponsive,
  themeBaseDefaults,
  MuiSnackbar,
  MuiFabSizes,
  MuiSlider,
  MuiChip,
  MuiButtonInline,
  NextLink,
} from '@graphcommerce/next-ui'
import { createTheme, Theme, alpha, LinkProps } from '@mui/material'
import { Components, PaletteOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true
    sm: true
    md: true
    lg: true
    xl: true
  }
}

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#47C489',
    dark: '#47C489',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#1979c3',
    dark: '#006bb4',
    light: '#d1e4ff',
    contrastText: '#ffffff',
  },
  // bodyGray: {
  //   main: '#eeeeee',
  //   dark: '#e1e1e1',
  //   contrastText: '#333333',
  // },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    image: '#ffffff',
  },
  divider: '#00000015',
  success: {
    main: '#01d26a',
  },
  action: {
    hoverOpacity: 0.12,
  },
  text: {
    primary: '#0F0F10',
    secondary: '#03031755',
    disabled: '#03031735',
  },
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#62C7B0',
    contrastText: '#ffffff',
    dark: '#62C7B0',
  },
  secondary: {
    main: '#62C7B0',
    light: '#62C7B0',
    contrastText: '#ffffff',
  },
  background: {
    default: '#001727',
    paper: '#15293B',
    image: '#ffffff',
  },
  divider: '#ffffff30',
  success: {
    main: '#01D26A',
  },
  action: {
    hoverOpacity: 0.16,
  },
  text: {
    primary: '#ffffff',
    secondary: '#ffffff80',
    disabled: '#ffffff30',
  },
}

const fontSize = (from: number, to: number) =>
  breakpointVal('fontSize', from, to, themeBaseDefaults.breakpoints.values)

// Create a theme instance.
const createThemeWithPalette = (palette: PaletteOptions) =>
  createTheme({
    palette,
    ...themeBaseDefaults,
    shape: { borderRadius: 3 },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1300,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: 'Open Sans, Helvetica Neue, Helvetica, Arial,sans-serif',
      // @see docs typography.md
      h1: {
        ...fontSize(28, 64),
        fontWeight: 700,
        fontVariationSettings: "'wght' 700",
        lineHeight: 1.22,
      },
      h2: {
        ...fontSize(25, 40),
        fontWeight: 700,
        fontVariationSettings: "'wght' 700",
        lineHeight: 1.35,
      },
      h3: {
        ...fontSize(22, 30),
        fontWeight: 700,
        fontVariationSettings: "'wght' 700",
        lineHeight: 1.55,
      },
      h4: {
        ...fontSize(18, 24),
        fontWeight: 300,
        fontVariationSettings: "'wght' 300",
        lineHeight: 1.55,
      },
      h5: {
        ...fontSize(17, 20),
        fontWeight: 600,
        fontVariationSettings: "'wght' 600",
        lineHeight: 1.55,
      },
      h6: {
        ...fontSize(16, 18),
        fontWeight: 300,
        fontVariationSettings: "'wght' 300",
        lineHeight: 1.1,
      },
      subtitle1: {
        ...fontSize(16, 19),
        fontWeight: 500,
        fontVariationSettings: "'wght' 500",
        lineHeight: 1.7,
      },
      fontWeightBold: 600,
      body1: {
        ...fontSize(14, 14),
        lineHeight: 1.358,
      },
      subtitle2: {
        ...fontSize(14, 16),
        fontWeight: 400,
        fontVariationSettings: "'wght' 400",
        lineHeight: 1.5,
      },
      body2: {
        ...fontSize(13, 15),
        lineHeight: 1.7,
      },
      caption: {
        // https://web.dev/font-size/#how-the-lighthouse-font-size-audit-fails
        ...fontSize(12, 13),
      },
      button: {},
      overline: {
        // https://web.dev/font-size/#how-the-lighthouse-font-size-audit-fails
        ...fontSize(12, 14),
        fontWeight: 500,
        letterSpacing: 1,
        lineHeight: 1.2,
        textTransform: 'uppercase',
      },
    },
    spacings: {
      xxs: responsiveVal(10, 16),
      xs: responsiveVal(12, 20),
      sm: responsiveVal(14, 30),
      md: responsiveVal(16, 50),
      lg: responsiveVal(24, 80),
      xl: responsiveVal(40, 100),
      xxl: responsiveVal(80, 160),
    },
    page: {
      horizontal: responsiveVal(10, 30),
      vertical: responsiveVal(10, 30),
    },
    appShell: {
      headerHeightSm: '60px',
      headerHeightMd: '96px',
      appBarHeightMd: '80px',
      appBarInnerHeightMd: '46px',
    },
  })

const createOverrides = (theme: Theme): Components => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        overflowY: 'scroll',
      },
      '::selection': { background: alpha(theme.palette.primary.main, 0.6) },
      '::-moz-selection': { background: alpha(theme.palette.primary.main, 0.6) },
      '#__next': {
        position: 'relative',
      },
      'picture img': {
        filter: 'brightness(1.03)',
        willChange: 'filter',
      },
    },
  },

  // https://mui.com/material-ui/guides/routing/#global-theme-link
  // https://www.graphcommerce.org/docs/framework/links
  MuiLink: {
    defaultProps: { component: NextLink, color: 'secondary' } as LinkProps,
  },

  MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },

  MuiContainer: {
    variants: [
      {
        props: { disableGutters: false },
        style: {
          paddingLeft: theme.page.horizontal,
          paddingRight: theme.page.horizontal,
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.page.horizontal,
            paddingRight: theme.page.horizontal,
          },
        },
      },
    ],
  },

  MuiInputBase: {
    styleOverrides: {
      root: {
        fontSize: '16px', // https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
      },
    },
  },

  MuiButton: {
    defaultProps: { color: 'inherit' },
    variants: [
      ...MuiButtonResponsive,
      ...MuiButtonPill,
      ...MuiButtonInline,
      {
        props: {
          variant: 'contained',
          color: 'inherit',
        },
        style: {
          backgroundColor: '#eeeeee',
          color: '#333333',
          padding: '7px 15px',
          border: '1px solid #cccccc',
          '&:hover': {
            boxShadow: 'inset 0 1px 0 0 #ffffff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
            backgroundColor: '#e1e1e1',
          },
          '&:not(.Mui-disabled)': {
            boxShadow: 'none',
          },
        },
      },
      {
        props: { variant: 'outlined' },
        style: {
          //   ...breakpointVal(
          //     'borderRadius',
          //     theme.shape.borderRadius * 2,
          //     theme.shape.borderRadius * 3,
          //     theme.breakpoints.values,
          //   ),
        },
      },
      {
        props: { variant: 'text' },
        style: { borderRadius: '99em' },
      },
      {
        props: { variant: 'inline' },
        style: { borderRadius: '99em' },
      },
      {
        props: { color: 'primary' },
        style: {
          '&:not(.Mui-disabled)': {
            boxShadow: 'none',
          },
        },
      },
      {
        props: { color: 'secondary' },
        style: {
          '&:not(.Mui-disabled)': {
            boxShadow: 'none',
          },
        },
      },
      // {
      //   props: { color: 'bodyGray' },
      //   style: {
      //     border: '1px solid #cccccc',
      //     boxShadow: 'inset 0 1px 0 0 #ffffff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
      //     '&:not(.Mui-disabled)': {
      //       boxShadow: 'none',
      //     },
      //   },
      // },
      {
        props: { size: 'medium' },
        style: {
          padding: '0.438rem 0.938rem',
          lineHeight: '1.125rem',
          fontWeight: 600,
        },
      },
      {
        props: { size: 'large' },
        style: {
          padding: '0.875rem 1.063rem',
          lineHeight: '1.5rem',
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    ],
  },

  MuiFab: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
        },
        color: theme.palette.text.primary,
      },
      colorInherit: {
        backgroundColor: 'inherit',
        '&:hover, &:focus': {
          backgroundColor: 'inherit',
        },
        boxShadow: 'none',
      },
      primary: {
        color: theme.palette.text.primary,
      },
      secondary: {
        color: theme.palette.text.primary,
      },
      extended: {
        fontWeight: 400,
        textTransform: 'none',
      },
    },

    variants: [...MuiFabSizes],
  },

  MuiInputLabel: {
    // defaultProps: { color: 'secondary' },
    styleOverrides: {
      root: {
        fontWeight: '600',
        fontVariationSettings: "'wght' 600",
        color: '#000000',
        marginBottom: '0.5rem',
        '& .asterisk, & .MuiFormLabel-asterisk': {
          marginLeft: '0.25rem',
          color: '#e02b27',
        },
      },
    },
  },

  MuiTextField: {
    defaultProps: { color: 'secondary' },
    styleOverrides: {
      root: {
        width: '100%',
        '& .MuiInputBase-adornedEnd': {
          paddingRight: '0.5rem',
          '& .MuiIconButton-root': {
            padding: '0.25rem',
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem',
            },
          },
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#ffffff',
          height: '2rem',
          borderRadius: '0',
          width: '100%',
          '& .MuiOutlinedInput-input': {
            padding: '0.372rem 0.875rem',
          },
        },
        "& input": {
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          "&[type='number']": {
            '-moz-appearance': 'textfield',
          },
        },
        '&.TextInputNumber-quantity': {
          '& .MuiInputBase-adornedEnd': {
            paddingRight: '0.875rem',
          }
        },
        '& .MuiInputBase-multiline': {
          height: 'auto',
          padding: '0.372rem 0.875rem',
          '& .MuiInputBase-inputMultiline': {
            padding: '0'
          }
        },
      },
    },
  },

  MuiRadio: {
    defaultProps: { color: 'secondary' },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: theme.palette.text.primary,
      },
    },
  },

  MuiChip: {
    variants: [...MuiChip],
  },

  MuiCheckbox: {
    defaultProps: { color: 'secondary' },

    styleOverrides: {
      colorPrimary: {
        color: theme.palette.text.disabled,
        '&.Mui-checked': {
          color: theme.palette.secondary.main,
        },
      },
      colorSecondary: {
        color: theme.palette.text.disabled,
        '&.Mui-checked': {
          color: theme.palette.secondary.main,
        },
      },
    },

    variants: [
      {
        props: { size: 'medium' },
        style: {
          padding: 7,
        },
      },
    ],
  },

  MuiSwitch: {
    styleOverrides: {
      thumb: {
        boxShadow: theme.shadows[6],
      },
    },
  },

  MuiSnackbar: { variants: [...MuiSnackbar] },

  MuiAvatar: {
    styleOverrides: {
      colorDefault: {
        backgroundColor: theme.palette.text.disabled,
      },
    },
  },

  MuiSlider: { variants: [...MuiSlider] },

  MuiLinearProgress: {
    defaultProps: { color: 'secondary' },
  },

  MuiCircularProgress: {
    defaultProps: {
      thickness: 2,
      color: 'secondary',
    },
  },

  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        '& .MuiBreadcrumbs-ol': {
          '& .MuiBreadcrumbs-li': {
            '& .MuiTypography-root': {
              fontSize: '12px',
              lineHeight: '16px',
              color: '#707070',
            },
            '& .MuiLink-root ': {
              color: '#006bb4',
            },
          },
          '& .MuiBreadcrumbs-separator': {
            fontSize: '20px',
            lineHeight: '16px',
            alignItems: 'center',
            transform: 'translateY(-1px)',
            margin: '0 14px',
            color: '#707070',
          },
        },
      },
    },
  },

  MuiAccordion: {
    styleOverrides: {
      root: {
        borderLeft: '0',
        borderRight: '0',
        borderRadius: '0px',
        boxShadow: 'none',
        borderBottom: '1px solid #cccccc',
        '&:first-of-type': {
          borderRadius: '0',
        },
        '&.Mui-expanded': {
          margin: '0',
        },
        // '&+.MuiAccordion-root': {
        //   marginTop: '10px',
        // },
        '&:after,&:before': {
          display: 'none',
        },
        '.MuiAccordionSummary-root': {
          padding: '0px 10px',
          // color: '#071B34',
          minHeight: '40px',
          '&.Mui-expanded': {
            minHeight: 'auto',
            margin: '0',
          },
          '.MuiAccordionSummary-content': {
            margin: '10px 0 11px',
            '.MuiTypography-root': {
              textTransform: 'uppercase',
              fontWeight: '600',
            },
          },
          // '.MuiAccordionSummary-expandIconWrapper': {
          //   svg: {
          //     fontSize: '14px',
          //     '@media (max-width:900px)': {
          //       fontSize: '10px',
          //     },
          //     '*': {
          //       stroke: '#071B34',
          //     },
          //   },
          //   '&.Mui-expanded': {
          //     svg: {
          //       path: {
          //         d: 'path("M 622 1401 m -9 9 h 18")',
          //       },
          //     },
          //   },
          // },
        },
        '.MuiCollapse-root': {
          '.MuiAccordionDetails-root': {
            padding: '0 0  10px',
            '> a': {
              li: {
                padding: '0 10px',
                '.FilterEqual-listItemInnerContainer': {
                  padding: 0,
                  '.MuiListItemSecondaryAction-root': {
                    right: '8px',
                    span: {
                      float: 'none',
                      margin: '0',
                    },
                  },
                },
              },
            },
            ul: {
              // padding: '0 20px 0 30px',
              // '@media (max-width:1600px)': {
              //   padding: '0 15px 0 25px',
              // },
              // '@media (max-width:1200px)': {
              //   padding: '0 10px 0 20px',
              // },
              li: {
                // padding: '15px 0',
                // justifyContent: 'space-between',
                // '@media (max-width:1600px)': {
                //   padding: '10px 0',
                // },
                // '@media (max-width:1200px)': {
                //   padding: '8px 0',
                // },
                // '.MuiTypography-root': {
                //   fontWeight: 400,
                //   paddingRight: '10px',
                //   lineHeight: '19px',
                // },
                // '&:first-of-type': {
                //   paddingTop: '4px',
                // },
                // '.MuiButtonBase-root': {
                //   flex: 'none',
                // },
              },
            },
          },
        },
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '0 !important',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        '& .MuiAlert-message': {
          lineHeight: '1.125rem',
        },
        '& .MuiAlert-action': {
          paddingTop: '0.5rem',
          marginRight: '0',
          '& .MuiLink-root': {
            lineHeight: '1.125rem',
          },
        },
      },
    },
  },

  MuiTable: {
    styleOverrides: {
      root: {
        '& .MuiTableHead-root ': {
          display: 'none',
          [theme.breakpoints.up('md')]: {
            display: 'table-header-group',
          },
          '& .MuiTableCell-head ': {
            padding: '0.688rem 0.625rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            fontVariationSettings: "'wght' 700",
            display: 'none',
            [theme.breakpoints.up('md')]: {
              display: 'table-cell',
            },
          }
        },
        '& .MuiTableBody-root': {
          '& .MuiTableRow-root' :{
            display: 'block',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            [theme.breakpoints.up('md')]: {
              display: 'table-row',
              borderBottom: '0',
            },
            '&:first-child':{              
              [theme.breakpoints.down('md')]: {
                borderTop: '1px solid rgba(224, 224, 224, 1)',
              }
            },
            '& .MuiTableCell-root' :{
              display: 'block',
              borderBottom: '0',
              verticalAlign: 'top',
              [theme.breakpoints.up('md')]: {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                display: 'table-cell',
              },
              '&:first-child':{
                [theme.breakpoints.down('md')]: {
                  paddingTop: '0.938rem',
                }
              },
              '&:last-child':{
                [theme.breakpoints.down('md')]: {
                  paddingBottom: '0.938rem',
                }
              },
              '&:before':{
                [theme.breakpoints.down('md')]: {
                  paddingRight: '0.65rem',
                  content: `attr(data-th) ': '`,
                  display: 'inline-block',
                  color: '#111',
                  fontWeight: '700',
                }
              },
              '&.actions': {
                '&:before': {
                  content: 'none'
                }
              }
            },
          },
          '& .MuiTableCell-body': {
            padding: '0.313rem 0.625rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            [theme.breakpoints.up('md')]: {
              padding: '0.688rem 0.625rem',
            }
          }
        },
        '& .MuiTableFooter-root': {
          '& .MuiTableCell-footer': {
            padding: '0.688rem 0.625rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
          }
        },
      },
    },
  },

  MuiSelect: {
    defaultProps: { color: 'secondary' },
    styleOverrides: {
      select: {
        padding: '4px 25px 5px 10px',
        '& .MuiSelect-root': {
          padding: '0',
          backgroundColor: '#f0f0f0',
          boxShadow: 'inset 0 1px 0 0 #fff, inset 0 -1px 0 0 rgba(204,204,204,0.3)',
          borderRadius: '3px',
        }
      },
    },
  },

})

export const lightTheme = createThemeWithPalette(lightPalette)
lightTheme.components = createOverrides(lightTheme)

export const darkTheme = createThemeWithPalette(lightPalette)
darkTheme.components = createOverrides(lightTheme)
