function vertexShaderSource() {
    return `#version 300 es
        layout (location = 0) in vec3 aVertex;
        layout (location = 1) in vec3 aNormal;
        layout (location = 2) in vec2 aUV;

        out vec2 vUV;
        out vec3 vNormal;

        void main() {
            gl_Position = vec4(aVertex, 1.0);

            vNormal = aNormal;
            vUV = aUV;
        }
    `;
}

function fragmentShaderSource() {
    return `#version 300 es
        precision mediump float;

        in vec2 vUV;
        in vec3 vNormal;

        uniform sampler2D uTexture;

        out vec4 outColor;

        void main() {
            outColor = vec4(texture(uTexture, vUV).xyz, 1.0);
        }
    `;
}
