import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  SphereBufferGeometry,
  Group,
  Mesh,
  Vector3,
  Vector2
} from 'three'

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
const createSphere = (pos) => {
  const geometry = new SphereBufferGeometry(0.1, 4, 4)
  const material = new MeshBasicMaterial({ color: 0xffff00 })
  const sphere = new Mesh(geometry, material)
  sphere.position.set(pos.x, pos.y, pos.z)
  return sphere
}

const dots = []
const fieldSize = 80

for (let i = 0; i < 80; i++) {
  const x = (Math.random() - 0.5) * fieldSize
  const z = (Math.random() - 0.5) * fieldSize

  let sp = createSphere(new Vector3(x, 0, z))
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

/**
 * Projection function
 * @param {Mesh} object3D
 * @param {PerspectiveCamera} cam
 * @param {Number} width
 * @param {Number} height
 */
function get2Dfor3D(object3D, cam, width, height) {
  // This creates a normalised Vector2
  let tempVec = new Vector3()
  object3D.getWorldPosition(tempVec)

  const projectedVec = tempVec.project(cam)
  const point2D = new Vector2(projectedVec.x, projectedVec.y)

  // This inverts the normalized Vector2 and applies the canvas size to it.
  point2D.x = ((point2D.x + 1) / 2) * width
  point2D.y = (-(point2D.y - 1) / 2) * height

  return point2D
}

// Recurring animation function
const animate = function () {
  requestAnimationFrame(animate)

  group.rotation.y += 0.001

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
}

animate()

window.logDots = () => {
  console.log(dots)
  console.log(mousePos)
}
