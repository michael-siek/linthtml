const Issue = require("../../issue");
const { isRegExp } = require("util");

module.exports = {
  name: "attr-order",
  on: ["tag"],
  desc: [
    "A list of attribute names, or `false`. If set, any attributes present in",
    "the list must be ordered as they are in the list."
  ].join("\n"),
  process(opts) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected (string|RegExp)[] got ${type}`;
    if (Array.isArray(opts)) {
      opts = opts.map(opt => {
        let type = typeof opt;
        if (type === "string") {
          return opt.toLowerCase();
        }
        if (isRegExp(opt)) {
          return opt;
        }
        throw new Error(typeError(`${type}[]`));
      });
      return opts;
    }
    throw new Error(typeError(typeof opts));
  }
};

module.exports.lint = function(element, opts) {
  var order = opts[this.name],
    attrs = element.attribs,
    lastpos = 0,
    lastname,
    issues = [],
    matched = {};
  order.forEach(function(name) {
    if (isRegExp(name)) {
      var prevpos = lastpos,
        prevname = lastname;
      Object.keys(attrs).forEach(function(n) {
        if (matched[n] || !name.test(n)) {
          return;
        }
        var a = attrs[n];
        matched[n] = true;
        var pos = a.nameIndex;
        n += " (" + name + ")"; // For error output
        if (pos > lastpos) {
          lastpos = pos;
          lastname = n;
          // Check only fails if keys are not ordered by insertion
          /* istanbul ignore else */
        } else if (pos < prevpos) {
          issues.push(
            new Issue("E043", a.nameLineCol, {
              attribute: prevname,
              previous: n
            })
          );
        }
      });
    } else {
      if (!attrs.hasOwnProperty(name)) {
        return;
      }
      var a = attrs[name];
      matched[name] = true;
      var pos = a.nameIndex;
      if (pos > lastpos) {
        lastpos = pos;
        lastname = name;
      } else {
        issues.push(
          new Issue("E043", a.nameLineCol, {
            attribute: lastname,
            previous: name
          })
        );
      }
    }
  });

  return issues;
};