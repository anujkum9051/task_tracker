/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202a',
        line: '#d9e2ec',
        surface: '#f7fafc',
        brand: '#176b87',
        accent: '#c2410c'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 42, 0.08)'
      }
    }
  },
  plugins: []
};
