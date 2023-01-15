import * as twgl from "twgl.js";
import vertexShader from "@/shaders/light/point/vertex.glsl?raw";
import fragmentShader from "@/shaders/light/point/fragment.glsl?raw";
import { handleResize, degToRad } from "@/utils";

export default () => {
  const canvas = document.querySelector("#c") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  twgl.setAttributePrefix('a_')
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  const vertices  = twgl.primitives.createCubeVertices(2);
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, vertices);
  const projection = twgl.m4.perspective(degToRad(30), canvas.clientWidth / canvas.clientHeight, 1, 100);
  const camera = twgl.m4.lookAt([3, 3, 7], [0, 0, 0], [0, 1, 0]);
  const view = twgl.m4.inverse(camera);
  const viewProjection = twgl.m4.multiply(projection, view);
  const lightPosition = twgl.v3.create(-2, 4, 3.5)

  const uniforms = {
    u_color: [1, 0, 0, 1],
    u_diffuseLight: [1, 1, 1],
    u_ambientLight: [0.2, 0.2, 0.2],
    u_lightPosition: lightPosition,
  }

  function render(time: number) {
    if (!gl) return;
    time *= 0.001;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const model = twgl.m4.rotationY(time);
    // 计算模型矩阵的逆转置矩阵，用于计算变换后的法向量
    const normalMatrix = twgl.m4.inverse(model);
    twgl.m4.transpose(normalMatrix, normalMatrix)
    const mvp = twgl.m4.multiply(viewProjection, model);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
      u_mvpMatrix: mvp,
      u_modelMatrix: model,
      u_normalMatrix: normalMatrix,
      ...uniforms
    });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    // requestAnimationFrame(render)
  }
  handleResize(gl);
  window.addEventListener("resize", handleResize.bind(null, gl));
  requestAnimationFrame(render)
};
