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
        'light-pink': '#ff49db',
      },
      fontFamily: {
        'playball': ['Playball', 'sans-serif'],
        'system': ['system-ui', 'Arial', 'sans-serif']
      },
    },
  },
  plugins: [
  ]
}





