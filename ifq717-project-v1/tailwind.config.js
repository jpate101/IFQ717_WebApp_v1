/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx, css}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3498db',  // blue-500
        'secondary': '#1e40af',  // blue-800
        'background': '#f9fafb', // gray-50
        tandaBlue: '#19b3d9',
      },
    },
  },
  plugins: [],
}