/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-secondary': 'var(--brand-color-secondary)',
      },
    },
  },
  plugins: [],
};
