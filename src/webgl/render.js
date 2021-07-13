import vertexFrag from './shaders/vertex_frag.glsl'
import textureFrag from './shaders/texture_frag.glsl'
import { texturePortraitVertices, textureLandscapeVertices, stencilOffsetPortraitVertices, stencilOffsetLandscapeVertices } from './vertics'
import { requestAnimFrame, cancelAnimFrame } from '../utils/tick'
import { WebGLUtils } from './helper'

/**
 * VideoShaderRender
 * webgl video shader renderer
 * @param {HTMLElement} container player container element
 * @return {String} stencilOrder stencil relative order  ['front', 'back']
 * @return {String} orientation video orientation ['portrait', 'landscape']
 * @return {Object} pixels texture pixels object https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
 */
class VideoShaderRender {
  constructor ({ container, stencilOrder, orientation = 'portrait', pixels }) {
    this.container = container
    this.orientation = orientation
    this.stencilOrder = stencilOrder
    this.pixels = pixels
    this.init()
  }

  init () {
    this.canvas = this.createCanvas()
    this.gl = this.createGl(this.canvas)
    this.dpr = window.devicePixelRatio || 1
    this.shaderProgram = this.createProgram()

    this.setRenderViewPort()
    this.initVertics()
    this.initVerticsBuffer()
    this.initTextureBuffer()
  }

  setRenderViewPort (width, height) {
    const { container, dpr } = this
    const viewWidth = width || container.offsetWidth
    const viewHeight = height || container.offsetHeight
    // current width - scale width = diff offset width  and diff offset half
    const dprX = Math.floor((viewWidth - (viewWidth * dpr)) / 2)
    const dprY = Math.floor((viewHeight - (viewHeight * dpr)) / 2)
    this.gl.viewport(dprX, dprY, viewWidth * dpr, viewHeight * dpr)
  }

  initRenderShader () {
    const { gl } = this

    const vertexShader = WebGLUtils.loadShader(gl, gl.VERTEX_SHADER, vertexFrag)
    const fragmentShader = WebGLUtils.loadShader(gl, gl.FRAGMENT_SHADER, textureFrag)
    return {
      vertexShader,
      fragmentShader
    }
  }

  initVertics () {
    // 定义纹理在webgl上的4个顶点坐标数据
    this.positionVertices = new Float32Array([
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0
    ])
    // 定义不同方向和不同顺序的主纹理和模版纹理区域的坐标数据
    if (this.orientation === 'portrait') {
      this.textureVertices = new Float32Array(texturePortraitVertices[this.stencilOrder])
      this.offsetVertices = stencilOffsetPortraitVertices[this.stencilOrder]
    } else {
      this.textureVertices = new Float32Array(textureLandscapeVertices[this.stencilOrder])
      this.offsetVertices = stencilOffsetLandscapeVertices[this.stencilOrder]
    }
  }

  initVerticsBuffer () {
    const aVertexPositionLocation = this.getAttribLocation('aVertexPosition')
    const aTextureCoordLocation = this.getAttribLocation('aTextureCoord')
    const vTextureOffsetVectorLocation = this.getUniformLocation('vTextureOffsetVector')
    const uScaleVectorLocation = this.getUniformLocation('uScale')
    const [stencilOffsetX, stencilOffsetY] = this.offsetVertices

    WebGLUtils.setShaderBuffer(this.gl, aVertexPositionLocation, this.positionVertices)
    WebGLUtils.setShaderBuffer(this.gl, aTextureCoordLocation, this.textureVertices)
    this.gl.uniform2f(vTextureOffsetVectorLocation, stencilOffsetX, stencilOffsetY)
    // set scale vector to adapt dpr viewport
    // 1/dpr === viewPort.width / viewPort.width * dpr
    this.gl.uniform4fv(uScaleVectorLocation, [1 / this.dpr, 1 / this.dpr, 0.0, 1.0])
  }

  initTextureBuffer () {
    const { gl, pixels } = this
    WebGLUtils.createTexure(gl, pixels)
    // 纹理坐标Y轴自上到下 需要翻转Y轴 使其与webgl坐标对应
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  }

  step = () => {
    this.ticker = requestAnimFrame(this.step)
    this.tick()
  }

  tick () {
    this.draw()
  }

  startTick = () => {
    this.ticker = requestAnimFrame(this.step)
  }

  stopTick = () => {
    cancelAnimFrame(this.ticker)
  }

  draw () {
    const { gl, pixels } = this
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      pixels
    )
    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  createCanvas () {
    const { container } = this
    const canvasEl = WebGLUtils.createCanvas(container.offsetWidth, container.offsetHeight)
    container.appendChild(canvasEl)
    return canvasEl
  }

  createGl (canvas) {
    const gl = WebGLUtils.getContextWebGL(canvas)
    return gl
  }

  createProgram () {
    const { vertexShader, fragmentShader } = this.initRenderShader()
    return WebGLUtils.createProgram(this.gl, vertexShader, fragmentShader)
  }

  getAttribLocation (name) {
    return this.gl.getAttribLocation(this.shaderProgram, name)
  }

  getUniformLocation (name) {
    return this.gl.getUniformLocation(this.shaderProgram, name)
  }

  resizeRender (width, height) {
    // const { container } = this
    // const viewWidth = container.offsetWidth
    // console.log(viewWidth / width)
    this.canvas.width = width
    this.canvas.height = height
    this.setRenderViewPort(width, height)
  }

  destroy () {
    this.stopTick()
    this.gl.clear(this.pixels)
  }
}
export default VideoShaderRender
