/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true
  },
  experimental: {
    // to make space-x-6 and other complicated classes
    // available when using with @apply
    applyComplexClasses: true
  },
  content: [
    './src/layout/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/views/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roboto', 'sans-serif']
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        warning: 'var(--warning)',
        default: 'var(--default)',
        info: 'var(--info)',
        error: 'var(--error)',
        'success': 'var(--success)',
        'accent': 'var(--accent)',
        'light-gray': 'var(--bg-light)',
        'i-1': 'var(--i1)',
        'i-2': 'var(--i2)',
        'p-1': 'var(--p1)',
        's-1': 'var(--s1)',
        's-2': 'var(--s2)',
        's-3': 'var(--s3)',
        'b-1': 'var(--b1)',
        'b-2': 'var(--b2)',
        'w-1': 'var(--w1)',
      }
    },
  },
  plugins: [],
}
