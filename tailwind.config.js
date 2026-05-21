/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#3d1a10',
          primary: '#c0623a',
          light:   '#f0ede8',
          muted:   '#9a6a5a',
          tan:     '#c9a090',
          gray:    '#d9cfc9',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}