/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pixel-dark': '#0f0f1e',
        'pixel-darker': '#070710',
        'pixel-blue': '#2d4a96',
        'pixel-light-blue': '#5b8dd6',
        'pixel-red': '#d84654',
        'pixel-yellow': '#ffd93d',
        'pixel-green': '#6bc96b',
        'pixel-white': '#f5f5f5',
        'pixel-gray': '#5a5a5a',
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
