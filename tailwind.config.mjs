/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'woof-orange': '#FF6B00', // Cor primária
        'dark-brown': '#4A2E00',  // Para títulos
        'warm-yellow': '#FFC25C', // Destaque
        'teal-accent': '#009688', // Destaque
        'dark-gray': '#333333',   // Texto corrido
        'light-gray': '#F4F4F4',  // Fundos
      },
      fontFamily: {
        sans: ['Lato', 'Inter', 'Helvetica', 'Arial', 'sans-serif'], // Fonte de texto corrido e fallback
        display: ['Montserrat', 'sans-serif'], // Fonte para títulos
      },
    },
  },
  plugins: [],
};
