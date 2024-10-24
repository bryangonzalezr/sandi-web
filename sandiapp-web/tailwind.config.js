/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      'sm': '640px', // => @media (min-width: 640px) { ... }
      'md': '768px', // => @media (min-width: 768px) { ... }
      'lg': '1024px', // => @media (min-width: 1024px) { ... }
      'xl': '1280px', // => @media (min-width: 1280px) { ... }
      '2xl': '1536px', // => @media (min-width: 1536px) { ... }
      '3xl': '1920px', // => @media (min-width: 1920px) { ... }
    },
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'neutral-light': '#F0EFEB',
      'warm-beige': '#E9DBCD',
      'pink': '#ECC4DC',
      'lavender': '#EBE0FE',
      'bold-red': '#DE3E3E',
      'light-green': '#B7D0A8',
      'forest-green': '#76A95C',
      'violet': '#311B58',

    }
  },
  plugins: [],
}

