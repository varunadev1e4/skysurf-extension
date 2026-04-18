/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          orange:     '#FF3D00',
          'orange-light': '#FF6B3D',
          'orange-pale':  '#FFF0EB',
          deep:       '#06558D',
          mid:        '#1B76B8',
          light:      '#D6EAF2',
          surface:    '#F5F8FB',
          border:     '#E4EAF0',
          mute:       '#7A8597',
        },
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #06558D 0%, #1B76B8 60%, #D6EAF2 100%)',
        'brand-top':  'linear-gradient(180deg, #06558D 0%, #1B76B8 100%)',
      },
      boxShadow: {
        card: '0 2px 12px rgba(6,85,141,0.10)',
        modal: '0 24px 64px rgba(6,85,141,0.18)',
      },
    },
  },
  plugins: [],
}
