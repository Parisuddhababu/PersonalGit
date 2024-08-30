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
        'baby-blue': '#1fb6ff',
        'gray-dark': '#273444',
      },
      fontFamily: {
        'playball': ['Playball', 'sans-serif'],
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
  plugins: [
  ]
}
