import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette - warm, refined neutrals
        primary: {
          50: '#f8f6f3',
          100: '#f1ede7',
          200: '#e3ddd3',
          300: '#d4cfc5',
          400: '#a89d91',
          500: '#8b7d71',
          600: '#6e6259',
          700: '#534841',
          800: '#3a322d',
          900: '#231d19',
          950: '#1a1613',
        },
        // Tradition colors - jewel tones
        jewish: {
          50: '#f0f5ff',
          100: '#e6edff',
          200: '#ccdaff',
          300: '#99b3ff',
          400: '#668cff',
          500: '#3366ff',
          600: '#0f4c7f',
          700: '#0a3666',
          800: '#062452',
          900: '#031838',
        },
        christian: {
          50: '#fff5f5',
          100: '#ffe8e8',
          200: '#ffd4d4',
          300: '#ffadad',
          400: '#ff8686',
          500: '#ff5f5f',
          600: '#7c2d3e',
          700: '#612533',
          800: '#461c28',
          900: '#2b131d',
        },
        islamic: {
          50: '#faf5ff',
          100: '#f5ecff',
          200: '#ecd9ff',
          300: '#dab3ff',
          400: '#b580ff',
          500: '#9055ff',
          600: '#3d2a5c',
          700: '#322150',
          800: '#251844',
          900: '#1a1038',
        },
        gold: {
          50: '#fffbf0',
          100: '#fff6e0',
          200: '#ffecc0',
          300: '#ffe0a0',
          400: '#ffd480',
          500: '#d4a574',
          600: '#c29560',
          700: '#8b6f47',
          800: '#6b572f',
          900: '#4a3d1f',
        },
      },
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #1a1613 0%, #231d19 100%)',
        'gradient-jewel': 'linear-gradient(135deg, #1a1038 0%, #062452 50%, #031838 100%)',
      },
    },
  },
  plugins: [],
}
export default config
