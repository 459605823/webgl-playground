import {createElementNS} from '@/utils'
import {Scene, Mesh, Object3D, Camera, Light} from '@/core'
import * as twgl from 'twgl.js'

interface Parameters {
  canvas?: HTMLCanvasElement
  depth?: boolean
  devicePixelRatio?: number
}

function createCanvasElement() {
	const canvas = createElementNS( 'canvas' );
	canvas.style.display = 'block';
	return canvas as HTMLCanvasElement;
}

type SceneElements = Mesh | Light | Camera | Object3D

class WebGLRenderer {
  public gl: WebGLRenderingContext

  private currentRenderList: Mesh[] = []

  private lights: Light[] = []

  devicePixelRatio: number

  static Options = {
    canvas: createCanvasElement(),
    depth: true,
    devicePixelRatio: window.devicePixelRatio
  }

  constructor(option: Parameters) {
    const {canvas, depth, devicePixelRatio} = {...WebGLRenderer.Options, ...option}
    const gl = canvas.getContext('webgl') as WebGLRenderingContext
    if (depth) {
      gl.enable(gl.DEPTH_TEST);
    }
    gl.enable(gl.CULL_FACE);

    this.gl = gl
    this.devicePixelRatio = devicePixelRatio
    this.setSize(canvas.clientWidth, canvas.clientHeight)
  }

  setSize(width: number, height: number) {
    const {gl, devicePixelRatio} = this
    gl.canvas.width = Math.floor(width * devicePixelRatio)
    gl.canvas.height = Math.floor(height * devicePixelRatio)
    this.setViewport(0, 0, width, height)
  }

  setViewport(x: number, y: number, width: number, height: number) {
    const {gl, devicePixelRatio} = this
    gl.viewport(
      Math.floor(x * devicePixelRatio),
      Math.floor(y * devicePixelRatio),
      Math.floor(width * devicePixelRatio),
      Math.floor(height * devicePixelRatio)
    );
  }

  private projectObject(object: SceneElements) {
    if (object.visible) {
      if (object instanceof Mesh && object.isMesh) {
        this.currentRenderList.push(object)
      } else if (object instanceof Light && object.isLight) {
        this.lights.push(object)
      }
      object.children.forEach(child => this.projectObject(child))
    }
  }

  private setUpLights() {
    const uniforms: Record<string, any> = {}
    this.lights.forEach((light) => {
      if (light.type === 'DirectionLight') {
        uniforms.directionLightColor = twgl.v3.mulScalar(light.color, light.intensity)
        uniforms.directionLightPosition = twgl.v3.normalize(light.position)
      } else if (light.type === 'AmbientLight') {
        uniforms.ambientLightColor = twgl.v3.mulScalar(light.color, light.intensity)
      }
    })
    return uniforms
  }

  render(scene: Scene, camera: Camera) {
    const {gl} = this
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.currentRenderList = []
    this.projectObject(scene)
    scene.updateWorldMatrix()
    const lights = this.setUpLights()
    const matrixs = {
      // 视图矩阵
      viewMatrix: camera.viewMatrix,
      // 投影矩阵
      projectionMatrix: camera.projectionMatrix,
      // 相机位置
      cameraPosition: camera.position,
    }
    this.currentRenderList.forEach(object => {
      const {programInfo, bufferInfo, uniforms} = object.drawInfo
      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      object.modelViewMatrix = twgl.m4.multiply(camera.viewMatrix, object.worldMatrix);
      twgl.setUniforms(programInfo, {
        // 模型矩阵
        modelMatrix: object.worldMatrix,
        // 模型视图矩阵
        modelViewMatrix: object.modelViewMatrix,
        // 模型视图投影矩阵
        mvpMatrix: twgl.m4.multiply(camera.projectionMatrix, object.modelViewMatrix),
        // 法向量矩阵
        normalMatrix: object.normalMatrix,
        ...matrixs,
        ...lights,
        ...uniforms,
      });
      twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    })
  }


}

export {WebGLRenderer}