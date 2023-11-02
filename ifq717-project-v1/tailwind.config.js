/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js, jsx}"],
  theme: {
    extend: {
      tandaBlue: '#19b3d9',
      colors: {
        'primary': '#3498db',  // blue-500
        'secondary': '#1e40af',  // blue-800
        'background': '#f9fafb', // gray-50
      },
    },
  },
  plugins: [],
}