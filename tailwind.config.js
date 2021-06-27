const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        xxs: ".65rem",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bunker: {
          50: "#F3F4F4",
          100: "#E8E8E8",
          200: "#C5C6C6",
          300: "#A3A3A4",
          400: "#5D5F5F",
          500: "#181A1B",
          600: "#161718",
          700: "#0E1010",
          800: "#0B0C0C",
          900: "#070808",
        },
      },
    },
  },
  variants: {
    animation: ["responsive", "hover", "focus"],
    backgroundPosition: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
