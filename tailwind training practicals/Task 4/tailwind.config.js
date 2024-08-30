/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('./preset')
  ],
  darkMode: 'class',
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'mobile': '576px',
        'tablet': '960px',
        'laptop': '1440px',
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
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
  ]
}

