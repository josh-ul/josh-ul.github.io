class WebGL {
    constructor(canvas) {
        this.gl = canvas.getContext("webgl2");

        if (this.gl === null) {
            console.log("Unable to initialize WebGl.");
            return;
        }

        this.geometry = {};
        this.material = {};
    }

    static run(canvas) {
        const webGL = new WebGL(canvas);
        webGL.init();
        requestAnimationFrame(function run(){
            webGL.draw();
            requestAnimationFrame(run);
        });
        // cleanUp(webGL)
        return webGL;
    }

    init() {
        this.geometry = createPlane();
        // this.material.texture = createCheckerPattern(8);
        // this.material.texture = noiseGrid(512);
        this.material.texture = voronoiPattern(1024, 1024);

        this.initGL(this.gl);
        this.initGeometry(this.gl);
        this.initMaterial(this.gl);
    }

    draw() {
        if (this.gl.canvas.width !== this.gl.canvas.clientWidth || this.gl.canvas.height !== this.gl.canvas.clientHeight) {
            this.gl.canvas.width = this.gl.canvas.clientWidth;
            this.gl.canvas.height = this.gl.canvas.clientHeight;
            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.material.program);
        this.gl.bindVertexArray(this.geometry.vao);

        this.gl.drawElements(this.gl.TRIANGLES, this.geometry.indices.length, this.gl.UNSIGNED_SHORT, 0);

        this.gl.bindVertexArray(null);
        this.gl.useProgram(null);
    }

    initGL(gl) {
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }

    initGeometry(gl) {
        this.geometry.buffers = {
            indices: gl.createBuffer(),
            vertices: gl.createBuffer(),
            normals: gl.createBuffer(),
            uvs: gl.createBuffer()
        }

        this.geometry.vao = gl.createVertexArray();
        gl.bindVertexArray(this.geometry.vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.buffers.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffers.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, this.geometry.vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffers.normals);
        gl.bufferData(gl.ARRAY_BUFFER, this.geometry.normals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffers.uvs);
        gl.bufferData(gl.ARRAY_BUFFER, this.geometry.uvs, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    initMaterial(gl) {
        this.material.shaders = {
            vertex: this.initShader(gl, gl.VERTEX_SHADER, vertexShaderSource()),
            fragment: this.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource())
        };

        this.material.program = this.initProgram(gl, this.material.shaders.vertex, this.material.shaders.fragment);

        this.material.locations = {
            uniforms: {
                uTexture: gl.getUniformLocation(this.material.program, "uTexture")
            }
        };

        this.gl.useProgram(this.material.program);
        this.gl.uniform1i(this.material.locations.uniforms.uTexture, 0);
        this.gl.useProgram(null);

        this.material.tbo = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, this.material.tbo);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.material.texture.width, this.material.texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.material.texture.image);
        // gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    initProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.deleteShader(vertexShader);

        gl.attachShader(program, fragmentShader);
        gl.deleteShader(fragmentShader);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log("Unable to initialize the shader program:\n" + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    initShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("An error occurred compiling the shaders:\n" + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    cleanUp(gl) {
        this.gl.useProgram(null);
        gl.deleteProgram(this.material.program);

        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.deleteTexture(this.material.tbo);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.deleteBuffer(this.geometry.buffers.indices);
        gl.deleteBuffer(this.geometry.buffers.vertices);
        gl.deleteBuffer(this.geometry.buffers.normals);
        gl.deleteBuffer(this.geometry.buffers.uvs);

        gl.bindVertexArray(null);
        gl.deleteVertexArray(this.geometry.vao);
    }
}
