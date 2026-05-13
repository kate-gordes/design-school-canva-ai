const postcssEaselPatch = (/* options */) => {
  return {
    postcssPlugin: 'postcss-cleanup',
    Once(root, helpers) {
      // Easel generates data urls without quotes which causes
      // issues with postcss-modules-values-replace
      root.walkDecls(/(src|.*mask-image|background-image)/, decl => {
        if (decl.value.includes('url(data:')) {
          const newRule = helpers.decl({
            prop: decl.prop,
            value: decl.value.replace(/url\((data:[^)]+?)\)/g, 'url("$1")'),
            important: decl.important,
          });
          decl.replaceWith(newRule);
        }
      });
    },
  };
};
postcssEaselPatch.postcss = true;

module.exports = postcssEaselPatch;
