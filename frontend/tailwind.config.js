/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8F8F9',
        secondary: '#EDEDEF',
        card: '#FFFFFF',
        text: {
          primary: '#1C1C1E',
          secondary: '#5C5C60',
          tertiary: '#8E8E93',
        },
        accent: '#4A5568',
        success: '#48BB78',
        warning: '#ED8936',
        danger: '#F56565',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}