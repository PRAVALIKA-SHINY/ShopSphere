/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],

  theme: {
    extend: {
      colors: {
        cream: '#FCFBF8',

        ink: '#263238',

        brand: {
          50: '#F1F7F8',
          100: '#E3EFF1',
          200: '#CFE2E6',
          300: '#B5D2D8',
          400: '#94BCC5',
          500: '#739FA9',
          600: '#5F8D97',
          700: '#4F747D',
        },

        mint: {
          50: '#F1FAF7',
          100: '#DFF3EB',
          200: '#C2E9DA',
          300: '#9FD8C2',
          400: '#74C2A4',
          500: '#4CA784',
        },

        peach: {
          50: '#FFF8F3',
          100: '#FDEBDD',
          200: '#F8D4BE',
          300: '#EEB494',
        },

        rose: {
          50: '#FFF6F7',
          100: '#FCE5E9',
          200: '#F8CDD5',
          300: '#F0A9B7',
          400: '#E58A9D',
          500: '#D96F87',
        },
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],

        display: [
          'Playfair Display',
          'Georgia',
          'serif',
        ],
      },

      borderRadius: {
        xl2: '1.25rem',
      },

      boxShadow: {
        soft: '0 8px 30px rgba(69, 91, 99, 0.08)',
        lift: '0 15px 35px rgba(69, 91, 99, 0.12)',
        card: '0 6px 24px rgba(69, 91, 99, 0.06)',
      },
    },
  },

  plugins: [],
}