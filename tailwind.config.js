/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main palette from logo
        'pixel-dark': '#3d2b54',        // Deep purple background (from logo)
        'pixel-darker': '#3d2b54',      // Same as logo background
        'pixel-purple': '#4a3563',      // Medium purple
        'pixel-light-purple': '#d4b5ff', // Light lavender
        'pixel-blue': '#7eb3ff',        // Light blue (main text)
        'pixel-light-blue': '#a4d4ff',  // Lighter blue
        'pixel-pink': '#ffb3d9',        // Pastel pink
        'pixel-hot-pink': '#ff8dc7',    // Brighter pink
        'pixel-cream': '#fff4d6',       // Cream/beige
        'pixel-yellow': '#ffe7a3',      // Soft yellow
        'pixel-red': '#ff6b9d',         // Softer red/pink
        'pixel-green': '#a3ffb8',       // Pastel green
        'pixel-white': '#f5f5f5',       // White
        'pixel-gray': '#9b8fb5',        // Purple-gray
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'pixel-sm': '2px 2px 0px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
        'damage': 'damage 0.5s ease-out',
        'hp-drain': 'hp-drain 0.8s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        damage: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'hp-drain': {
          '0%': { width: '100%' },
          '100%': { width: 'var(--final-width)' },
        },
      },
    },
  },
  plugins: [],
}
