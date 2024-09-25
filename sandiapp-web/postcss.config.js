export default {
  parser: "postcss-comment",
  plugins: {
    "postcss-import": {},
    "postcss-simple-vars": {},
    "tailwindcss/nesting": "postcss-nested",
    tailwindcss: {},
    autoprefixer: {},
  },
};