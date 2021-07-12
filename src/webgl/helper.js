const WebGLUtils = {
  checkCanUseWebGL () {
    let canUseWebGL = false
    try {
      const canvas = document.createElement('canvas')
      canUseWebGL = !!window.WebGLRenderingContext && !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch (e) {
      canUseWebGL = false
    }
    return canUseWebGL
  },
  createCanvas (width, height) {
    const canvas = document.createElement('canvas')
    const dpr = window.devicePixelRatio || 1
    if (!isNaN(width) && !isNaN(height)) {
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.width = width * dpr
      canvas.height = height * dpr
    }
    return canvas
  },
  getContextWebGL (canvas) {
    let gl
    const names = ['webgl', 'experimental-webgl']
    for (let i = 0; i < names.length; ++i) {
      try {
        gl = canvas.getContext(names[i])
      } catch (e) {
      }
      if (gl) {
        break
      }
    }
    if (!gl) {
      console.log('WebGL does not support!')
    }
    return gl
  },
  loadShader (gl, type, source = '') {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
      console.log('shader not compiled!')
      console.log(gl.getShaderInfoLog(shader))
    }
    return shader
  },
  createProgram (gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)
    gl.useProgram(program)

    return program
  },
  createTexure (gl, bitmapData) {
    const texture = gl.createTexture()
    // gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return texture
  },
  setShaderBuffer (gl, location, vertices) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(location)
  }
}

/* check document page whether show and hide */
function isDocumentHidden () {
  return !!document && document.hidden
}

export {
  WebGLUtils,
  isDocumentHidden
}
