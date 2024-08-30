/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'white-color': '#FFFFFF',
        'primary':'#355c9e',
        'grey-color':'#434343',
        'light-grey':'#3d3d3d',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'surferbay': ['Surfer Bay'],
        'montserrat': ['Montserrat']
      },
      dropShadow: {
        'cornbowl': '2.9714rem 3.9432rem 2.8125rem rgba(0, 0, 0, 0.76)', 
        'banner': '2.9714rem 3.9432rem 2.8125rem rgba(0, 0, 0, 0.76)',
        'slider': '1.166rem 1.5474rem 1.3438rem rgba(0, 0, 0, 0.54)',
        'event': '1.166rem 1.5474rem 1.3438rem rgba(0, 0, 0, 0.17)',
        'tomoto': '0.9599rem 0.8951rem 1rem rgba(0, 0, 0, 0.41)',
      },
      spacing :{
        '2pr' : "2%",
        '30pr':'30%',
        '23pr':'23%',
        '14pr':'14%'
      },
      fontSize:{
        'extra-small':'1.0625rem',
        'small':'1.3125rem',
        'smaller':'1.8125rem',
        'smallest':'2.0625rem',
        'medium':'2.625rem',
        'large':'3.9375rem',
        'extra-large':'5.5625rem',
        'font-larger':'6.25rem',
      },
      lineHeight:{
        'line-height-sm':'2.0625rem',
        'line-height-md':'2.875rem',
        'line-height':'3.875rem'
      },
      letterSpacing:{
        'spacing-small':'0.125rem',
        'spacing-normal':'0.1875rem',
        'spacing-medium':'0.25rem',
        'spacing-avarage':'0.3125rem',
        'spacing-large':'0.375rem'
      }
    },
  },
  plugins: [
  ]
}





