import * as twgl from "twgl.js";
import vertexShader from "@/shaders/triangle/vertex.glsl?raw";
import fragmentShader from "@/shaders/triangle/fragment.glsl?raw";
import {degToRad, handleResize} from '@/utils'

export default () => {
  const gl = (document.querySelector("#c") as HTMLCanvasElement).getContext("webgl");
  if (!gl) {
    return;
  }
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);

  const arrays = {
    a_position: [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0],
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  let deg = 0
  let lastTime = Date.now();
  function render() {
    if (!gl) {
      return;
    }
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;
    deg = (deg + ((45 * deltaTime) / 1000)) % 360;
    const mat = twgl.m4.rotationZ(degToRad(deg));
    twgl.m4.translate(mat, [1, 0, 0], mat);
    twgl.m4.scale(mat, [0.5, 0.5, 0.5], mat);

    const uniforms = {
      u_Matrix: mat,
    };
    gl.clear(gl.COLOR_BUFFER_BIT);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    requestAnimationFrame(render);
  }
  handleResize(gl);
  window.addEventListener("resize", handleResize.bind(null, gl));
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  render();
};
