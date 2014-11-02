var knife = require('../knife');

module.exports = {
    name: 'id-class-style',
    on: ['attr'],
    filter: ['id', 'class']
};

module.exports.lint = function (attr, opts) {
    var format = opts[this.name];
    if (!format) {
        return [];
    }

    var verify = knife.getFormatTest(format);
    return verify(attr.value) ? [] : {
        name: this.name,
        index: attr.valueIndex,
        line: attr.valueLineCol[0],
        column: attr.valueLineCol[1],
        msg: 'ids and classes must match the format: ' + format
    };
};