/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      xx: '360px',
      xs: '480px',
      sm: '664px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1800px'
    }
  }
}
