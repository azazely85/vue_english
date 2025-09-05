const rtl = require('postcss-rtl')
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer(),
    rtl()
  ],
}
