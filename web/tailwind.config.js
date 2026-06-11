/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0D2137',
        'primary-light': '#1A3A5C',
        accent: '#C9A84C',
        'accent-light': '#DDB96A',
        bg: '#FAF7F2',
        'bg-warm': '#F3EDE3',
        border: '#E5DDD0',
        success: '#2D6A4F',
        error: '#C62828',
        muted: '#6B7280',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
