/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe9ff',
          200: '#d8d3ff',
          300: '#b9adff',
          400: '#927aff',
          500: '#7a5cff',
          600: '#5f3dff',
          700: '#4b2de0',
          800: '#3c25b3',
          900: '#342590',
        },
      },
      boxShadow: { tile: '0 4px 0 rgba(0,0,0,0.1)' },
      borderRadius: { tile: '14px' },
    },
  },
  plugins: [],
}
