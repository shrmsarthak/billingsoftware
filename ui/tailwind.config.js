/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#1a84ac",
        "dark-red": "#d24d4d",
        "light-white": "rgba(255,255,255,0.17)",
      }
    },

  },
  plugins: [],
});