/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js,css}", "./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#520dc2",
        secondary: "#218838",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
