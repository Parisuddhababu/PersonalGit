/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true
  },
  experimental: {
    applyComplexClasses: true
  },
  purge: {
    layers: ['base', 'utilities'],
    content: [
      './src/layout/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/views/**/*.{js,ts,jsx,tsx}',
    ],
    options: {
      whitelist: ['zoom-open'],
      safelist: {
        standard: ['outline-none']
      }
    }
  },
  theme: {
    container: {
      center: true,
    },
    class: {
      'cus-select': 'class*="Input"',
    },
    extend: {
      fontFamily: {
        primary: ['OpenSans', 'sans-serif']
      },
      fontSize: {
        'xs-10': '0.625rem',
        'xs-11': '0.688rem',
        'xs-14': '0.875rem',
        'xl-22': '1.375rem',
        'xl-25': '1.563rem',
        'xs-15': '0.938rem',
        'xl-28': '1.75rem',
        'xl-26': '1.635rem',
        'xl-30': '1.875rem',
        'xl-35': '2.188rem',
        'xl-40': '2.5rem',
        'xl-44': '2.75rem',
        'xl-50': '3.125rem',
        'xxl-60': '3.75rem',
        'xxl-70': '4.375rem',
        'xxl-80': '5rem'
      },
      colors: {
        primary: '#0091B7',
        secondary: '#a9acae',
        warning: '#ffc107',
        default: '#fff',
        info: '#28d3cd',
        error: '#ff3a3a',
        success: '#4dbd74',
        'accent': '#0d1f2f',
        'light-gray': '#efefef',
        'accents-2': '#f6f7f7',
        'accents-3': '#467592',
        'border-primary': '#e2e0e0',
        'border-secondary': '#f1fff8',
        'border-light-blue-shade': '#bbd5e9',
        'border-light-grey': '#d4d5d6',
        'p-list-box-btn': '#03cc6f',
        'p-list-box-btn-bg': '#f1fff8',
        'yellow': '#ffd70d',
        'orange': '#f6901e',
        'light-blue': '#f6f7f7',
        'dark-grey': '#363637',
        'light-blue1': '#eefbff',
        'dark-blue': '#153D60',
        'navy-blue': '#165185',
        'light-red': '#fef0f0',
        'sky-blue': '#e3f2f6',
        'btn-hover': '#027795',
        'btn-error': '#ff3a3a'
      },
      backgroundColor: {
        modal: '#0D1F2F99',
        sidebar: '#2F353A',
        card: '#0d1f2f80',
        playlist: '#0d1f2f80',
        'green-badge-bg': '#E8FFF4',
      },
      textColor: {
        baseColor: '#363637',
        primary: '#0091b7',
        secondary: '#fff',
        'light-grey': '#a9acae',
        'bright-green-shade': '#03cc6f',
      },
      boxShadow: {
        outline: '0 0 20px rgba(0, 0, 0, 0.1)',
        'outline-2': '0 0 0 2px #f6f7f7',
        btnHover: 'inset 0px 0px 20px rgba(0, 0, 0, 0.15)',
        header: '0 5px 10px rgba(0, 0, 0, 0.05)',
        'table-outline': '0 -10px 10px rgba(50, 50, 50, 0.1)',
        'outline-3': '0 3px 20px rgba(0, 0, 0, 0.16)',
        'infos': '0px 0px 20px rgba(0, 0, 0, 0.1)'
      },
      dropShadow: {
        outline: '0 -5px 10px rgba(0, 0, 0, 0.05)',
        'outline-2': '0 0 10px rgba(0, 0, 0, 0.16)',
        'arrow-shaddow': '0 0 5px rgba(120, 122, 124, 0.3)',

      },
      height: {
        'screen-2': 'var(--h-screen-5)',
      },
      zIndex: {
        '-1': '-1',
        1: '1',
        5: '5'
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.2s ease-out',
        'fade-in-left': 'fade-in-left 0.2s ease-out',
        'fade-in-right': 'fade-in-right 0.2s ease-out'
      },
      screens: {
        'xxs': '480px',
        'xs': '576px',
        'xmd': '991px',
        '2lg': '1180px',
        '3xl': '1700px',
        '3.5xl': '1800px',
        '4xl': '1920px',
      },
      borderRadius: {
        'extra-10': '0.625rem',
        'extra-5': '0.313rem',
      },
      lineHeight: {
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        11: '2.813rem',
      },
      transitionProperty: {
        'height': 'height',
      },
      maxWidth: {
        'introductory-container': '1128px',
      },
      spacing: {
        '7.5': '30px',
      },
      minHeight: {
        '400px': '25rem',
        '340px': '21.25rem'
      },

    },
  },
  plugins: [],
}
