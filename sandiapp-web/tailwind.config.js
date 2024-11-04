/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      
    },
    fontFamily: {
      'Poppins': 'Poppins',
      'PoppinsBold': 'PoppinsBold'
    },
    screens: {
      'sm': '640px', // => @media (min-width: 640px) { ... }
      'md': '768px', // => @media (min-width: 768px) { ... }
      'lg': '1024px', // => @media (min-width: 1024px) { ... }
      'xl': '1280px', // => @media (min-width: 1280px) { ... }
      '2xl': '1536px', // => @media (min-width: 1536px) { ... }
      '3xl': '1920px', // => @media (min-width: 1920px) { ... }
    },
    colors: {
      'light': '#FBF8F3',
      'white': '#FFFFFF',
      'black': '#000000',
      'dark-black': '#1C1B1F',
      'light-gray': '#D4D4D4',
      'neutral-gray': '#D9D9D9',
      'dark-gray': '#7A7A7A ',
      'light-beige': '#EDDDC433',
      'neutral-beige': '#F3E6D6',
      'mid-beige': '#F7EFE4',
      'light-violet': '#EADFFF',
      'dark-violet': '#8963C7',
      'light-red': '#F5D2CE',
      'mid-red': '#EC9B98',
      'dark-red': '#DE3E3E',
      'extralight-green': '#DEE7D2', 
      'light-green': '#B9D1A7',
      'mid-green': '#B8D0A7',
      'neutral-green': '#77A95C',
      'dark-green': '#34810B',
      'light-orange': '#FCD0A7',
      'dark-orange': '#D47013',
      'dark-brown': '#5A413A'
    },
    animation: {
      'spin-slow' : 'spin 3s linear infinite',
      'blink': 'blink 1.8s infinite both'
    },    
    keyframes: {
      blink: {
        '0%, 100%': { opacity: 0 },
        '50%': { opacity: 1 },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    },
  },
  plugins: [],
}

