/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../templates/**/*.html", 
    "../static/js/**/*.js",
  ],
  theme: {
    extend: {},
    fontFamily: {
      Mystery: ["Mystery Quest", "sans-serif"],
      title: ["Pacifico", "sans-serif"],
      Caveat: ["Caveat", "sans-serif"]

    }
  },
  plugins: []
}
