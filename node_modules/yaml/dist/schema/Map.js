"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPair = findPair;
exports.default = void 0;

var _toJSON = _interopRequireDefault(require("../toJSON"));

var _Collection = _interopRequireDefault(require("./Collection"));

var _Merge = _interopRequireDefault(require("./Merge"));

var _Pair = _interopRequireDefault(require("./Pair"));

var _Scalar = _interopRequireDefault(require("./Scalar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Published as 'yaml/map'
function findPair(items, key) {
  const k = key instanceof _Scalar.default ? key.value : key;

  for (const it of items) {
    if (it instanceof _Pair.default) {
      if (it.key === key || it.key === k) return it;
      if (it.key && it.key.value === k) return it;
    }
  }

  return undefined;
}

class YAMLMap extends _Collection.default {
  add(pair) {
    if (!pair) pair = new _Pair.default(pair);else if (!(pair instanceof _Pair.default)) pair = new _Pair.default(pair.key || pair, pair.value);
    const prev = findPair(this.items, pair.key);
    if (prev) throw new Error(`Key ${pair.key} already set`);
    this.items.push(pair);
  }

  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it && it.value;
    return !keepScalar && node instanceof _Scalar.default ? node.value : node;
  }

  has(key) {
    return !!findPair(this.items, key);
  }

  set(key, value) {
    const prev = findPair(this.items, key);
    if (prev) prev.value = value;else this.items.push(new _Pair.default(key, value));
  }

  toJSON(_, ctx) {
    if (ctx && ctx.mapAsMap) return this.toJSMap(ctx);
    const map = {};
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) {
      if (item instanceof _Merge.default) {
        // If the value associated with a merge key is a single mapping node,
        // each of its key/value pairs is inserted into the current mapping,
        // unless the key already exists in it. If the value associated with the
        // merge key is a sequence, then this sequence is expected to contain
        // mapping nodes and each of these nodes is merged in turn according to
        // its order in the sequence. Keys in mapping nodes earlier in the
        // sequence override keys specified in later mapping nodes.
        // -- http://yaml.org/type/merge.html
        const keys = Object.keys(map);
        const {
          items
        } = item.value;

        for (let i = items.length - 1; i >= 0; --i) {
          const {
            source
          } = items[i];

          if (source instanceof YAMLMap) {
            const obj = source.toJSON('', ctx);
            Object.keys(obj).forEach(key => {
              if (!keys.includes(key)) map[key] = obj[key];
            });
          } else {
            throw new Error('Merge sources must be maps');
          }
        }
      } else {
        const {
          stringKey,
          value
        } = item;
        map[stringKey] = (0, _toJSON.default)(value, stringKey, ctx);
      }
    }

    return map;
  }

  toJSMap(ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) {
      if (item instanceof _Merge.default) {
        const {
          items
        } = item.value;

        for (let i = items.length - 1; i >= 0; --i) {
          const {
            source
          } = items[i];

          if (source instanceof YAMLMap) {
            for (const [key, value] of source.toJSMap(ctx)) {
              if (!map.has(key)) map.set(key, value);
            }
          } else {
            throw new Error('Merge sources must be maps');
          }
        }
      } else {
        const key = (0, _toJSON.default)(item.key, '', ctx);
        const value = (0, _toJSON.default)(item.value, key, ctx);
        map.set(key, value);
      }
    }

    return map;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);

    for (const item of this.items) {
      if (!(item instanceof _Pair.default)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }

    return super.toString(ctx, {
      blockItem: n => n.str,
      flowChars: {
        start: '{',
        end: '}'
      },
      isMap: true,
      itemIndent: ctx.indent || ''
    }, onComment, onChompKeep);
  }

}

exports.default = YAMLMap;