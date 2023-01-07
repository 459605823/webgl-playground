import * as twgl from "twgl.js";
import vertexShader from "@/shaders/triangle/vertex.glsl?raw";
import fragmentShader from "@/shaders/triangle/fragment.glsl?raw";
import {degToRad} from '@/utils'

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
  const mat = twgl.m4.identity();
  twgl.m4.scale(mat, [0.5, 1, 1], mat)
  twgl.m4.translate(mat, [0.5, 0, 0], mat);
  twgl.m4.rotateZ(mat, degToRad(90), mat)
  console.log(mat);

  function render() {
    if (!gl) {
      return;
    }
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
      u_Matrix: mat,
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  }
  render();
};
