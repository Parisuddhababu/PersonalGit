/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'mobile': '576px',
        'tablet': '960px',
        'laptop': '1440px',
      },
      colors: {
        'purple': '#7e5bef',
        'gray': '#8492a6',
        'Gray': '#808080'
      },
      fontFamily: {
        'sans': ['Graphik', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },

}

