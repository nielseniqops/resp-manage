/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    // tailwindcss를 적용할 경로
    // ** = any folder
    // * = any file
    // {  } = 확장자
  ],
  theme: {
    extend: {},
  },
	darkMode: "media",
  plugins: [require("@tailwindcss/forms")],
}