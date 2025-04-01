/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          50: "#fff9e6",
          100: "#fff3cc",
          200: "#ffe799",
          300: "#ffdb66",
          400: "#ffcf33",
          500: "#ffc300",
          600: "#cc9c00",
          700: "#997500",
          800: "#664e00",
          900: "#332700",
        },
        secondary: {
          50: "#fff5e6",
          100: "#ffebcc",
          200: "#ffd799",
          300: "#ffc366",
          400: "#ffaf33",
          500: "#ff9b00",
          600: "#cc7c00",
          700: "#995d00",
          800: "#663e00",
          900: "#331f00",
        },
        accent: {
          50: "#fff0e6",
          100: "#ffe1cc",
          200: "#ffc399",
          300: "#ffa566",
          400: "#ff8733",
          500: "#ff6900",
          600: "#cc5400",
          700: "#993f00",
          800: "#662a00",
          900: "#331500",
        },
        background: {
          light: "#fff9e6",
          dark: "#1a1a1a",
        },
        text: {
          light: "#332700",
          dark: "#fff9e6",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
