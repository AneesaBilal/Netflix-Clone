/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--sf-background)',
        surface: 'var(--sf-surface)',
        'surface-hover': 'var(--sf-surface-hover)',
        'surface-2': 'var(--sf-surface-2)',
        'accent-tint': 'var(--sf-accent-tint)',
        primary: {
          DEFAULT: 'var(--sf-primary)',
          hover: 'var(--sf-primary-hover)',
        },
        'text-primary': 'var(--sf-text-primary)',
        'text-secondary': 'var(--sf-text-secondary)',
        borderc: 'var(--sf-border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
