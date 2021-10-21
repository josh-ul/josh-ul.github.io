class WebGL {
    constructor(canvas) {
        this.gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });

        if (this.gl === null) {
            console.log("Unable to initialize WebGl.");
            return;
        }

        this.viewPort = new Vec2(this.gl.canvas.width, this.gl.canvas.height);

        // const gl = this.gl;
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

    init(count, pos, vel) {
        const gl = this.gl;

        const vsSource = this.vertexShader();
        const fsSource = this.fragmentShader();

        const shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
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

        const buffers = {
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

        const orthographicMatrix = mat4.create();
        mat4.ortho(orthographicMatrix, 0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, 0.0, 1.0);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, 0.0]);

        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, orthographicMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        //gl.useProgram(null);

        this.vao = this.initVao(gl, buffers, programInfo);
    }

    draw(pos, vel) {
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

    initVao(gl, buffers, shader) {
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        for (let key of Object.keys(buffers)) {
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

    initBuffer(gl, type, data, count, components, div) {
        const buffer = {
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

    initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }

    loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    vertexShader() {
        return `#version 300 es
            in vec2 aVertexPosition;
            in vec2 aOffsetPosition;
            in vec2 aTargetDirection;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            out vec3 col;

            vec3 vert;
            vec3 dir;
            vec3 tar;

            float cos;
            float sin;

            mat3 rot;

            vec3 new;
            vec4 pos;

            vec2 rg;

            float PHI = 1.61803398874989484820459;

            float gold_noise(in vec2 xy, in float seed){
                   return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
            }

            void main() {
                vert = vec3(aVertexPosition, 0.0);
                dir = normalize(vec3(0.0, -1.0, 0.0));
                tar = normalize(vec3(aTargetDirection, 0.0));

                cos = dot(dir, tar);
                sin = length(cross(dir, tar));

                rot = mat3(
                    cos,   -sin,   0.0,
                    sin,   cos,    0.0,
                    0.0,   0.0,    0.0
                );

                if (tar.x < 0.0) {
                    new = rot * vert;
                }
                else {
                    new = vert * rot;
                }

                pos = vec4(new.xy + aOffsetPosition, 0.0, 1.0);
                gl_Position = uProjectionMatrix * uModelViewMatrix * pos;

                // rg = (gl_Position.xy + vec2(1.0, 1.0)) * 0.5;
                // col = normalize(vec3(rg, (tar.x + tar.y) * 0.5));

                // col = normalize(vec3(
                    // gold_noise(vec2(float(gl_InstanceID)), aVertexPosition.x),
                    // gold_noise(vec2(float(gl_InstanceID) + aVertexPosition.x), aVertexPosition.y),
                    // gold_noise(vec2(float(gl_InstanceID)) + aVertexPosition.y, float(gl_VertexID))
                // ));

                col = vec3(
                    gold_noise(vec2(1.5, 2.2) + aVertexPosition, float(gl_InstanceID + 1)),
                    gold_noise(vec2(4.1, 3.2) + aVertexPosition, float(gl_InstanceID + 2)),
                    gold_noise(vec2(6.1, 3.2) + aVertexPosition, float(gl_InstanceID + 3))
                );

                gl_PointSize = 1.0;
            }
        `;
    }

    fragmentShader() {
        return `#version 300 es
            precision mediump float;

            in vec3 col;
            out vec4 fragColor;

            void main() {
                fragColor = vec4(col, 1.6);
            }
        `;
    }

    simpleTriangle() {
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
        return new Float32Array([
            -5,    5,
            0,     -10,
            5,     5,
            0,     0
        ]);
        // return new Float32Array([
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
}
