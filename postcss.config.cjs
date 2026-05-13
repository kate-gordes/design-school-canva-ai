const path = require('path');

module.exports = {
  plugins: [
    require('./postcss_easel_patch.cjs'),
    require('./postcss_js_values.cjs'),
    require('postcss-modules-values-replace'),
  ],
};
