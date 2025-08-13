/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nova paleta Woof Digital
        'woof-blue': '#a4c2dc',       // O azul claro principal da marca
        'woof-dark-gray': '#5a6872',  // O cinza escuro usado nos fundos
        'woof-white': '#ffffff',      // Branco para textos e logos
        
        // Cores legadas (mantidas para compatibilidade)
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
