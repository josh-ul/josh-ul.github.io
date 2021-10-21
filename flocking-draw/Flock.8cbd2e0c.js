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
})({"source/Flock.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Flock = /*#__PURE__*/function () {
  function Flock(renderer, count) {
    _classCallCheck(this, Flock);

    this.rndr = renderer;
    this.boids = [];
    this.opts = {
      count: count || 1000,
      size: 10,
      maxVel: 5,
      maxAcc: 1,
      ali: {
        rng: 40,
        scl: 2
      },
      coh: {
        rng: 80,
        scl: 1
      },
      sep: {
        rng: 20,
        scl: 4
      },
      bnd: {
        rng: 50,
        scl: 1
      }
    };
  }

  _createClass(Flock, [{
    key: "init",
    value: function init() {
      this.opts.ali.rngSqr = Math.pow(this.opts.ali.rng, 2);
      this.opts.coh.rngSqr = Math.pow(this.opts.coh.rng, 2);
      this.opts.sep.rngSqr = Math.pow(this.opts.sep.rng, 2);
      this.opts.bounds = this.rndr.viewPort;
      this.opts.wrap = new Vec2(this.opts.bounds.x + this.opts.size, this.opts.bounds.y + this.opts.size);
      this.opts.contain = new Vec2(this.opts.bounds.x - this.opts.bnd.rng, this.opts.bounds.y - this.opts.bnd.rng);
      this.posArray = new Float32Array(this.opts.count * 2);
      this.velArray = new Float32Array(this.opts.count * 2);
      var i = 0;

      for (i; i < this.opts.count; i++) {
        this.addBoid(new Vec2(Util.randInt(this.opts.bnd.rng, this.opts.contain.x), Util.randInt(this.opts.bnd.rng, this.opts.contain.y)), new Vec2(Util.randFloat(-1, 1), Util.randFloat(-1, 1)), this.opts.size, Col4.random().rgba);
        this.posArray[i * 2] = this.boids[i].pos.vec[0];
        this.posArray[i * 2 + 1] = this.boids[i].pos.vec[1];
        this.velArray[i * 2] = this.boids[i].vel.vec[0];
        this.velArray[i * 2 + 1] = this.boids[i].vel.vec[1];
      }

      this.rndr.init(this.opts.count, this.posArray, this.velArray);
    }
  }, {
    key: "run",
    value: function run() {
      var _this = this;

      this.rndr.draw(this.posArray, this.velArray);
      this.update();
      requestAnimationFrame(function () {
        _this.run();
      });
    }
  }, {
    key: "update",
    value: function update() {
      var i = 0;

      for (i; i < this.opts.count; i++) {
        this.boids[i].pos.add(this.boids[i].vel);
        this.posArray[i * 2] = this.boids[i].pos.vec[0];
        this.posArray[i * 2 + 1] = this.boids[i].pos.vec[1];
        this.velArray[i * 2] = this.boids[i].vel.vec[0];
        this.velArray[i * 2 + 1] = this.boids[i].vel.vec[1];
        this.wrap(this.boids[i]);
        this.boids[i].acc.add(this.contain(this.boids[i]));
        this.boids[i].acc.add(this.seek(this.boids[i]));
        this.boids[i].acc.add(this.oneForAll(this.boids[i]));
        this.boids[i].acc.limit(this.opts.maxAcc);
        this.boids[i].vel.add(this.boids[i].acc);
        this.boids[i].vel.limit(this.opts.maxVel);
        this.boids[i].acc.zero();
      }
    }
  }, {
    key: "wrap",
    value: function wrap(boid) {
      var wrap = false;

      if (boid.pos.x >= this.opts.wrap.x) {
        boid.pos.x = -boid.size;
        wrap = true;
      } else if (boid.pos.x <= -boid.size) {
        boid.pos.x = this.opts.wrap.x;
        wrap = true;
      }

      if (boid.pos.y >= this.opts.wrap.y) {
        boid.pos.y = -boid.size;
        wrap = true;
      } else if (boid.pos.y <= -boid.size) {
        boid.pos.y = this.opts.wrap.y;
        wrap = true;
      }

      if (wrap) {
        var j = 0;

        for (j; j < this.opts.tail; j++) {
          boid.tail[j] = boid.pos;
        }
      }
    }
  }, {
    key: "contain",
    value: function contain(boid) {
      var a = Vec2.zero();

      if (boid.pos.x >= this.opts.contain.x) {
        a.x = -1;
      } else if (boid.pos.x <= this.opts.bnd.rng) {
        a.x = 1;
      }

      if (boid.pos.y >= this.opts.contain.y) {
        a.y = -1;
      } else if (boid.pos.y <= this.opts.bnd.rng) {
        a.y = 1;
      }

      return a.normalise().mult(this.opts.bnd.scl);
    }
  }, {
    key: "seek",
    value: function seek(boid) {
      if (this.__proto__.chase) {
        var a = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(2);
        return Vec2.add(boid.vel, a).normalise().mult(1);
      } else {
        var dist = boid.pos.distSqr(this.__proto__.mouse);

        if (dist <= 30000) {
          var _a = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(10);

          return Vec2.sub(boid.vel, _a).normalise().mult(10);
        } else {
          var _a2 = Vec2.sub(this.__proto__.mouse, boid.pos).normalise().mult(2);

          return Vec2.add(boid.vel, _a2).normalise().mult(1);
        }
      }
    }
  }, {
    key: "oneForAll",
    value: function oneForAll(boid) {
      var i = 0,
          dist,
          combined = Vec2.zero();
      var ac = 0,
          cc = 0,
          sc = 0;
      var ali = Vec2.zero(),
          coh = Vec2.zero(),
          sep = Vec2.zero();

      for (i; i < this.opts.count; i++) {
        if (boid != this.boids[i]) {
          dist = boid.pos.distSqr(this.boids[i].pos);

          if (dist <= this.opts.ali.rngSqr) {
            ali.add(this.boids[i].vel);
            ac++;
          }

          if (dist <= this.opts.coh.rngSqr) {
            coh.add(this.boids[i].pos);
            cc++;
          }

          if (dist <= this.opts.sep.rngSqr) {
            sep.add(Vec2.sub(this.boids[i].pos, boid.pos).normalise().div(dist));
            sc++;
          }
        }
      }

      if (ac > 0) {
        combined.add(ali.div(ac).normalise().mult(this.opts.ali.scl));
      }

      if (cc > 0) {
        combined.add(coh.div(cc).sub(boid.pos).normalise().mult(this.opts.coh.scl));
      }

      if (sc > 0) {
        combined.add(sep.div(sc).normalise().mult(-this.opts.sep.scl));
      }

      return combined;
    }
  }, {
    key: "addBoid",
    value: function addBoid(pos, vel, size, col) {
      this.boids.push({
        pos: pos,
        vel: vel,
        acc: Vec2.zero(),
        size: size,
        col: col
      });
    }
  }, {
    key: "removeBoid",
    value: function removeBoid(index) {
      if (index > 1 && index < this.boids.count) {
        this.boids.splice(index, 1);
      } else {
        this.boids.shift();
      }
    }
  }]);

  return Flock;
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
},{}]},{},["../../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","source/Flock.js"], null)
//# sourceMappingURL=/Flock.8cbd2e0c.js.map