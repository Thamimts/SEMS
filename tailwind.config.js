/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0e17',
          dark: '#0f1629',
          panel: '#141c2f',
          border: '#1e2a45',
          red: '#ff2d55',
          'red-glow': '#ff0844',
          blue: '#00d4ff',
          'blue-dim': '#0099cc',
          green: '#00ff88',
          amber: '#ffb800',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-red': '0 0 30px rgba(255, 45, 85, 0.5)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        siren: 'siren 1s ease-in-out infinite alternate',
        scan: 'scan 2s linear infinite',
      },
      keyframes: {
        siren: {
          '0%': { opacity: '0.4', filter: 'hue-rotate(0deg)' },
          '100%': { opacity: '1', filter: 'hue-rotate(30deg)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
