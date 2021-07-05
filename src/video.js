/**
 * WebVideo webgl video
 * @param {String} url video url
 * @return {Boolean} autoplay video autoplay
 * @return {Boolean} loop video loop
 * @return {Number} speed video playbackRate [-0.5, 2]
 * @return {Function} onCanplay canplay event
 * @return {Function} onPlay play event
 * @return {Function} onPause pause event
 * @return {Function} onEnded ended event
 * @return {Function} onError error event
 */

const defaultOptions = {
  url: '',
  autoplay: false,
  loop: false,
  speed: 1,
  onCanplay: () => {},
  onPlay: () => {},
  onPause: () => {},
  onEnded: () => {},
  onError: () => {}
}
class WebVideo {
  constructor (options) {
    this.options = { ...defaultOptions, ...options }
    const { url, speed, loop, autoplay, onCanplay, onPlay, onPause, onEnded, onError } = this.options
    this.src = url
    this.loop = loop
    this.speed = speed
    this.autoplay = autoplay

    this.onCanplay = onCanplay
    this.onPlay = onPlay
    this.onPause = onPause
    this.onEnded = onEnded
    this.onError = onError
    if (url) {
      this.load()
    }
  }

  load (url) {
    url = url || this.src
    this.src = url
    if (this.video && this.video.src === url) {
      return
    }
    let video
    if (!this.video) {
      video = document.createElement('video')
      video.controls = null
      this.video = video
    } else {
      video = this.video
    }
    video.crossOrigin = 'anonymous'
    video.src = url
    video.mute = true
    video.volume = 0
    video.loop = this.loop
    video.autoplay = this.autoplay
    video.playbackRate = this.speed

    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('playsinline', 'true')
    video.setAttribute('x-webkit-airplay', 'true')
    video.style.display = 'none'
    video.style.position = 'absolute'
    video.style.top = 0
    video.style.left = 0

    document.body.appendChild(video)

    this._bindEvent()
  }

  play () {
    this.video.play()
  }

  pause () {
    this.video.pause()
  }

  abort () {
    this.video.pause()
    this.video.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    this.video.load()
  }

  setSpeed (speed) {
    if (typeof speed !== 'number') {
      throw new Error('Please enter a valid number')
    }
    this.speed = speed
    this.video.playbackRate = this.speed
  }

  getVideoRect () {
    const { video } = this
    return {
      top: 0,
      left: 0,
      width: video.videoWidth || 0,
      height: video.videoHeight || 0
    }
  }

  isLandscapeView () {
    const { width, height } = this.getVideoRect()
    if (width > height) {
      return true
    }
    return false
  }

  _bindEvent () {
    this.video.addEventListener('canplay', this.onCanplay)
    this.video.addEventListener('play', () => this.onPlay())
    this.video.addEventListener('pause', () => this.onPause())
    this.video.addEventListener('ended', () => this.onEnded())
    this.video.addEventListener('error', () => this.onError())
  }

  _removeEvent () {
    this.video.removeEventListener('canplay', this.onCanplay)
    this.video.removeEventListener('play', () => this.onPlay())
    this.video.removeEventListener('pause', () => this.onPause())
    this.video.removeEventListener('ended', () => this.onEnded())
    this.video.removeEventListener('error', () => this.onError())
  }

  get videoEl () {
    return this.video
  }

  close () {
    this._removeEvent()
    this.abort()
  }
}
export default WebVideo
