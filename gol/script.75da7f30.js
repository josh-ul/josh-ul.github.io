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
})({"gol/GoL.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class GoL {
  constructor(s) {
    this.size = s;
    this.cells = [];

    for (let j = 0; j < this.size; j++) {
      this.cells[j] = [];

      for (let i = 0; i < this.size; i++) {
        this.cells[j][i] = 0;
      }
    }
  }

  clear() {
    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size; i++) {
        this.cells[j][i] = 0;
      }
    }
  }

  random(bias = 0.5) {
    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size; i++) {
        this.cells[j][i] = Math.random() >= bias ? 1 : 0;
      }
    }
  }

  setPattern(pattern, x = 0, y = 0) {
    this.clear();

    for (let i = 0; i < pattern.length; i++) {
      this.cells[pattern[i][1] + y][pattern[i][0] + x] = 1;
    }
  }

  setPattern_rle(pattern, x = 0, y = 0) {
    for (let j = 0; j < pattern.length; j++) {
      for (let i = 0; i < pattern[j].length; i++) {
        this.cells[j + y][i + x] = pattern[j][i];
      }
    }
  }

  repack() {
    const array = [];

    for (let j = this.size - 1; j >= 0; j--) {
      for (let i = 0; i < this.size; i++) {
        if (this.cells[j][i]) array.push(255, 255, 255, 255);else array.push(0, 0, 0, 0);
      }
    }

    return new Uint8Array(array);
  }

  async patternFromUrl_Life_1_06(url) {
    const res = await fetch(url);
    const txt = await res.text();
    const pattern = txt.split('\n');
    if (pattern[0] !== '#Life 1.06') return [];
    pattern.shift();
    pattern.pop();
    pattern.forEach((e, i, a) => {
      a[i] = e.split(' ').map(e => parseInt(e));
    });
    return pattern;
  }

  async patternFromUrl_rle(url) {
    const res = await fetch(url);
    const txt = await res.text();
    const noComments = txt.replace(/^#.*\n?/gm, '');
    const size = noComments.match(/[x|y]\s=\s\d+/g).map(e => parseInt(e.match(/\d+/)));
    let pattern = noComments.replace(/^.*[rule].*$/m, '');
    pattern = pattern.replace(/\n|!$/gm, '').split('$');
    const array = pattern.map(row => {
      let strings = row.match(/\d*[o|b]/g);
      let temp = [];
      strings.forEach(e => {
        let run = parseInt(e.match(/\d+/)) || 1;
        let tag = e.match(/[b|o]/);

        for (let i = 0; i < run; i++) {
          if (tag[0] === 'b') temp.push(0);else temp.push(1);
        }
      });
      return temp;
    });
    return array;
  }

}

var _default = GoL;
exports.default = _default;
},{}],"swgl/source/Program.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Program {
  constructor(gl, vs, fs) {
    this.gl = gl;
    this.vs = vs;
    this.fs = fs;
    this.binding = null;
    this.locations = {};
  }

  init() {
    this.binding = this.gl.createProgram();
    this.gl.attachShader(this.binding, this.vs.binding);
    this.vs.delete();
    this.gl.attachShader(this.binding, this.fs.binding);
    this.fs.delete();
    this.gl.linkProgram(this.binding);

    if (!this.gl.getProgramParameter(this.binding, this.gl.LINK_STATUS)) {
      console.log("Unable to initialize the shader program:\n" + this.gl.getProgramInfoLog(this.binding));
      this.gl.deleteProgram(this.binding);
      return null;
    }

    return this;
  }

  use() {
    this.gl.useProgram(this.binding);
    return this;
  }

  uniforms(a) {
    this.use();
    a.forEach(u => {
      //this.gl[u.type](this.gl.getUniformLocation(this.binding, u.name), u.value);
      if (!this.hasOwnProperty(u.name)) {
        this.locations[u.name] = this.gl.getUniformLocation(this.binding, u.name);
      }

      this.gl[u.type](this.locations[u.name], u.value);
    });
    return this;
  }

  unset() {
    this.gl.useProgram(null);
  }

  delete() {
    this.gl.deleteProgram(this.binding);
  }

}

var _default = Program;
exports.default = _default;
},{}],"swgl/source/Shader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Shader {
  constructor(gl, type, source) {
    this.gl = gl;
    this.type = type;
    this.source = source;
    this.binding = null;
  }

  init() {
    this.binding = this.gl.createShader(this.gl[this.type]);
    this.gl.shaderSource(this.binding, this.source);
    this.gl.compileShader(this.binding);

    if (!this.gl.getShaderParameter(this.binding, this.gl.COMPILE_STATUS)) {
      console.log("An error occurred compiling the shaders:\n" + this.gl.getShaderInfoLog(this.binding));
      this.gl.deleteShader(this.shader);
      return null;
    }

    return this;
  }

  delete() {
    this.gl.deleteShader(this.binding);
    return this;
  }

}

var _default = Shader;
exports.default = _default;
},{}],"swgl/source/Texture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Texture {
  constructor(gl, data) {
    this.gl = gl;
    this.binding = null;
    this.unit = null;
    this.width = data.width;
    this.height = data.height;
    this.data = data.data;
    this.target = data.target;
    this.params = data.params;
  }

  init() {
    this.binding = this.gl.createTexture();
    this.bind(0);
    this.gl.texImage2D(this.gl[this.target], 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data);
    this.params.forEach(e => {
      this.gl.texParameteri(this.gl[this.target], this.gl[e.pname], this.gl[e.param]);
    });
    this.unbind();
    return this;
  }

  bind(unit) {
    this.unit = unit;
    this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
    this.gl.bindTexture(this.gl[this.target], this.binding);
    return this;
  }

  unbind() {
    if (this.unit !== null) {
      this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
      this.gl.bindTexture(this.gl[this.target], null);
      this.unit = null;
    }

    return this;
  }

  delete() {
    this.gl.deleteTexture(this.binding);
    return this;
  }

  set(w, h, source) {
    this.bind(0);
    this.gl.texImage2D(this.gl[this.target], 0, this.gl.RGBA, w, h, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
    this.unbind();
    return this;
  }

}

var _default = Texture;
exports.default = _default;
},{}],"swgl/source/VertexArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class VertexArray {
  constructor(gl, data) {
    this.gl = gl;
    this.data = data;
    this.binding = null;
  }

  init() {
    this.binding = this.gl.createVertexArray();
    this.bind();
    this.data.forEach(e => {
      e.buffer.init();
      e.attribs.forEach(a => {
        a.init();
      });
    });
    this.unbind();
    this.data.forEach(e => {
      e.buffer.unbind();
    });
    return this;
  }

  bind() {
    this.gl.bindVertexArray(this.binding);
    return this;
  }

  unbind() {
    this.gl.bindVertexArray(null);
    return this;
  }

  delete() {
    this.data.forEach(e => {
      e.buffer.delete();
    });
    this.gl.deleteVertexArray(this.binding);
  }

}

var _default = VertexArray;
exports.default = _default;
},{}],"swgl/source/VertexBuffer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class VertexBuffer {
  constructor(gl, data) {
    this.gl = gl;
    this.binding = null;
    this.target = data.target;
    this.data = data.data;
    this.usage = data.usage;
  }

  init() {
    this.binding = this.gl.createBuffer();
    this.bind();
    this.gl.bufferData(this.gl[this.target], this.data, this.gl[this.usage]);
    return this;
  }

  bind() {
    this.gl.bindBuffer(this.gl[this.target], this.binding);
    return this;
  }

  unbind() {
    this.gl.bindBuffer(this.gl[this.target], null);
    return this;
  }

  delete() {
    this.gl.deleteBuffer(this.binding);
  }

}

var _default = VertexBuffer;
exports.default = _default;
},{}],"swgl/source/VertexAttribs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class VertexAttribs {
  constructor(gl, data) {
    this.gl = gl;
    this.index = data.index;
    this.size = data.size;
    this.type = data.type;
    this.normalized = data.normalized;
    this.stride = data.stride;
    this.offset = data.offset;
  }

  init() {
    this.gl.enableVertexAttribArray(this.index);
    this.gl.vertexAttribPointer(this.index, this.size, this.gl[this.type], this.gl[this.normalized], this.stride, this.offset);
    return this;
  }

}

var _default = VertexAttribs;
exports.default = _default;
},{}],"swgl/source/FrameBuffer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FrameBuffer {
  constructor(gl, data) {
    this.gl = gl;
    this.binding = null;
    this.w = data.width;
    this.h = data.height;
    this.textures = data.textures;
  }

  init() {
    this.binding = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.binding);
    let att = [];
    this.textures.forEach(t => {
      att.push(this.gl[t.attachment]);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl[t.attachment], this.gl.TEXTURE_2D, t.binding, 0);
    });
    this.gl.drawBuffers(att);

    if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
      console.log("Unable to create frame buffer");
    }

    return this;
  }

  bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.binding);
    this.gl.viewport(0, 0, this.w, this.h);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.BLEND);
    return this;
  }

  unbind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return this;
  }

  delete() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.deleteFramebuffer(this.binding);
  }

}

var _default = FrameBuffer;
exports.default = _default;
},{}],"swgl/SimpleWebGL.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Program = _interopRequireDefault(require("./source/Program.js"));

var _Shader = _interopRequireDefault(require("./source/Shader.js"));

var _Texture = _interopRequireDefault(require("./source/Texture.js"));

var _VertexArray = _interopRequireDefault(require("./source/VertexArray.js"));

var _VertexBuffer = _interopRequireDefault(require("./source/VertexBuffer.js"));

var _VertexAttribs = _interopRequireDefault(require("./source/VertexAttribs.js"));

var _FrameBuffer = _interopRequireDefault(require("./source/FrameBuffer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SimpleWebGL {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");

    if (this.gl === null) {
      console.log("Unable to initialize WebGl.");
      return;
    }

    this.SIZE_OF_FLOAT = 4;
    this.init();
    this.resize();
  }

  init() {
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.frontFace(this.gl.CCW);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
    this.gl.getExtension('EXT_color_buffer_float');
  }

  resize() {
    if (this.gl.canvas.width !== this.gl.canvas.clientWidth) {
      this.gl.canvas.width = this.gl.canvas.clientWidth;
    }

    if (this.gl.canvas.height !== this.gl.canvas.clientHeight) {
      this.gl.canvas.height = this.gl.canvas.clientHeight;
    }
  }

  clear() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.BLEND);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  draw(data) {
    this.gl.drawArrays(this.gl[data.mode], data.first, data.count);
  }

  program(data) {
    const vs = new _Shader.default(this.gl, 'VERTEX_SHADER', data.vertex).init();
    const fs = new _Shader.default(this.gl, 'FRAGMENT_SHADER', data.fragment).init();
    const pg = new _Program.default(this.gl, vs, fs).init();
    return pg;
  }

  texture(data) {
    const tx = new _Texture.default(this.gl, data).init();
    return tx;
  }

  vertexBuffer(data) {
    const vbo = new _VertexBuffer.default(this.gl, data).init().unbind();
    return vbo;
  }

  vertexAttribs(data) {
    const attribs = new _VertexAttribs.default(this.gl, data).init();
    return attribs;
  }

  vertexArray(data) {
    const temp = data.map(e => {
      return {
        buffer: new _VertexBuffer.default(this.gl, e.buffer),
        attribs: e.attribs.map(a => {
          return new _VertexAttribs.default(this.gl, a);
        })
      };
    });
    const vao = new _VertexArray.default(this.gl, temp).init().unbind();
    return vao;
  }

  frameBuffer(data) {
    const fbo = new _FrameBuffer.default(this.gl, data).init().unbind();
    return fbo;
  }

  async fetchShader(url) {
    const res = await fetch(url);
    const txt = await res.text();
    console.log(txt);
    return txt;
  }

  async fetchGeomatry(url) {
    const res = await fetch(url);
    const txt = await res.text();
    let geo = txt.split(/,\s*/gm);
    geo.pop();
    geo = geo.map(e => parseFloat(e));
    return new Float32Array(geo);
  }

  checkerBoard(w, h) {
    const checker = [];

    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if ((i + j) % 2 === 0) checker.push(127 + 127 * Math.random(), 127 + 127 * Math.random(), 127 + 127 * Math.random(), 255);else checker.push(127 + 127 * Math.random(), 127 + 127 * Math.random(), 127 + 127 * Math.random(), 255);
      }
    }

    return new Uint8Array(checker);
  }

}

var _default = SimpleWebGL;
exports.default = _default;
},{"./source/Program.js":"swgl/source/Program.js","./source/Shader.js":"swgl/source/Shader.js","./source/Texture.js":"swgl/source/Texture.js","./source/VertexArray.js":"swgl/source/VertexArray.js","./source/VertexBuffer.js":"swgl/source/VertexBuffer.js","./source/VertexAttribs.js":"swgl/source/VertexAttribs.js","./source/FrameBuffer.js":"swgl/source/FrameBuffer.js"}],"swgl/assets/pass-through.swgl.vert":[function(require,module,exports) {
module.exports = "#version 300 es\nprecision mediump float;\n#define GLSLIFY 1\n\nlayout (location = 0) in vec3 aPosition;\n\nvoid main() {\n    gl_Position = vec4(aPosition, 1.0);\n}\n";
},{}],"swgl/assets/gol-draw.swgl.frag":[function(require,module,exports) {
module.exports = "#version 300 es\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 uPos;\nuniform vec2 uRes;\nuniform sampler2D uTexture;\n\nlayout (location = 0) out vec4 outColor;\n\nfloat rand(vec2 co);\n\nvoid main() {\n    vec2 t = vec2(gl_FragCoord.x / uRes.x, gl_FragCoord.y / uRes.y);\n    vec2 texCoord = (t + uPos.xy) * uPos.z;\n\n    if(texCoord.x < 0.0 || texCoord.y < 0.0 || texCoord.x > 1.0 || texCoord.y > 1.0) {\n        outColor = vec4(0.0, 0.0, 0.0, 1.0);\n        return;\n    }\n\n    vec3 lookup = texture(uTexture, texCoord).rgb;\n\n    vec3 col = vec3(texCoord, dot(texCoord, texCoord));\n    float len = length(col);\n    col = col / len * clamp(len, 0.8, 2.0);\n\n    if(lookup.r == 1.0) outColor = vec4(col, 1.0);\n    else if(lookup.g == 1.0) outColor = vec4(col * lookup.b, 1.0);\n    else outColor = vec4(col * 0.2, 1.0);\n}\n\nfloat rand(in vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n";
},{}],"swgl/assets/gol-update.swgl.frag":[function(require,module,exports) {
module.exports = "#version 300 es\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform sampler2D uTexture;\n\nlayout (location = 0) out vec4 outColor;\n\nfloat newState(ivec2 cell, float state);\n\nvoid main() {\n    ivec2 cell = ivec2(gl_FragCoord);\n    vec4 lookup = texelFetch(uTexture, cell, 0);\n\n    float nextState = newState(cell, lookup.r);\n\n    if(nextState == 1.0) outColor = vec4(1.0, 0.0, 1.0, 0.0);\n    else if(lookup.r == 1.0 || lookup.g == 1.0) outColor = vec4(0.0, 1.0, max(lookup.b - 0.01, 0.0), 0.0);\n    else outColor = vec4(0.0, 0.0, 1.0, 0.0);\n}\n\nfloat newState(in ivec2 cell, in float state) {\n    float n =\n        texelFetch(uTexture, cell + ivec2(-1,  1), 0).r +\n        texelFetch(uTexture, cell + ivec2( 0,  1), 0).r +\n        texelFetch(uTexture, cell + ivec2( 1,  1), 0).r +\n        texelFetch(uTexture, cell + ivec2(-1,  0), 0).r +\n        texelFetch(uTexture, cell + ivec2( 1,  0), 0).r +\n        texelFetch(uTexture, cell + ivec2(-1, -1), 0).r +\n        texelFetch(uTexture, cell + ivec2( 0, -1), 0).r +\n        texelFetch(uTexture, cell + ivec2( 1, -1), 0).r;\n\n    if(n == 2.0) return state;\n    else if(n == 3.0) return 1.0;\n    else return 0.0;\n}\n";
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _GoL = _interopRequireDefault(require("./gol/GoL.js"));

var _SimpleWebGL = _interopRequireDefault(require("./swgl/SimpleWebGL.js"));

var _passThroughSwgl = _interopRequireDefault(require("./swgl/assets/pass-through.swgl.vert"));

var _golDrawSwgl = _interopRequireDefault(require("./swgl/assets/gol-draw.swgl.frag"));

var _golUpdateSwgl = _interopRequireDefault(require("./swgl/assets/gol-update.swgl.frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', main);

async function main() {
  document.removeEventListener('DOMContentLoaded', main);
  console.log('GoL GPGPU');
  const gol = new _GoL.default(parseInt(window.location.hash.substr(1)) || 100);
  gol.random(0.8); //gol.setPattern(await gol.patternFromUrl_Life_1_06('patterns/conwaylife.com/3enginecordershiprake_106.lif'), gol.size - 232, gol.size * 0.5);
  //gol.setPattern_rle(await gol.patternFromUrl_rle('patterns/conwaylife.com/gosperglidergun.rle'));
  // for(let i = 0; i < 100; i++) {
  //     let pos = [Math.round(50 + Math.random() * (gol.size - 100)), Math.round(50 + Math.random() * (gol.size - 100))];
  //     gol.setPattern_rle(await gol.patternFromUrl_rle('patterns/conwaylife.com/gosperglidergun.rle'), ...pos);
  // }

  const canvas = document.querySelector('#web-gl');
  const swgl = new _SimpleWebGL.default(canvas);
  const va = swgl.vertexArray([{
    buffer: {
      target: 'ARRAY_BUFFER',
      data: await swgl.fetchGeomatry('quad.swgl.geo'),
      usage: 'STATIC_DRAW'
    },
    attribs: [{
      index: 0,
      size: 3,
      type: 'FLOAT',
      normalized: 'FALSE',
      stride: 0,
      offset: 0
    }, {
      index: 1,
      size: 2,
      type: 'FLOAT',
      normalized: 'FALSE',
      stride: swgl.SIZE_OF_FLOAT * 3,
      offset: 0
    }]
  }]).bind();
  const sp = {
    draw: swgl.program({
      vertex: _passThroughSwgl.default,
      fragment: _golDrawSwgl.default
    }).uniforms([{
      type: 'uniform1i',
      name: 'uTexture',
      value: 0
    }, {
      type: 'uniform3fv',
      name: 'uPos',
      value: [0, 0, 1]
    }, {
      type: 'uniform2fv',
      name: 'uRes',
      value: [0, 0]
    }, {
      type: 'uniform2fv',
      name: 'uCells',
      value: [gol.size, gol.size]
    }, {
      type: 'uniform1f',
      name: 'uStep',
      value: 0
    }]),
    update: swgl.program({
      vertex: _passThroughSwgl.default,
      fragment: _golUpdateSwgl.default
    }).uniforms([{
      type: 'uniform1i',
      name: 'uTexture',
      value: 0
    }])
  };
  const tx = [swgl.texture({
    width: gol.size,
    height: gol.size,
    data: gol.repack(),
    target: 'TEXTURE_2D',
    params: [{
      pname: 'TEXTURE_MIN_FILTER',
      param: 'NEAREST'
    }, {
      pname: 'TEXTURE_MAG_FILTER',
      param: 'NEAREST'
    }, {
      pname: 'TEXTURE_WRAP_S',
      param: 'CLAMP_TO_EDGE'
    }, {
      pname: 'TEXTURE_WRAP_T',
      param: 'CLAMP_TO_EDGE'
    }]
  }), swgl.texture({
    width: gol.size,
    height: gol.size,
    data: null,
    target: 'TEXTURE_2D',
    params: [{
      pname: 'TEXTURE_MIN_FILTER',
      param: 'NEAREST'
    }, {
      pname: 'TEXTURE_MAG_FILTER',
      param: 'NEAREST'
    }, {
      pname: 'TEXTURE_WRAP_S',
      param: 'CLAMP_TO_EDGE'
    }, {
      pname: 'TEXTURE_WRAP_T',
      param: 'CLAMP_TO_EDGE'
    }]
  })];
  const fb = [swgl.frameBuffer({
    width: gol.size,
    height: gol.size,
    textures: [{
      attachment: 'COLOR_ATTACHMENT0',
      binding: tx[1].binding
    }]
  }), swgl.frameBuffer({
    width: gol.size,
    height: gol.size,
    textures: [{
      attachment: 'COLOR_ATTACHMENT0',
      binding: tx[0].binding
    }]
  })];
  let pingPong = 0;
  let m = [0, 0, 1];
  let r = [0, 0];
  canvas.addEventListener('wheel', scroll);
  canvas.addEventListener('mousedown', down);
  canvas.addEventListener('dblclick', reset);
  requestAnimationFrame(function run(tick) {
    sp.update.use();
    fb[pingPong].bind();
    tx[pingPong].bind(0);
    swgl.draw({
      mode: 'TRIANGLE_STRIP',
      first: 0,
      count: 4
    });
    sp.draw.use().uniforms([{
      type: 'uniform3fv',
      name: 'uPos',
      value: m
    }, {
      type: 'uniform2fv',
      name: 'uRes',
      value: [swgl.gl.drawingBufferWidth, swgl.gl.drawingBufferHeight]
    }, {
      type: 'uniform1f',
      name: 'uStep',
      value: Math.sin(tick * 0.001)
    }]);
    swgl.clear();
    swgl.resize();
    swgl.draw({
      mode: 'TRIANGLE_STRIP',
      first: 0,
      count: 4
    });
    pingPong = pingPong ? 0 : 1;
    requestAnimationFrame(run);
  });

  function scroll(e) {
    e.preventDefault();
    r = [e.clientX / canvas.width, 1 - e.clientY / canvas.height];
    m[2] += e.deltaY * 0.01;
    m[0] = -r[0] + 1 / m[2] * r[0];
    m[1] = -r[1] + 1 / m[2] * r[1];
  }

  function down(e) {
    e.preventDefault();
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    canvas.removeEventListener("mousedown", down);
  }

  function move(e) {
    e.preventDefault();
    m[0] -= e.movementX * 0.00145;
    m[1] += e.movementY * 0.00145;
  }

  function up(e) {
    e.preventDefault();
    canvas.addEventListener("mousedown", down);
    canvas.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  function reset(e) {
    e.preventDefault();
    m = [0, 0, 1];
  }
}
},{"./gol/GoL.js":"gol/GoL.js","./swgl/SimpleWebGL.js":"swgl/SimpleWebGL.js","./swgl/assets/pass-through.swgl.vert":"swgl/assets/pass-through.swgl.vert","./swgl/assets/gol-draw.swgl.frag":"swgl/assets/gol-draw.swgl.frag","./swgl/assets/gol-update.swgl.frag":"swgl/assets/gol-update.swgl.frag"}],"../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50864" + '/');

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
},{}]},{},["../../.nvm/versions/node/v16.4.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map