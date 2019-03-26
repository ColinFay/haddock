"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.boolOptions = exports.nullOptions = void 0;

var _binary = _interopRequireDefault(require("./_binary"));

var _omap = _interopRequireDefault(require("./_omap"));

var _pairs = _interopRequireDefault(require("./_pairs"));

var _set = _interopRequireDefault(require("./_set"));

var _timestamp = _interopRequireDefault(require("./_timestamp"));

var _core = require("./core");

var _failsafe = _interopRequireDefault(require("./failsafe"));

var _Scalar = _interopRequireDefault(require("./Scalar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nullOptions = {
  nullStr: 'null'
};
exports.nullOptions = nullOptions;
const boolOptions = {
  trueStr: 'true',
  falseStr: 'false'
};
exports.boolOptions = boolOptions;

var _default = _failsafe.default.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.default(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: nullOptions,
  stringify: () => nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => true,
  options: boolOptions,
  stringify: ({
    value
  }) => value ? boolOptions.trueStr : boolOptions.falseStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
  resolve: () => false,
  options: boolOptions,
  stringify: ({
    value
  }) => value ? boolOptions.trueStr : boolOptions.falseStr
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'BIN',
  test: /^0b([0-1_]+)$/,
  resolve: (str, bin) => parseInt(bin.replace(/_/g, ''), 2),
  stringify: ({
    value
  }) => '0b' + value.toString(2)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^[-+]?0([0-7_]+)$/,
  resolve: (str, oct) => parseInt(oct.replace(/_/g, ''), 8),
  stringify: ({
    value
  }) => (value < 0 ? '-0' : '0') + value.toString(8)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: str => parseInt(str.replace(/_/g, ''), 10),
  stringify: _core.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F_]+)$/,
  resolve: (str, hex) => parseInt(hex.replace(/_/g, ''), 16),
  stringify: ({
    value
  }) => (value < 0 ? '-0x' : '0x') + value.toString(16)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: _core.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?([0-9][0-9_]*)?\.[0-9_]*([eE][-+]?[0-9]+)?$/,
  resolve: str => parseFloat(str.replace(/_/g, '')),
  stringify: _core.stringifyNumber
}], _binary.default, _omap.default, _pairs.default, _set.default, _timestamp.default);

exports.default = _default;