export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F13E93",
        secondary: "#F891BB",
        accent: "#F9D0CD",
        light: "#FAFFCB",
      },

      // 🔥 Custom Shadows (premium feel)
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.05)",
        glow: "0 0 20px rgba(241, 62, 147, 0.3)",
      },

      // 🔥 Animations
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },

        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};