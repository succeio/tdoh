  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          twitch: '#772ce8'
        },
        backgroundImage: {
          "boo": "url('https://i.pinimg.com/564x/0d/ef/ee/0defeee0f9688db60613f86553522cc1.jpg')",
          "boo2": "url('https://i.pinimg.com/originals/77/80/4e/77804eda54e8db8f167ad38d95cf632f.gif')",
      },
    },
    },
    plugins: [],
    darkMode: 'selector'
  }
