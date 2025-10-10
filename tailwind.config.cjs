module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        tile: 'var(--radius-tile)',
      },
      boxShadow: {
        tile: 'var(--shadow-tile)',
      },
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        surfaceMuted: 'hsl(var(--surface-muted) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        text: 'hsl(var(--text) / <alpha-value>)',
        textMuted: 'hsl(var(--text-muted) / <alpha-value>)',

        accent50: 'hsl(var(--accent-50) / <alpha-value>)',
        accent100: 'hsl(var(--accent-100) / <alpha-value>)',
        accent300: 'hsl(var(--accent-300) / <alpha-value>)',
        accent500: 'hsl(var(--accent-500) / <alpha-value>)',
        accent600: 'hsl(var(--accent-600) / <alpha-value>)',

        info50: 'hsl(var(--info-50) / <alpha-value>)',
        info100: 'hsl(var(--info-100) / <alpha-value>)',
        info300: 'hsl(var(--info-300) / <alpha-value>)',
        info500: 'hsl(var(--info-500) / <alpha-value>)',
        info600: 'hsl(var(--info-600) / <alpha-value>)',

        danger50: 'hsl(var(--danger-50) / <alpha-value>)',
        danger100: 'hsl(var(--danger-100) / <alpha-value>)',
        danger300: 'hsl(var(--danger-300) / <alpha-value>)',
        danger500: 'hsl(var(--danger-500) / <alpha-value>)',
        danger600: 'hsl(var(--danger-600) / <alpha-value>)',

        focus: 'hsl(var(--focus-ring) / <alpha-value>)',
        brand500: 'hsl(var(--brand-500) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
