module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx}',
    './index.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ['Inter', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
}
