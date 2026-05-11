// Tailwind CSS v4 uses @tailwindcss/postcss instead of the old tailwindcss + autoprefixer combo.
// autoprefixer is no longer needed as Tailwind v4 handles vendor prefixes natively.

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
