import * as twgl from "twgl.js";
import vertexShader from "@/shaders/scene/vertex.glsl?raw";
import fragmentShader from "@/shaders/scene/fragment.glsl?raw";
import { degToRad } from "@/utils";
import {Mesh, Group, Scene, WebGLRender} from '@/core'

export default () => {
  const canvas = document.querySelector("#c") as HTMLCanvasElement;
  const renderer = new WebGLRender({
     canvas
  })
  const gl = renderer.gl
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  const vertices = twgl.primitives.createSphereVertices(10, 12, 6);
  twgl.primitives.makeRandomVertexColors(vertices)
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, vertices);
  const scene = new Scene()
  const sun = new Mesh({
    programInfo,
    bufferInfo,
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0, 1], // yellow
      u_colorMult:   [0.4, 0.4, 0, 1],
    },
  })
  const earth = new Mesh({
    programInfo,
    bufferInfo,
    uniforms: {
      u_colorOffset: [0.2, 0.5, 0.8, 1],  // blue-green
      u_colorMult:   [0.8, 0.5, 0.2, 1],
    },
  })
  earth.scale = twgl.v3.create(0.5, 0.5, 0.5)
  const moon = new Mesh({
    programInfo,
    bufferInfo,
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0.6, 1],  // gray
      u_colorMult:   [0.1, 0.1, 0.1, 1],
    },
  })
  moon.scale = twgl.v3.create(0.2, 0.2, 0.2)
  const solarSystem = new Group()
  const earthOrbit = new Group()
  const moonOrbit = new Group()
  earthOrbit.position = twgl.v3.create(50, 0, 0)
  moonOrbit.position = twgl.v3.create(10, 0, 0)
  solarSystem.add(sun)
  solarSystem.add(earthOrbit)
  earthOrbit.add(earth)
  earthOrbit.add(moonOrbit)
  moonOrbit.add(moon)
  scene.add(solarSystem)
  const projection = twgl.m4.perspective(degToRad(60), canvas.clientWidth / canvas.clientHeight, 1, 2000);
  const camera = twgl.m4.lookAt([0, 100, 50], [0, 0, 0], [0, 1, 0]);
  const view = twgl.m4.inverse(camera);
  const viewProjection = twgl.m4.multiply(projection, view);

  function render(time: number) {
    if (!gl) return;
    time *= 0.001;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    solarSystem.rotation = twgl.v3.create(0, time / 4, 0)
    earthOrbit.rotation = twgl.v3.create(0, time / 2, 0)
    earth.rotation = twgl.v3.create(0, time, 0)
    moon.rotation = twgl.v3.create(0, time, 0)
    solarSystem.updateWorldMatrix()
    renderer.render(scene, viewProjection)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render);
};
