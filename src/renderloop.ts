import { Scene, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * RenderLoop Class
 */
export default class RenderLoop {
  isRendering: boolean
  _frameRate: number
  _scene: Scene
  _camera: PerspectiveCamera
  _render: (dt: number, keepAlive: boolean) => void
  _controls: OrbitControls
  tick: number
  stopUpdating: boolean
  getTime: () => number
  isMovingControls: boolean
  endMovingControlsTimeout: NodeJS.Timeout
  time: number
  _keepAlive: boolean

  /**
   * Make a renderLoop
   *
   * @param {function} render - Function to be called by renderer
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera} camera
   * @param {OrbitControls} controls
   * @param {number} [frameRate=90]
   */
  constructor(
    render: (dt: number, shouldUpdate: boolean) => void,
    scene: Scene,
    camera: PerspectiveCamera,
    controls: OrbitControls,
    frameRate: number = 90
  ) {
    this.isRendering = false
    this._frameRate = frameRate
    this._scene = scene
    this._camera = camera
    this._render = render
    this._keepAlive = false

    this._controls = controls
    this._controls.addEventListener('start', () => {
      this.roll()
    })

    this._controls.addEventListener('end', () => {
      this.chill()
    })

    // render time variables
    this.tick = 0
    this.stopUpdating = false
    this.getTime = window.performance
      ? () => window.performance.now()
      : () => Date.now()
  }

  start = () => {
    if (!this.isRendering) {
      this.isRendering = true
      this.loop()
    }
  }

  stop = () => {
    this.isRendering = false
  }

  roll = () => {
    clearTimeout(this.endMovingControlsTimeout)
    this.isMovingControls = true
  }

  chill = () => {
    // let it render for a while after releasing
    this.endMovingControlsTimeout = setTimeout(() => {
      this.isMovingControls = false
    }, 1000)
  }

  kick = () => {
    this.roll()
    this.chill()
  }

  loop = () => {
    if (this.isRendering) {
      const now = this.getTime()

      requestAnimationFrame(this.loop)

      const dt = now - (this.time || now)
      this.time = now
      this.tick += dt

      // If the tick is 1second/framerate, proc the updates
      if (this.tick >= 1000 / this._frameRate) {
        this._render(dt, this.isMovingControls || this._keepAlive)

        this.tick = 0
      }
    }
  }

  set keepAlive(bool: boolean) {
    this._keepAlive = bool
  }
}
