/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#B91C1C',
          'red-dark': '#991B1B',
          'red-light': '#DC2626',
          orange: '#EA580C',
          'orange-light': '#F97316',
          charcoal: '#1C1917',
          'charcoal-light': '#292524',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'widget-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-12deg)' },
          '20%': { transform: 'rotate(12deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '40%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-6deg)' },
          '60%': { transform: 'rotate(6deg)' },
          '70%': { transform: 'rotate(-2deg)' },
          '80%': { transform: 'rotate(2deg)' },
          '90%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        'widget-shake': 'widget-shake 0.7s ease-in-out',
      },
    },
  },
  plugins: [],
};
