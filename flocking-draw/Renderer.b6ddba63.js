// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"source/Renderer.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Renderer = /*#__PURE__*/function () {
  function Renderer(canvas) {
    _classCallCheck(this, Renderer);

    this.canvas = canvas; //this.context = this.canvas.getContext("2d");
  }

  _createClass(Renderer, [{
    key: "init",
    value: function init() {
      this.viewPort = new Vec2(this.canvas.width, this.canvas.height);
      this.PI2 = 2 * Math.PI;
      this.PIs = Math.PI / 4;
      this.PIe = Math.PI / 2; //this.context.fillStyle = 'rgba(150, 150, 150, 1)';
      //this.context.fillRect(0, 0, ...this.viewPort.vec);
      //this.context.lineWidth = 1;
      //this.context.lineCap = "round";
      //this.context.strokeStyle = 'rgba(150, 150, 150, 1)';
    }
  }, {
    key: "getViewPort",
    get: function get() {
      return this.viewPort;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this$context;

      this.context.fillStyle = 'rgba(230, 230, 230, 1)';

      (_this$context = this.context).fillRect.apply(_this$context, [0, 0].concat(_toConsumableArray(this.viewPort.vec)));

      this.context.fillStyle = 'rgba(200, 200, 200, 0.5)';
    }
  }, {
    key: "boid",
    value: function boid(_boid) {
      var _this$context2, _this$context3;

      var dir = Vec2.normalise(_boid.vel).mult(_boid.size);
      var p1 = Vec2.add(_boid.pos, dir);
      var start = Math.PI - Math.atan2.apply(Math, _toConsumableArray(dir.vec)) + this.PIs;
      this.context.beginPath();

      (_this$context2 = this.context).moveTo.apply(_this$context2, _toConsumableArray(p1.vec));

      (_this$context3 = this.context).arc.apply(_this$context3, _toConsumableArray(_boid.pos.vec).concat([_boid.size, start, start + this.PIe]));

      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }
  }, {
    key: "boidLine",
    value: function boidLine(boid, seg) {
      var _this$context4, _this$context5;

      //const dir = Vec2.normalise(boid.vel).mult(boid.size);
      //const p1 = boid.pos;
      //const p2 = Vec2.add(boid.pos, boid.vel);
      //this.context.strokeStyle = boid.col;
      this.context.beginPath();

      (_this$context4 = this.context).moveTo.apply(_this$context4, _toConsumableArray(boid.pos.vec)); //let j = seg - 1;
      //for (j; j >= 0; j--) {


      (_this$context5 = this.context).lineTo.apply(_this$context5, _toConsumableArray(boid.tail[0].vec)); //}


      this.context.stroke();
    }
  }, {
    key: "boidPoint",
    value: function boidPoint(boid) {
      var _this$context6;

      this.context.beginPath();

      (_this$context6 = this.context).arc.apply(_this$context6, _toConsumableArray(boid.pos.vec).concat([5, 0, this.PI2]));

      this.context.fill();
      this.context.stroke();
    }
  }, {
    key: "boidCircle",
    value: function boidCircle(boid) {
      var _this$context7;

      this.context.beginPath();

      (_this$context7 = this.context).arc.apply(_this$context7, _toConsumableArray(boid.pos.vec).concat([boid.size, 0, this.PI2]));

      this.context.stroke();
    }
  }, {
    key: "boidTriangle",
    value: function boidTriangle(boid) {
      var _this$context8, _this$context9, _this$context10, _this$context11;

      var dir = Vec2.normalise(boid.vel).mult(boid.size * 1.8);
      var p1 = Vec2.add(boid.pos, dir);
      dir.mult(0.3);
      var p2 = Vec2.add(boid.pos, new Vec2(dir.y, -dir.x));
      var p3 = Vec2.add(boid.pos, new Vec2(-dir.y, dir.x));
      dir.mult(-1.5);

      (_this$context8 = this.context).translate.apply(_this$context8, _toConsumableArray(dir.vec));

      this.context.beginPath();

      (_this$context9 = this.context).moveTo.apply(_this$context9, _toConsumableArray(p1.vec));

      (_this$context10 = this.context).lineTo.apply(_this$context10, _toConsumableArray(p2.vec));

      (_this$context11 = this.context).lineTo.apply(_this$context11, _toConsumableArray(p3.vec));

      this.context.fill();
      this.context.closePath();
      this.context.stroke();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }, {
    key: "boidArrow",
    value: function boidArrow(boid) {
      var _this$context12, _this$context13, _this$context14, _this$context15, _this$context16;

      var dir = Vec2.normalise(boid.vel).mult(boid.size * 1.8);
      var p1 = Vec2.add(boid.pos, dir);
      dir.mult(0.3);
      var p2 = Vec2.add(boid.pos, new Vec2(dir.y, -dir.x));
      var p3 = Vec2.add(boid.pos, new Vec2(-dir.y, dir.x));
      var p4 = Vec2.add(boid.pos, dir);
      dir.mult(-1.5);

      (_this$context12 = this.context).translate.apply(_this$context12, _toConsumableArray(dir.vec));

      this.context.beginPath();

      (_this$context13 = this.context).moveTo.apply(_this$context13, _toConsumableArray(p1.vec));

      (_this$context14 = this.context).lineTo.apply(_this$context14, _toConsumableArray(p2.vec));

      (_this$context15 = this.context).lineTo.apply(_this$context15, _toConsumableArray(p4.vec));

      (_this$context16 = this.context).lineTo.apply(_this$context16, _toConsumableArray(p3.vec));

      this.context.fill();
      this.context.closePath();
      this.context.stroke();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }, {
    key: "boidSegments",
    value: function boidSegments(boid, seg) {
      var _this$context17, _this$context19;

      this.context.beginPath();

      (_this$context17 = this.context).arc.apply(_this$context17, _toConsumableArray(boid.pos.vec).concat([boid.size, 0, this.PI2]));

      this.context.stroke();
      var j = seg - 3;
      var k = 1.2;

      for (j; j >= 0; j = j - 3) {
        var _this$context18;

        this.context.beginPath();

        (_this$context18 = this.context).arc.apply(_this$context18, _toConsumableArray(boid.tail[j].vec).concat([boid.size / k, 0, this.PI2]));

        this.context.stroke();
        k += 0.2;
      }

      this.context.beginPath();

      (_this$context19 = this.context).moveTo.apply(_this$context19, _toConsumableArray(boid.pos.vec));

      var i = seg - 1;

      for (i; i >= 0; i--) {
        var _this$context20;

        (_this$context20 = this.context).lineTo.apply(_this$context20, _toConsumableArray(boid.tail[i].vec));
      }

      this.context.stroke();
    }
  }, {
    key: "line",
    value: function line(p1, p2) {
      var _this$context21, _this$context22;

      this.context.beginPath();

      (_this$context21 = this.context).moveTo.apply(_this$context21, _toConsumableArray(p1.vec));

      (_this$context22 = this.context).lineTo.apply(_this$context22, _toConsumableArray(p2.vec));

      this.context.stroke();
    }
  }]);

  return Renderer;
}();
},{}],"../../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51763" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","source/Renderer.js"], null)
//# sourceMappingURL=/Renderer.b6ddba63.js.map