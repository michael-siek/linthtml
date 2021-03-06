const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "id-no-dup",
  table: {},
  on: ["dom"],
  need: "dom"
};

module.exports.end = function() {
  // wipe previous table
  this.table = {};
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false) {
    return;
  }
  const id = element.attribs.id;
  if (id) {
    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(id.value)) {
      return [];
    }
    // element has a duplicate id
    if (this.table[id.value] !== undefined) {
      report({
        code: "E012",
        position: id.valueLineCol,
        meta: {
          data: {
            id: id.value
          }
        }
      });
    }
    // if we haven't seen the id before, remember it
    // and pass the element
    this.table[id.value] = element;
  }
};
