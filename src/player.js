/**
 * AVideoPlayer
 * A lightweight alpha video player by webgl render.
 * @param {HTMLElement} container player container element
 * @param {String} src video src
 * @return {Boolean} autoplay video autoplay
 * @return {Boolean} loop video loop
 * @return {Number} speed video playbackRate [-0.5, 2]
 * @return {String} stencilOrder stencil relative order  ['front', 'back']
 * @return {Function} onEnded ended event
 * @return {Function} onError error event
 */
import WebVideo from './video'
import VideoShaderRender from './webgl/render'
import { WebGLUtils } from './webgl/helper'

const PLAY_STATE = {
  NONE: 0,
  CANPLAY: 1,
  PLAY: 2,
  PAUSE: 3,
  STOP: 4,
  ENDED: 5,
  ERROR: 6
}
const defaultOptions = {
  container: null,
  src: '',
  autoplay: false,
  loop: false,
  speed: 1,
  orientation: 'portrait',
  stencilOrder: 'back',
  onEnded: () => {},
  onError: () => {}
}
class AVideoPlayer {
  constructor (options) {
    this.options = { ...defaultOptions, ...options }
    const { src, speed, loop, autoplay, container, orientation, stencilOrder, onEnded, onError } = this.options
    this.src = src
    this.loop = loop
    this.speed = speed
    this.autoplay = autoplay
    this.container = container
    this.orientation = orientation
    this.stencilOrder = stencilOrder
    this.playState = PLAY_STATE.NONE
    this.onEnded = onEnded
    this.onError = onError
    this.init()
  }

  init () {
    if (!WebGLUtils.checkCanUseWebGL()) {
      throw new Error('Your browser does not support WebGL!')
    }
    this.initVideoPlayer()
    this.initWebGLRenderer()
  }

  initVideoPlayer () {
    const { src, loop, speed, autoplay } = this
    if (src === '') {
      throw new Error('video url is empty value')
    }
    this.videoPlayer = new WebVideo({
      url: src,
      loop,
      speed,
      autoplay,
      onCanplay: this.onVideoCanplay,
      onPlay: this.onVideoPlay,
      onPause: this.onVideoPause,
      onEnded: this.onVideoEnded,
      onError: this.onVideoError
    })
  }

  initWebGLRenderer () {
    const { videoPlayer, container, orientation, stencilOrder } = this
    if (!videoPlayer) {
      throw new Error('Please configure videoPlayer before set webglRenderer')
    }
    this.webglRenderer = new VideoShaderRender({
      container,
      orientation,
      stencilOrder,
      pixels: videoPlayer.videoEl
    })
  }

  play () {
    this.videoPlayer.play()
  }

  pause () {
    this.videoPlayer.pause()
  }

  setSpeed (speed) {
    this.videoPlayer.setSpeed(speed)
  }

  onVideoCanplay = () => {
    this.playState = PLAY_STATE.CANPLAY
  }

  onVideoPlay = () => {
    if (this.playState === PLAY_STATE.PLAY) {
      this.webglRenderer.stopTick()
    }
    if (!this.videoWidth || !this.videoHeight) {
      this.resize()
    }

    this.webglRenderer.startTick()
    this.playState = PLAY_STATE.PLAY
  }

  onVideoPause = () => {
    this.playState = PLAY_STATE.PAUSE
    this.webglRenderer.stopTick()
  }

  onVideoEnded = () => {
    this.playState = PLAY_STATE.ENDED
    this.webglRenderer.stopTick()
    this.onEnded()
  }

  onVideoError = () => {
    this.playState = PLAY_STATE.ERROR
    this.webglRenderer.stopTick()
    this.onError()
  }

  resize () {
    const { orientation } = this
    const { width: videoWidth = 0, height: videoHeight = 0 } = this.videoPlayer.getVideoRect()
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    // Set the render canvas width and height to the actual video width and height to prevent resize distortion
    if (orientation === 'portrait') {
      this.webglRenderer.resizeRender(this.videoWidth, this.videoHeight / 2)
    } else {
      this.webglRenderer.resizeRender(this.videoWidth / 2, this.videoHeight)
    }
  }

  destroy () {
    this.videoPlayer.close()
    this.webglRenderer.destroy()
  }
}
export default AVideoPlayer
