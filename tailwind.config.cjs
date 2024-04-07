/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(bg|to|from|shadow|rounded)-+/,
      variants: [
        'hover',
        'active',
        'first',
        'hover:first',
        'active:first',
        'group-hover',
        'group-active',
      ],
    },
  ],
  content: ['./public/**/*.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        grass: { 0: '#EDF6EC', 1: '#63BC5A' },
        poison: { 0: '#F5EDF8', 1: '#B567CE' },
        fire: { 0: '#FCF3EB', 1: '#FF9D55' },
        flying: { 0: '#F1F4FA', 1: '#89AAE3' },
        water: { 0: '#EBF1F8', 1: '#5090D6' },
        bug: { 0: '#F1F6E8', 1: '#91C12F' },
        electric: { 0: '#FBF8E9', 1: '#E3C12B' },
        fairy: { 0: '#FBF1FA', 1: '#EC8FE6' },
        ground: { 0: '#F9EFEA', 1: '#D97845' },
        rock: { 0: '#F7F5F1', 1: '#C5B78C' },
        normal: { 0: '#F1F2F3', 1: '#919AA2' },
        psychic: { 0: '#FCEEEF', 1: '#FA7179' },
        steel: { 0: '#ECF1F3', 1: '#5A8EA2' },
        dragon: { 0: '#E4EEF6', 1: '#0B6DC3' },
        fighting: { 0: '#F8E9EE', 1: '#CE416B' },
        dark: { 0: '#ECEBED', 1: '#5A5465' },
        ghost: { 0: '#EBEDF4', 1: '#5269AD' },
        ice: { 0: '#F1FBF9', 1: '#73CEC0' },
        fill: { 0: '#FF7596', 1: '#CD3131' },
        stroke: { 0: '#5D78C0', 1: '#2551C3', 2: '#173EA5' },
      },
    },
    screens: {
      xx: '360px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1800px',
    },
  },
};
