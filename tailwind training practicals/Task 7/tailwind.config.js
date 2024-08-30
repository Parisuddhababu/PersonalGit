/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
      screens: {
        'mobile': '576px',
        'tablet': '960px',
        'laptop': '1440px',
      },
      colors: {
        'gray': '#808080',
        'white': '#ffffff'
      },
      fontFamily: {
        'playball': ['Playball', 'sans-serif'],
      },
      extend: {
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        }
      }
    },
  },
  plugins: [
  ]
}
