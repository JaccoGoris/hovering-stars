import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  SphereBufferGeometry,
  Group,
  Mesh,
  Vector3,
  Vector2,
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import Renderloop from './renderloop'
import { get2Dfor3D } from './util'

interface Dot {
  mesh: Mesh
  index: number
  viewPos: Vector2
}

// Setup Scene
const width = window.innerWidth
const height = window.innerHeight

var scene = new Scene()
var camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

var renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const group = new Group()

// Sphere Creation
const createSphere = (
  geo: SphereBufferGeometry,
  mat: MeshBasicMaterial,
  pos: Vector3
) => {
  const sphere = new Mesh(geo, mat)
  sphere.position.set(pos.x, pos.y, pos.z)
  return sphere
}

const dots: Dot[] = []
const fieldSize = 80
const geometry = new SphereBufferGeometry(0.1, 4, 4)
const material = new MeshBasicMaterial({ color: 0xffff00 })

for (let i = 0; i < 80; i++) {
  const x = (Math.random() - 0.5) * fieldSize
  const z = (Math.random() - 0.5) * fieldSize

  let sp = createSphere(geometry, material, new Vector3(x, 0, z))
  dots.push({ mesh: sp, index: i, viewPos: new Vector2(0, 0) })
  group.add(sp)
}

scene.add(group)

// Setup Camera
camera.position.z = 10
camera.position.y = 20
camera.lookAt(0, 0, 0)

let mousePos = new Vector2(0, 0)

renderer.domElement.addEventListener('mousemove', (e) => {
  mousePos = new Vector2(e.clientX, e.clientY)
})

// Setup Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)
controls.update()

const update = (dt: number, shouldUpdate: boolean) => {
  if (shouldUpdate) {
    dots.forEach((dot) => {
      dot.viewPos = get2Dfor3D(dot.mesh, camera, width, height)
      if (
        Math.abs(mousePos.x - dot.viewPos.x) < 10 &&
        Math.abs(mousePos.y - dot.viewPos.y) < 10
      ) {
        dot.mesh.scale.set(3, 3, 3)
      } else {
        dot.mesh.scale.set(1, 1, 1)
      }
    })

    renderer.render(scene, camera)
    controls.update()
  }
}

const renderloop: Renderloop = new Renderloop(update, scene, camera, controls)
renderloop.start()
renderloop.kick()

window.logDots = () => {
  console.log(dots)
  console.log(mousePos)
}
