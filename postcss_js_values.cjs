const valueParser = require('postcss-values-parser');

const IMPORT_PATH_WORD = 'from';
const PATH_SEPARATOR = ':';

const postcssJsValues = (/* options */) => {
  return {
    postcssPlugin: 'postcss-js-values',
    Once(root, helpers) {
      root.walkAtRules(/value/i, atRule => {
        // Parse the value, looking for the identifying elements of an modules import.
        let fromIndex = Infinity;
        const aliases = [];
        let path;

        valueParser.parse(atRule.params).each((node, index) => {
          // If this is the "from" word, mark it's index - the next node will be the import path.
          if (node.type === 'word' && node.value === IMPORT_PATH_WORD) {
            fromIndex = index;
            return true;
          }

          // If we've not yet seen the "from" word, words potentially represent
          // imported aliases, record them.
          if (index <= fromIndex) {
            if (node.type === 'word') {
              aliases.push(node.value);
            }
            return true;
          }

          // We're at the node directly after the "from" word, record the import
          // path if we can and halt iteration.
          switch (node.type) {
            case 'quoted':
              path = node.contents;
              break;
            case 'word':
              path = node.value;
              break;
            default:
              throw node.error('Unsupported import path syntax.');
          }

          return false;
        });

        // If no import path was defined, we can assume that this @value is not
        // an import, and can leave it for other modules to handle.
        if (path == null) {
          return;
        }

        // Handle the path separator. e.g. '@canva/easel:Colors' otherwise, assume a regular import such as '@canva/easel/tokens/color'.
        const [modulePath, identifier] = path.includes(PATH_SEPARATOR)
          ? path.split(PATH_SEPARATOR, 2)
          : [path, null];

        // Try to import the path. If it doesn't exist, let the rest of the pipeline pick it up.
        let cssModule;
        try {
          cssModule = require(modulePath);
        } catch (error) {
          if (!(error instanceof Error && error.code === 'MODULE_NOT_FOUND')) {
            throw error;
          }
          return;
        }

        // If it has a default export, grab that.
        const moduleExports = cssModule.default != null ? cssModule.default : cssModule;

        // Try to look up the requested identifier - fall through if it doesn't exist.
        const cssExportedValues = identifier ? moduleExports[identifier] : moduleExports;
        if (cssExportedValues == null) {
          return;
        }

        // Grab a list of the imported tokens and transform them into @value declarations.
        const valueNodes = aliases
          .filter(name => cssExportedValues[name] != null)
          .map(name =>
            helpers.atRule({
              name: 'value',
              params: `${name}: ${cssExportedValues[name]}`,
            }),
          );

        // Replace the rule with the value nodes built earlier.
        // Note: Ensure to always replace if an identifier is used.
        if (valueNodes.length > 0 || identifier != null) {
          atRule.replaceWith(valueNodes);
        }
      });
    },
  };
};
postcssJsValues.postcss = true;

module.exports = postcssJsValues;
