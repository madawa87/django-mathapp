/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["frontend/**/*.{html,js}"],
  theme: {
    extend: {
      // added by madawa 06/09/2026
      colors:{
        'game-start': 'rgba(14, 28, 58, 1)',
        'game-mid': 'rgba(14, 27, 53, 1)'
      }
    },
  },
  plugins: [],
}

