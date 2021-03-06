const knife = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-close",
  on: ["dom"],
  need: "dom",
  options: [

    // REMOVE: For the v1
    {
    },
    // REMOVE: For the v1
    {
      name: "tag-name-match"
    },
    {
      name: "tag-self-close",
      validateConfig(option) {
        if (typeof option !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
        }
        if (["always", "never"].indexOf(option) === -1) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "always" and "never".`);
        }
        return option;
      }
    }
  ]
};

// function isSelfClosing
module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false) {
    return;
  }
  const { name, close } = element;

  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.toLowerCase()) {
    if (knife.isVoidElement(element.name)) {
      const selfClose = knife.isSelfClosing(element);
      const style = opts["tag-self-close"];
      if (
        (style === "always" && !selfClose) ||
        (style === "never" && selfClose)
      ) {
        report({
          code: "E018",
          position: element.openLineCol,
          meta: {
            data: {
              expect: style
            }
          }
        });
      }
    } else {
      if (opts["tag-close"]) {
        report({
          code: "E042",
          position: element.openLineCol
        });
      }
    }
  } else {
    if (opts["tag-name-match"] && element.name !== element.close) {
      report({
        code: "E030",
        position: element.closeLineCol
      });
    }
  }
};
