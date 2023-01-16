import {createElementNS} from '@/utils'
import {Scene, Mesh, Object3D} from '@/core'
import * as twgl from 'twgl.js'

interface Parameters {
  canvas?: HTMLCanvasElement
}

function createCanvasElement() {
	const canvas = createElementNS( 'canvas' );
	canvas.style.display = 'block';
	return canvas as HTMLCanvasElement;
}

class WebGLRender {
  public gl: WebGLRenderingContext

  private currentRenderList: Mesh[] = []

  constructor(option: Parameters) {
    const canvas = option.canvas ?? createCanvasElement()
    const gl = canvas.getContext('webgl') as WebGLRenderingContext
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl = gl
  }

  private projectObject(object: Object3D) {
    if (object.visible && object.type === 'Mesh') {
      this.currentRenderList.push(object as Mesh)
    }
    object.children.forEach(child => this.projectObject(child))
  }

  render(scene: Scene, viewProjection: twgl.m4.Mat4) {
    const {gl} = this
    this.currentRenderList = []
    this.projectObject(scene)
    this.currentRenderList.forEach(object => {
      const {programInfo, bufferInfo, uniforms} = object.drawInfo
      const mvp = twgl.m4.multiply(viewProjection, object.worldMatrix);
      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, {
        u_mvpMatrix: mvp,
        ...uniforms
      });
      twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    })
  }


}

export {WebGLRender}