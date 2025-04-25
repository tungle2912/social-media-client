/** @type {import("tailwindcss").Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './pages/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './components/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './src/**/*.{js,ts,jsx,tsx,mdx,scss}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-dark-blue': 'linear-gradient(317deg, #10004B 24.14%, #4B0062 75.86%)',
        'gradient-orange': 'linear-gradient(94deg, #F15A2D 0%, #B6004C 100%)',
      },
      colors: {
        base: {
          'dark-blue': '#10004B',
          orange: '#F15A2D',
          green: '#4CAF50',
          black: 'var(--black-origin)',
          'black-100': 'var(--black-100)',
          'black-200': 'var(--black-200)',
          'black-300': 'var(--black-300)',
          'black-400': 'var(--black-400)',
          'black-500': 'var(--black-500)',
          'black-600': 'var(--black-600)',
          'black-700': 'var(--black-700)',
          'dim-gray': '#666666',
          'magenta-100': 'var(--magenta-100)',
          'magenta-200': 'var(--magenta-200)',
          'magenta-300': 'var(--magenta-300)',
          'magenta-400': 'var(--magenta-400)',
          'magenta-500': 'var(--magenta-500)',
          'purple-100': 'var(--purple-100)',
          'purple-200': 'var(--purple-200)',
          'purple-300': 'var(--purple-300)',
          'purple-400': 'var(--purple-400)',
          'purple-500': 'var(--purple-500)',
          'teal-100': 'var(--teal-100)',
          'teal-200': 'var(--teal-200)',
          'teal-300': 'var(--teal-300)',
          'teal-400': 'var(--teal-400)',
          'teal-500': 'var(--teal-500)',
          'orange-100': 'var(--orange-100)',
          'orange-200': 'var(--orange-200)',
          'orange-300': 'var(--orange-300)',
          'orange-400': 'var(--orange-400)',
          'orange-500': 'var(--orange-500)',
          'yellow-100': 'var(--yellow-100)',
          'yellow-200': 'var(--yellow-200)',
          'yellow-300': 'var(--yellow-300)',
          'yellow-400': 'var(--yellow-400)',
          'yellow-500': 'var(--yellow-500)',
          'blue-100': 'var(--blue-100)',
          'blue-200': 'var(--blue-200)',
          'blue-300': 'var(--blue-300)',
          'blue-400': 'var(--blue-400)',
          'blue-500': 'var(--blue-500)',
          'green-100': 'var(--green-100)',
          'green-200': 'var(--green-200)',
          'green-300': 'var(--green-300)',
          'green-400': 'var(--green-400)',
          'green-500': 'var(--green-500)',
          'green-userIcon': '#1FAF38',
          'red-100': 'var(--red-100)',
          'red-200': 'var(--red-200)',
          'red-300': 'var(--red-300)',
          'red-400': 'var(--red-400)',
          'red-500': 'var(--red-500)',
          gray: '#888888',
          'gray-100': '#F7F7F7',
          'dark-gray': '#636363',
        },
        'white-opacity-30': 'rgb(255, 255, 255, 30%)',
        'white-opacity-5': 'rgb(255, 255, 255, 5%)',
        'bg-gray': '#f9f9f9',
        primary: 'var(--primary)',
        'medium-sea-green': '#05A660',
        secondary: 'var(--secondary)',
        'secondary-100': 'var(--secondary-1)',
        disabled: 'var(--disable)',
      },
      boxShadow: {
        center: '0px 0px 12px rgba(0, 0, 0, 0.15)',
      },
      maxWidth: {
        70: '70%',
        60: '60%',
        50: '50%',
      },
      cursor: {
        'click-white': 'pointer',
        'click-black': 'pointer',
      },
    },
    fontFamily: {
      sans: ['Noto Sans HK'],
    },
    fontSize: {
      xs: '0.75rem', // ~12px
      sm: '0.875rem', // ~14px
      base: '1rem', // ~16px
      lg: '1.125rem', // ~18px
      xl: '1.25rem', // ~20px
      '2xl': '1.5rem', // ~24px
      '3xl': '1.75rem', // ~28px
      '4xl': '2rem', // ~32px
    },
    fontWeight: {
      w1: '100',
      w2: '200',
      light: '300',
      regular: '400',
      w5: '500',
      w6: '600',
      bold: '700',
      w8: '800',
      w9: '900',
    },
    // cursor: {
    //   'click-white': `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxOSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjI2NjYgMTEuNzMzM0MxNy4wNjY1IDEwLjQ2NjYgMTUuNDY2NiA5LjU5OTkzIDEzLjc5OTkgOS4yNjY1OUMxMy4wNjY2IDkuMDY2NiAxMi4zMzMyIDguOTMzMjYgMTEuNTk5OSA4Ljg2NjZDMTMuNDY2NSA2LjY2NjYgMTMuMTMzMiAzLjMzMzI2IDEwLjkzMzIgMS40NjY2QzguNzMzMjIgLTAuNDAwMDcgNS4zOTk4OCAtMC4wNjY3MzcxIDMuNTMzMjIgMi4xMzMyNkMxLjY2NjU1IDQuMzMzMjYgMS45OTk4OCA3LjY2NjYgNC4xOTk4OCA5LjUzMzI2QzQuNTk5ODggOS44NjY2IDQuOTk5ODggMTAuMTMzMyA1LjM5OTg4IDEwLjI2NjZWMTEuNzMzM0w0LjMzMzIyIDEwLjczMzNDMy4zOTk4OCA5Ljc5OTkzIDEuODY2NTUgOS43OTk5MyAwLjg2NjU1IDEwLjczMzNDLTAuMDY2NzgzNSAxMS42NjY2IC0wLjEzMzQ1IDEzLjEzMzMgMC43OTk4ODMgMTQuMDY2NkwzLjg2NjU1IDE3LjY2NjZDMy45OTk4OCAxOC41OTk5IDQuMzMzMjIgMTkuNDY2NiA0Ljc5OTg4IDIwLjI2NjZDNS4xMzMyMiAyMC44NjY2IDUuNTk5ODggMjEuNDY2NiA2LjA2NjU1IDIxLjkzMzNWMjMuMTk5OUM2LjA2NjU1IDIzLjU5OTkgNi4zMzMyMiAyMy44NjY2IDYuNzMzMjIgMjMuODY2NkgxNS43OTk5QzE2LjEzMzIgMjMuODY2NiAxNi40NjY2IDIzLjUzMzMgMTYuNDY2NiAyMy4xOTk5VjIxLjQ2NjZDMTcuNzMzMiAxOS45MzMzIDE4LjM5OTkgMTcuOTk5OSAxOC4zOTk5IDE2LjA2NjZWMTIuMTk5OUMxOC40NjY2IDExLjkzMzMgMTguMzk5OSAxMS43OTk5IDE4LjI2NjYgMTEuNzMzM1pNMy41OTk4OCA1LjQ2NjZDMy41OTk4OCAzLjI2NjYgNS4zOTk4OCAxLjUzMzI2IDcuNTk5ODggMS41OTk5M0M5Ljc5OTg4IDEuNTk5OTMgMTEuNTMzMiAzLjM5OTkzIDExLjQ2NjYgNS41OTk5M0MxMS40NjY2IDYuNzk5OTMgMTAuOTMzMiA3Ljg2NjYgOS45OTk4OCA4LjU5OTkzVjUuMjY2NkM5Ljk2NTg0IDQuNjg4ODQgOS43MTIwOCA0LjE0NiA5LjI5MDYzIDMuNzQ5MzRDOC44NjkxOSAzLjM1MjY4IDguMzExOTcgMy4xMzIyNiA3LjczMzIyIDMuMTMzMjZDNi41MzMyMiAzLjA2NjYgNS40NjY1NSA0LjA2NjYgNS40NjY1NSA1LjI2NjZWOC43MzMyNkM0LjMzMzIyIDguMDY2NiAzLjY2NjU1IDYuNzk5OTMgMy41OTk4OCA1LjQ2NjZaTTE3LjEzMzIgMTUuOTk5OUMxNy4xOTk5IDE3LjczMzMgMTYuNTk5OSAxOS4zOTk5IDE1LjQ2NjYgMjAuNzMzM0MxNS4zMzMyIDIwLjg2NjYgMTUuMTk5OSAyMC45OTk5IDE1LjE5OTkgMjEuMTk5OVYyMi41OTk5SDcuNDY2NTVWMjEuNjY2NkM3LjQ2NjU1IDIxLjQ2NjYgNy4zMzMyMiAyMS4yNjY2IDcuMTk5ODggMjEuMTMzM0M2LjczMzIyIDIwLjczMzMgNi4zMzMyMiAyMC4yNjY2IDUuOTk5ODggMTkuNjY2NkM1LjU5OTg4IDE4Ljk5OTkgNS4zMzMyMiAxOC4xOTk5IDUuMTk5ODggMTcuMzk5OUM1LjE5OTg4IDE3LjI2NjYgNS4xMzMyMiAxNy4xMzMzIDUuMDY2NTUgMTYuOTk5OUwxLjg2NjU1IDEzLjE5OTlDMS42NjY1NSAxMi45OTk5IDEuNTMzMjIgMTIuNzMzMyAxLjUzMzIyIDEyLjM5OTlDMS41MzMyMiAxMi4xMzMzIDEuNjY2NTUgMTEuNzk5OSAxLjg2NjU1IDExLjU5OTlDMi4zMzMyMiAxMS4xOTk5IDIuOTk5ODggMTEuMTk5OSAzLjQ2NjU1IDExLjU5OTlMNS4zOTk4OCAxMy41MzMzVjE1LjUzMzNMNi42NjY1NSAxNC44NjY2VjUuMjY2NkM2LjczMzIyIDQuNzk5OTMgNy4xMzMyMiA0LjM5OTkzIDcuNjY2NTUgNC40NjY2QzguMTMzMjIgNC40NjY2IDguNTk5ODggNC43OTk5MyA4LjU5OTg4IDUuMjY2NlYxMi45MzMzTDkuOTMzMjIgMTMuMTk5OVYxMC4xMzMzQzkuOTk5ODggMTAuMDY2NiAxMC4wNjY2IDEwLjA2NjYgMTAuMTMzMiA5Ljk5OTkzQzEwLjU5OTkgOS45OTk5MyAxMS4wNjY1IDEwLjA2NjYgMTEuNTMzMiAxMC4xMzMzVjEzLjUzMzNMMTIuNTk5OSAxMy43MzMzVjEwLjI2NjZMMTMuMzk5OSAxMC40NjY2QzEzLjczMzIgMTAuNTMzMyAxNC4wNjY2IDEwLjY2NjYgMTQuMzk5OSAxMC43OTk5VjE0LjEzMzNMMTUuNDY2NiAxNC4zMzMzVjExLjI2NjZDMTYuMDY2NiAxMS41MzMzIDE2LjU5OTkgMTEuOTMzMyAxNy4wNjY2IDEyLjM5OTlMMTcuMTMzMiAxNS45OTk5WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==), pointer`,
    //   'click-black': `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxOSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjI2NjYgMTEuNzMzM0MxNy4wNjY1IDEwLjQ2NjYgMTUuNDY2NiA5LjU5OTkzIDEzLjc5OTkgOS4yNjY1OUMxMy4wNjY2IDkuMDY2NiAxMi4zMzMyIDguOTMzMjYgMTEuNTk5OSA4Ljg2NjZDMTMuNDY2NSA2LjY2NjYgMTMuMTMzMiAzLjMzMzI2IDEwLjkzMzIgMS40NjY2QzguNzMzMjIgLTAuNDAwMDcgNS4zOTk4OCAtMC4wNjY3MzcxIDMuNTMzMjIgMi4xMzMyNkMxLjY2NjU1IDQuMzMzMjYgMS45OTk4OCA3LjY2NjYgNC4xOTk4OCA5LjUzMzI2QzQuNTk5ODggOS44NjY2IDQuOTk5ODggMTAuMTMzMyA1LjM5OTg4IDEwLjI2NjZWMTEuNzMzM0w0LjMzMzIyIDEwLjczMzNDMy4zOTk4OCA5Ljc5OTkzIDEuODY2NTUgOS43OTk5MyAwLjg2NjU1IDEwLjczMzNDLTAuMDY2NzgzNSAxMS42NjY2IC0wLjEzMzQ1IDEzLjEzMzMgMC43OTk4ODMgMTQuMDY2NkwzLjg2NjU1IDE3LjY2NjZDMy45OTk4OCAxOC41OTk5IDQuMzMzMjIgMTkuNDY2NiA0Ljc5OTg4IDIwLjI2NjZDNS4xMzMyMiAyMC44NjY2IDUuNTk5ODggMjEuNDY2NiA2LjA2NjU1IDIxLjkzMzNWMjMuMTk5OUM2LjA2NjU1IDIzLjU5OTkgNi4zMzMyMiAyMy44NjY2IDYuNzMzMjIgMjMuODY2NkgxNS43OTk5QzE2LjEzMzIgMjMuODY2NiAxNi40NjY2IDIzLjUzMzMgMTYuNDY2NiAyMy4xOTk5VjIxLjQ2NjZDMTcuNzMzMiAxOS45MzMzIDE4LjM5OTkgMTcuOTk5OSAxOC4zOTk5IDE2LjA2NjZWMTIuMTk5OUMxOC40NjY2IDExLjkzMzMgMTguMzk5OSAxMS43OTk5IDE4LjI2NjYgMTEuNzMzM1pNMy41OTk4OCA1LjQ2NjZDMy41OTk4OCAzLjI2NjYgNS4zOTk4OCAxLjUzMzI2IDcuNTk5ODggMS41OTk5M0M5Ljc5OTg4IDEuNTk5OTMgMTEuNTMzMiAzLjM5OTkzIDExLjQ2NjYgNS41OTk5M0MxMS40NjY2IDYuNzk5OTMgMTAuOTMzMiA3Ljg2NjYgOS45OTk4OCA4LjU5OTkzVjUuMjY2NkM5Ljk2NTg0IDQuNjg4ODQgOS43MTIwOCA0LjE0NiA5LjI5MDYzIDMuNzQ5MzRDOC44NjkxOSAzLjM1MjY4IDguMzExOTcgMy4xMzIyNiA3LjczMzIyIDMuMTMzMjZDNi41MzMyMiAzLjA2NjYgNS40NjY1NSA0LjA2NjYgNS40NjY1NSA1LjI2NjZWOC43MzMyNkM0LjMzMzIyIDguMDY2NiAzLjY2NjU1IDYuNzk5OTMgMy41OTk4OCA1LjQ2NjZaTTE3LjEzMzIgMTUuOTk5OUMxNy4xOTk5IDE3LjczMzMgMTYuNTk5OSAxOS4zOTk5IDE1LjQ2NjYgMjAuNzMzM0MxNS4zMzMyIDIwLjg2NjYgMTUuMTk5OSAyMC45OTk5IDE1LjE5OTkgMjEuMTk5OVYyMi41OTk5SDcuNDY2NTVWMjEuNjY2NkM3LjQ2NjU1IDIxLjQ2NjYgNy4zMzMyMiAyMS4yNjY2IDcuMTk5ODggMjEuMTMzM0M2LjczMzIyIDIwLjczMzMgNi4zMzMyMiAyMC4yNjY2IDUuOTk5ODggMTkuNjY2NkM1LjU5OTg4IDE4Ljk5OTkgNS4zMzMyMiAxOC4xOTk5IDUuMTk5ODggMTcuMzk5OUM1LjE5OTg4IDE3LjI2NjYgNS4xMzMyMiAxNy4xMzMzIDUuMDY2NTUgMTYuOTk5OUwxLjg2NjU1IDEzLjE5OTlDMS42NjY1NSAxMi45OTk5IDEuNTMzMjIgMTIuNzMzMyAxLjUzMzIyIDEyLjM5OTlDMS41MzMyMiAxMi4xMzMzIDEuNjY2NTUgMTEuNzk5OSAxLjg2NjU1IDExLjU5OTlDMi4zMzMyMiAxMS4xOTk5IDIuOTk5ODggMTEuMTk5OSAzLjQ2NjU1IDExLjU5OTlMNS4zOTk4OCAxMy41MzMzVjE1LjUzMzNMNi42NjY1NSAxNC44NjY2VjUuMjY2NkM2LjczMzIyIDQuNzk5OTMgNy4xMzMyMiA0LjM5OTkzIDcuNjY2NTUgNC40NjY2QzguMTMzMjIgNC40NjY2IDguNTk5ODggNC43OTk5MyA4LjU5OTg4IDUuMjY2NlYxMi45MzMzTDkuOTMzMjIgMTMuMTk5OVYxMC4xMzMzQzkuOTk5ODggMTAuMDY2NiAxMC4wNjY2IDEwLjA2NjYgMTAuMTMzMiA5Ljk5OTkzQzEwLjU5OTkgOS45OTk5MyAxMS4wNjY1IDEwLjA2NjYgMTEuNTMzMiAxMC4xMzMzVjEzLjUzMzNMMTIuNTk5OSAxMy43MzMzVjEwLjI2NjZMMTMuMzk5OSAxMC40NjY2QzEzLjczMzIgMTAuNTMzMyAxNC4wNjY2IDEwLjY2NjYgMTQuMzk5OSAxMC43OTk5VjE0LjEzMzNMMTUuNDY2NiAxNC4zMzMzVjExLjI2NjZDMTYuMDY2NiAxMS41MzMzIDE2LjU5OTkgMTEuOTMzMyAxNy4wNjY2IDEyLjM5OTlMMTcuMTMzMiAxNS45OTk5WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==), pointer`,
    // },

    screens: {
      es: '400px',
      xs: '576px',
      sm: '768px',
      md: '1024px',
      lg: '1200px',
      xl: '1600px',
    },
  },
  plugins: [],
  important: true,
};
