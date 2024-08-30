/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
      colors: {
        'gray': '#606060'
      },
      fontFamily: {
        'system': ['system-ui', 'Arial', 'sans-serif']
      },
    },
  },
  plugins: [
  ]
}



