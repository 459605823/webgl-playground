import * as twgl from 'twgl.js'
import {Object3D} from './Object3D'
import {degToRad} from '@/utils'

abstract class Camera extends Object3D {
  public projectionMatrix: twgl.m4.Mat4 = twgl.m4.identity()
  public target: twgl.v3.Vec3 = twgl.v3.create(0, 0, 0)

  get viewMatrix() {
    return twgl.m4.inverse(twgl.m4.lookAt(this.position, this.target, this.up))
  }

  get viewProjectionMatrix() {
    return twgl.m4.multiply(this.projectionMatrix, this.viewMatrix)
  }

  public abstract updateProjectionMatrix(): void
}

class PerspectiveCamera extends Camera {

  constructor(public fov: number, public aspect: number, public near: number, public far: number) {
    super()
    this.projectionMatrix = twgl.m4.perspective(degToRad(fov), aspect, near, far)
  }

  updateProjectionMatrix() {
    this.projectionMatrix = twgl.m4.perspective(degToRad(this.fov), this.aspect, this.near, this.far)
  }
}

class OrthographicCamera extends Camera {

  constructor(public left: number, public right: number, public bottom: number, public top: number, public near: number, public far: number) {
    super()
    this.projectionMatrix = twgl.m4.ortho(left, right, bottom, top, near, far)
  }

  updateProjectionMatrix() {
    this.projectionMatrix = twgl.m4.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far)
  }
}

export {PerspectiveCamera, OrthographicCamera, Camera}