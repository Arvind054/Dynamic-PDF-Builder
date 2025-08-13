/**** Tailwind CSS Configuration ****/
/** Tailwind v4 config (minimal). Customize theme extensions here if needed. */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'focus-ring': '0 0 0 3px rgba(37,99,235,0.5)'
      }
    }
  },
  plugins: []
};
