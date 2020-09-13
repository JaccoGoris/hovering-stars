import { Mesh, PerspectiveCamera, Vector3, Vector2 } from 'three'

/**
 * Projection function
 * @param {Mesh} object3D
 * @param {PerspectiveCamera} cam
 * @param {Number} width
 * @param {Number} height
 */
export function get2Dfor3D(
  object3D: Mesh,
  cam: PerspectiveCamera,
  width: number,
  height: number
) {
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
