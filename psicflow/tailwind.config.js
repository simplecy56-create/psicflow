/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#171425",
        brand: {
          DEFAULT: "#6C5CE7",
          dark: "#5847d1",
          light: "#EEEDFE",
        },
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};
