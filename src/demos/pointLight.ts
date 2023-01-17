import * as twgl from "twgl.js";
import vertexShader from "@/shaders/light/point/vertex.glsl?raw";
import fragmentShader from "@/shaders/light/point/fragment.glsl?raw";
import {Mesh, WebGLRenderer, Scene, PerspectiveCamera} from '@/core'

export default () => {
  const canvas = document.querySelector("#c") as HTMLCanvasElement;
  const renderer = new WebGLRenderer({
    canvas
  })
  const gl = renderer.gl
  twgl.setAttributePrefix('a_')
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  const vertices  = twgl.primitives.createCubeVertices(2);
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, vertices);
  const scene = new Scene()
  const camera = new PerspectiveCamera(30, canvas.clientWidth / canvas.clientHeight, 1, 100)
  camera.position = twgl.v3.create(0, 2, 7)
  const lightPosition = twgl.v3.create(0, 0, 3)

  const uniforms = {
    u_color: [1, 0, 0, 1],
    u_diffuseLight: [1, 1, 1],
    u_ambientLight: [0.5, 0.5, 0.5],
    u_specularColor: [1, 1, 1],
    u_shininess: 50,
    u_lightPosition: lightPosition,
  }

  const cube = new Mesh({
    programInfo,
    bufferInfo,
    uniforms
  })

  scene.add(cube)

  function render(time: number) {
    if (!gl) return;
    time *= 0.001;
    cube.rotation = twgl.v3.create(0, time, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
};
