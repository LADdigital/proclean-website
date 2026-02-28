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
        'widget-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-4px)' },
          '80%': { transform: 'translateY(-7px)' },
        },
      },
      animation: {
        'widget-bounce': 'widget-bounce 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
