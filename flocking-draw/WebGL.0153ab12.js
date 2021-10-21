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
})({"source/WebGL.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebGL = /*#__PURE__*/function () {
  function WebGL(canvas) {
    _classCallCheck(this, WebGL);

    this.gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true
    });

    if (this.gl === null) {
      console.log("Unable to initialize WebGl.");
      return;
    }

    this.viewPort = new Vec2(this.gl.canvas.width, this.gl.canvas.height); // const gl = this.gl;
    //
    // this.gl.ext = {
    //     extensions: {
    //         "ANGLE_instanced_arrays": gl.getExtension("ANGLE_instanced_arrays")
    //     },
    //
    //     vertexAttribDivisor: function(a, b) {
    //         this.extensions["ANGLE_instanced_arrays"].vertexAttribDivisorANGLE(a, b);
    //     },
    //
    //     drawArraysInstanced: function(a, b, c, d) {
    //         this.extensions["ANGLE_instanced_arrays"].drawArraysInstancedANGLE(a, b, c, d);
    //     }
    // };
  }

  _createClass(WebGL, [{
    key: "init",
    value: function init(count, pos, vel) {
      var gl = this.gl;
      var vsSource = this.vertexShader();
      var fsSource = this.fragmentShader();
      var shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);
      var programInfo = {
        program: shaderProgram,
        attributeLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          offsetPosition: gl.getAttribLocation(shaderProgram, "aOffsetPosition"),
          targetDirection: gl.getAttribLocation(shaderProgram, "aTargetDirection")
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
        }
      };
      var buffers = {
        vertexPosition: this.initBuffer(gl, gl.STATIC_DRAW, this.simpleTriangle(), 4, 2, -1),
        offsetPosition: this.initBuffer(gl, gl.DYNAMIC_DRAW, pos, count, 2, 1),
        targetDirection: this.initBuffer(gl, gl.DYNAMIC_DRAW, vel, count, 2, 1)
      };
      this.buffers = buffers;
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);
      var orthographicMatrix = mat4.create();
      mat4.ortho(orthographicMatrix, 0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, 0.0, 1.0);
      var modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, 0.0]);
      gl.useProgram(programInfo.program);
      gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, orthographicMatrix);
      gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix); //gl.useProgram(null);

      this.vao = this.initVao(gl, buffers, programInfo);
    }
  }, {
    key: "draw",
    value: function draw(pos, vel) {
      // this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BIT);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.offsetPosition.handle);
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, pos);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.targetDirection.handle);
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, vel);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindVertexArray(this.vao);
      this.gl.drawArraysInstanced(this.gl.LINE_LOOP, 0, this.buffers.vertexPosition.count, this.buffers.offsetPosition.count);
      this.gl.bindVertexArray(null);
    }
  }, {
    key: "initVao",
    value: function initVao(gl, buffers, shader) {
      var vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      for (var _i = 0, _Object$keys = Object.keys(buffers); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[key].handle);
        gl.vertexAttribPointer(shader.attributeLocations[key], buffers[key].components, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.attributeLocations[key]);

        if (buffers[key].div >= 0) {
          gl.vertexAttribDivisor(shader.attributeLocations[key], buffers[key].div);
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);
      return vao;
    }
  }, {
    key: "initBuffer",
    value: function initBuffer(gl, type, data, count, components, div) {
      var buffer = {
        handle: gl.createBuffer(),
        count: count,
        components: components,
        div: div
      };
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.handle);
      gl.bufferData(gl.ARRAY_BUFFER, data, type);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      return buffer;
    }
  }, {
    key: "initShaderProgram",
    value: function initShaderProgram(gl, vsSource, fsSource) {
      var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
      var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
      }

      return shaderProgram;
    }
  }, {
    key: "loadShader",
    value: function loadShader(gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    }
  }, {
    key: "vertexShader",
    value: function vertexShader() {
      return "#version 300 es\n            in vec2 aVertexPosition;\n            in vec2 aOffsetPosition;\n            in vec2 aTargetDirection;\n\n            uniform mat4 uModelViewMatrix;\n            uniform mat4 uProjectionMatrix;\n\n            out vec3 col;\n\n            vec3 vert;\n            vec3 dir;\n            vec3 tar;\n\n            float cos;\n            float sin;\n\n            mat3 rot;\n\n            vec3 new;\n            vec4 pos;\n\n            vec2 rg;\n\n            float PHI = 1.61803398874989484820459;\n\n            float gold_noise(in vec2 xy, in float seed){\n                   return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);\n            }\n\n            void main() {\n                vert = vec3(aVertexPosition, 0.0);\n                dir = normalize(vec3(0.0, -1.0, 0.0));\n                tar = normalize(vec3(aTargetDirection, 0.0));\n\n                cos = dot(dir, tar);\n                sin = length(cross(dir, tar));\n\n                rot = mat3(\n                    cos,   -sin,   0.0,\n                    sin,   cos,    0.0,\n                    0.0,   0.0,    0.0\n                );\n\n                if (tar.x < 0.0) {\n                    new = rot * vert;\n                }\n                else {\n                    new = vert * rot;\n                }\n\n                pos = vec4(new.xy + aOffsetPosition, 0.0, 1.0);\n                gl_Position = uProjectionMatrix * uModelViewMatrix * pos;\n\n                // rg = (gl_Position.xy + vec2(1.0, 1.0)) * 0.5;\n                // col = normalize(vec3(rg, (tar.x + tar.y) * 0.5));\n\n                // col = normalize(vec3(\n                    // gold_noise(vec2(float(gl_InstanceID)), aVertexPosition.x),\n                    // gold_noise(vec2(float(gl_InstanceID) + aVertexPosition.x), aVertexPosition.y),\n                    // gold_noise(vec2(float(gl_InstanceID)) + aVertexPosition.y, float(gl_VertexID))\n                // ));\n\n                col = vec3(\n                    gold_noise(vec2(1.5, 2.2) + aVertexPosition, float(gl_InstanceID + 1)),\n                    gold_noise(vec2(4.1, 3.2) + aVertexPosition, float(gl_InstanceID + 2)),\n                    gold_noise(vec2(6.1, 3.2) + aVertexPosition, float(gl_InstanceID + 3))\n                );\n\n                gl_PointSize = 1.0;\n            }\n        ";
    }
  }, {
    key: "fragmentShader",
    value: function fragmentShader() {
      return "#version 300 es\n            precision mediump float;\n\n            in vec3 col;\n            out vec4 fragColor;\n\n            void main() {\n                fragColor = vec4(col, 1.6);\n            }\n        ";
    }
  }, {
    key: "simpleTriangle",
    value: function simpleTriangle() {
      // return new Float32Array([
      //      0, -10,
      //      5,  5,
      //     -5,  5,
      //      0,  10
      // ]);
      // return new Float32Array([
      //     -5,    2,
      //     0,     -10,
      //     0,     0,
      //     5,     2
      // ]);
      return new Float32Array([-5, 5, 0, -10, 5, 5, 0, 0]); // return new Float32Array([
      //     -1,    1,
      //     -1,     -1,
      //     1,     -1,
      //     1,     1
      // ]);
      // return new Float32Array([
      //     1,    5,
      //     10,     10,
      //     15,     15,
      //     20,     20
      // ]);
    }
  }]);

  return WebGL;
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
},{}]},{},["../../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","source/WebGL.js"], null)
//# sourceMappingURL=/WebGL.0153ab12.js.map