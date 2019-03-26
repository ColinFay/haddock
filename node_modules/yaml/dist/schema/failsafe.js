"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.seq = exports.map = void 0;

var _Map = _interopRequireDefault(require("./Map"));

var _Pair = _interopRequireDefault(require("./Pair"));

var _Seq = _interopRequireDefault(require("./Seq"));

var _string = require("./_string");

var _parseMap = _interopRequireDefault(require("./parseMap"));

var _parseSeq = _interopRequireDefault(require("./parseSeq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMap(schema, obj, ctx) {
  const map = new _Map.default();

  if (obj instanceof Map) {
    for (const [key, value] of obj) {
      const k = schema.createNode(key, ctx.wrapScalars, null, ctx);
      const v = schema.createNode(value, ctx.wrapScalars, null, ctx);
      map.items.push(new _Pair.default(k, v));
    }
  } else if (obj && typeof obj === 'object') {
    map.items = Object.keys(obj).map(key => {
      const k = schema.createNode(key, ctx.wrapScalars, null, ctx);
      const v = schema.createNode(obj[key], ctx.wrapScalars, null, ctx);
      return new _Pair.default(k, v);
    });
  }

  return map;
}

function createSeq(schema, obj, ctx) {
  const seq = new _Seq.default();

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

const map = {
  createNode: createMap,
  default: true,
  nodeClass: _Map.default,
  tag: 'tag:yaml.org,2002:map',
  resolve: _parseMap.default,
  stringify: (value, ctx, onComment, onChompKeep) => value.toString(ctx, onComment, onChompKeep)
};
exports.map = map;
const seq = {
  createNode: createSeq,
  default: true,
  nodeClass: _Seq.default,
  tag: 'tag:yaml.org,2002:seq',
  resolve: _parseSeq.default,
  stringify: (value, ctx, onComment, onChompKeep) => value.toString(ctx, onComment, onChompKeep)
};
exports.seq = seq;
var _default = [map, seq, _string.str];
exports.default = _default;