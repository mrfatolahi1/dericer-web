/** @type {import('tailwindcss').Config} */
module.exports = {
  // We use the `dark` class on <html> for dark mode
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      // You can extend colors, spacing, etc. here later.
    },
  },
  plugins: [],
};
