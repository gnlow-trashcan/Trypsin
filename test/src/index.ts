const canvas = document.querySelector("canvas")

const gl = canvas?.getContext("webgl2") as WebGL2RenderingContext
if (!gl) {
    console.log("webgl2 사용 불가")
}

const vSS = `#version 300 es
    in vec4 a_position;

    void main() {
        gl_Position = a_position;
    }
`

const fSS = `#version 300 es
    precision highp float;
    out vec4 outColor;

    void main() {
        outColor = vec4(1, 0, 0.5, 1);
    }
`

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type) as WebGLShader
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vSS) as WebGLShader
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fSS) as WebGLShader

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram() as WebGLShader
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

const program = createProgram(gl, vertexShader, fragmentShader) as WebGLShader
const posAttrLocation = gl.getAttribLocation(program, "a_position")
const posBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)

const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
gl.enableVertexAttribArray(posAttrLocation)

const size = 2
const type = gl.FLOAT
const normalize = false
const stride = 0
const offset = 0
gl.vertexAttribPointer(
    posAttrLocation,
    size,
    type,
    normalize,
    stride,
    offset,
)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.useProgram(program)

gl.bindVertexArray(vao)

const primitiveType = gl.TRIANGLES
const offset2 = 0
const count = 3
gl.drawArrays(primitiveType, offset2, count)

export {}