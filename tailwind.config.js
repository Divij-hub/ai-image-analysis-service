/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add any other folders where you use Tailwind classes
  ],
  theme: {
    extend: {
      // You can customize your brand colors or fonts here
      colors: {
        primary: "#3b82f6", // The blue used in your buttons
      },
    },
  },
  plugins: [],
}