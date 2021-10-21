function box3D() {
    const container = document.querySelector(".box-container");
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        console.log("Unable to initialize WebGl.");
        return;
    }

    canvas.id = "box3D";
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    container.appendChild(canvas);
    container.getElementsByTagName("img")[0].style.visibility = "hidden";

    const fov = 60 * Math.PI / 180;
    let ar = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, ar, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -2.0]);

    const modelViewProjectionMatrix = mat4.create();

    const vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSource());
    const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource());
    const program = initProgram(gl, vertexShader, fragmentShader);

    const locations = {
        attributes: {
            aVert: gl.getAttribLocation(program, "aVert"),
            aUV: gl.getAttribLocation(program, "aUV")
        },
        uniforms: {
            uMVP: gl.getUniformLocation(program, "uMVP")
        }
    };

    const buffers = {
        verts: gl.createBuffer(),
        uvs: gl.createBuffer()
    }

    const cubeData = getCubeData();

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.verts);
    gl.bufferData(gl.ARRAY_BUFFER, cubeData.verts, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(locations.attributes.aVert);
    gl.vertexAttribPointer(locations.attributes.aVert, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvs);
    gl.bufferData(gl.ARRAY_BUFFER, cubeData.uvs, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(locations.attributes.aUV);
    gl.vertexAttribPointer(locations.attributes.aUV, 2, gl.FLOAT, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 0.2);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    //gl.useProgram(null);
    //gl.bindVertexArray(null);

    requestAnimationFrame(function update() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        //ar = gl.canvas.clientWidth / gl.canvas.clientHeight;
        //mat4.perspective(projectionMatrix, fov, ar, zNear, zFar);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        mat4.rotate(modelViewMatrix, modelViewMatrix, 0.01, [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, 0.01, [0, 0, 1]);
        mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
        gl.uniformMatrix4fv(locations.uniforms.uMVP, false, modelViewProjectionMatrix);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        requestAnimationFrame(update);
    });
}

function initProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program:\n" + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function initShader(gl, type, source) {
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

function vertexShaderSource() {
    return `#version 300 es
        in vec4 aVert;
        in vec2 aUV;

        uniform mat4 uMVP;

        out vec2 vUV;

        void main() {
          gl_Position = uMVP * aVert;

          vUV = aUV;
        }
    `;
}

function fragmentShaderSource() {
    return `#version 300 es
        precision mediump float;

        in vec2 vUV;

        uniform sampler2D uTexture;

        out vec4 outColor;

        void main() {
          outColor = vec4(vUV, 0.0, 1.0); //texture(uTexture, vUV);
        }
    `;
}

function getCubeData() {
    return {
        verts: new Float32Array([
            -0.5, -0.5,  -0.5,
            -0.5,  0.5,  -0.5,
             0.5, -0.5,  -0.5,
            -0.5,  0.5,  -0.5,
             0.5,  0.5,  -0.5,
             0.5, -0.5,  -0.5,

            -0.5, -0.5,   0.5,
             0.5, -0.5,   0.5,
            -0.5,  0.5,   0.5,
            -0.5,  0.5,   0.5,
             0.5, -0.5,   0.5,
             0.5,  0.5,   0.5,

            -0.5,   0.5, -0.5,
            -0.5,   0.5,  0.5,
             0.5,   0.5, -0.5,
            -0.5,   0.5,  0.5,
             0.5,   0.5,  0.5,
             0.5,   0.5, -0.5,

            -0.5,  -0.5, -0.5,
             0.5,  -0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,  -0.5,  0.5,
             0.5,  -0.5, -0.5,
             0.5,  -0.5,  0.5,

            -0.5,  -0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,   0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,   0.5,  0.5,
            -0.5,   0.5, -0.5,

             0.5,  -0.5, -0.5,
             0.5,   0.5, -0.5,
             0.5,  -0.5,  0.5,
             0.5,  -0.5,  0.5,
             0.5,   0.5, -0.5,
             0.5,   0.5,  0.5,
        ]),
        uvs: new Float32Array([
            // select the bottom left image
            0   , 0  ,
            0   , 0.5,
            0.25, 0  ,
            0   , 0.5,
            0.25, 0.5,
            0.25, 0  ,
            // select the bottom middle image
            0.25, 0  ,
            0.5 , 0  ,
            0.25, 0.5,
            0.25, 0.5,
            0.5 , 0  ,
            0.5 , 0.5,
            // select to bottom right image
            0.5 , 0  ,
            0.5 , 0.5,
            0.75, 0  ,
            0.5 , 0.5,
            0.75, 0.5,
            0.75, 0  ,
            // select the top left image
            0   , 0.5,
            0.25, 0.5,
            0   , 1  ,
            0   , 1  ,
            0.25, 0.5,
            0.25, 1  ,
            // select the top middle image
            0.25, 0.5,
            0.25, 1  ,
            0.5 , 0.5,
            0.25, 1  ,
            0.5 , 1  ,
            0.5 , 0.5,
            // select the top right image
            0.5 , 0.5,
            0.75, 0.5,
            0.5 , 1  ,
            0.5 , 1  ,
            0.75, 0.5,
            0.75, 1  ,
        ])
    };
}
