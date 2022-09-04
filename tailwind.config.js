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
        W95FA: ['W95FA', 'serif'],
        TerminalRegular: ['TerminalRegular', 'serif'],
        TerminalBold: ['TerminalBold', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
}
