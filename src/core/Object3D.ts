import * as twgl from 'twgl.js'

const {m4, v3} = twgl

export class Object3D {
  type = 'Object3D'

  name = ''

  children: Object3D[] = []

  parent: Object3D | null = null

  worldMatrix: twgl.m4.Mat4 = m4.identity()

  modelViewMatrix: twgl.m4.Mat4 = m4.identity()

  position: twgl.v3.Vec3 = v3.create(0, 0, 0)

  rotation: twgl.v3.Vec3 = v3.create(0, 0, 0)

  scale: twgl.v3.Vec3 = v3.create(1, 1, 1)

  up: twgl.v3.Vec3 = v3.create(0, 1, 0)

  uuid: string

  visible = true

  constructor() {
    this.uuid = Math.random().toString(36).slice(2)
    this.updateWorldMatrix()
  }

  get localMatrix() {
    const matrix = m4.translation(this.position)
    m4.rotateX(matrix, this.rotation[0], matrix)
    m4.rotateY(matrix, this.rotation[1], matrix)
    m4.rotateZ(matrix, this.rotation[2], matrix)
    m4.scale(matrix, this.scale, matrix)
    return matrix
  }

  get normalMatrix() {
     return m4.transpose(m4.inverse(this.localMatrix))
  }

  updateWorldMatrix() {
    if (this.parent) {
      this.worldMatrix = m4.multiply(this.parent.worldMatrix, this.localMatrix)
    } else {
      this.worldMatrix = this.localMatrix
    }
    this.children.forEach(child => child.updateWorldMatrix())
  }

  add(...children: Object3D[]) {
    children.forEach(child => {
      child.removeFromParent()
      child.parent = this
      this.children.push(child)
    })
  }

  remove(...children: Object3D[]) {
    children.forEach(child => {
      const index = this.children.indexOf(child)
      if (index !== -1) {
        this.children.splice(index, 1)
      }
    })
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.remove(this)
    }
  }
}

interface drawInfo {
  programInfo: twgl.ProgramInfo
  bufferInfo: twgl.BufferInfo
  uniforms: Record<string, any>
}

export class Mesh extends Object3D {
  type = 'Mesh'

  constructor(public drawInfo: drawInfo) {
    super()
  }
}

export class Group extends Object3D {
  type = 'Group'
}