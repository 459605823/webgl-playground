import * as twgl from "twgl.js";
import vertexShader from "@/shaders/cube/vertex.glsl?raw";
import fragmentShader from "@/shaders/cube/fragment.glsl?raw";
import { handleResize, degToRad } from "@/utils";

export default () => {
  const canvas = document.querySelector("#c") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  const arrays = {
    // position: [
    //   1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
    //   -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1,
    //   -1, 1, -1, -1, -1, -1, -1,
    // ],
    position: [
      0.0, 1.0, -4.0, -0.5, -1.0, -4.0, 0.5, -1.0, -4.0, 0.0, 1.0, -2.0, -0.5, -1.0, -2.0, 0.5, -1.0, -2.0, 0.0, 1.0,
      0.0, -0.5, -1.0, 0.0, 0.5, -1.0, 0.0,
    ],
    color: {
      numComponents: 3,
      data: [
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 1.0, 0.4, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 0.4, 0.4, 0.4, 0.4, 1.0, 0.4,
        0.4, 1.0, 1.0, 0.4, 0.4,
      ],
    },
    // indices: [
    //   0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21,
    //   22, 20, 22, 23,
    // ],
  };
  // const arrays = {
  //   position: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1],
  //   indices: [
  //     0,
  //     1,
  //     2,
  //     0,
  //     2,
  //     3, // front
  //     0,
  //     3,
  //     4,
  //     0,
  //     4,
  //     5, // right
  //     0,
  //     5,
  //     6,
  //     0,
  //     6,
  //     1, // up
  //     1,
  //     6,
  //     7,
  //     1,
  //     7,
  //     2, // left
  //     7,
  //     4,
  //     3,
  //     7,
  //     3,
  //     2, // down
  //     4,
  //     7,
  //     6,
  //     4,
  //     6,
  //     5, // back
  //   ],
  // };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  console.log(bufferInfo);

  function render(time: number) {
    if (!gl) return;
    time *= 0.001;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const projection = twgl.m4.perspective(degToRad(30), canvas.clientWidth / canvas.clientHeight, 1, 100);
    const camera = twgl.m4.lookAt([0, 0, 5], [0, 0, -100], [0, 1, 0]);
    const view = twgl.m4.inverse(camera);
    const viewProjection = twgl.m4.multiply(projection, view);
    const model = twgl.m4.translation([-0.75, 0, 0]);
    const mvp = twgl.m4.multiply(viewProjection, model);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
      u_mvpMatrix: mvp,
    });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_BYTE, 0);
    // requestAnimationFrame(render);
  }
  handleResize(gl);
  window.addEventListener("resize", handleResize.bind(null, gl));
  requestAnimationFrame(render);
};
