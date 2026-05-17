/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },

      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dde8ff",
          200: "#c3d5ff",
          300: "#9bb8ff",
          400: "#6e91ff",
          500: "#4264f5",
          600: "#2d48e8",
          700: "#2337cc",
          800: "#1e2ea6",
          900: "#1e2d84",
        },
      },

      animation: {
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.15s ease-out",
      },

      keyframes: {
        slideIn: {
          from: {
            opacity: "0",
            transform: "translateY(-8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
    },
  },

  plugins: [],
};