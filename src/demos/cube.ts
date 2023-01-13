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
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  const vertices  = twgl.primitives.createCubeVertices(2);
  twgl.primitives.makeRandomVertexColors(vertices);
  const arrays = {
    position: [
      1.0, 1.0, 1.0, // v0
      -1.0, 1.0, 1.0, // v1
      -1.0, -1.0, 1.0, // v2
      1.0, -1.0, 1.0, // v3
      1.0, -1.0, -1.0, // v4
      1.0, 1.0, -1.0, // v5
      -1.0, 1.0, -1.0, // v6
      -1.0, -1.0, -1.0, // v7
    ],
    color: {
      numComponents: 3,
      data: [
        1.0, 1.0, 1.0, // v0 white
        1.0, 0.0, 1.0, // v1 magenta
        1.0, 0.0, 0.0, // v2 red
        1.0, 1.0, 0.0, // v3 yellow
        0.0, 1.0, 0.0, // v4 green
        0.0, 1.0, 1.0, // v5 cyan
        0.0, 0.0, 1.0, // v6 blue
        0.0, 0.0, 0.0, // v7 black
      ],
    },
    // 顶点索引
    indices: [
      0,1,2, 0,2,3, // front
      0,3,4, 0,4,5, // right
      0,5,6, 0,6,1, // up
      1,6,7, 1,7,2, // left
      7,4,3, 7,3,2, // down
      4,7,6, 4,6,5, // back
    ],
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, vertices);
  const projection = twgl.m4.perspective(degToRad(30), canvas.clientWidth / canvas.clientHeight, 1, 100);
  const camera = twgl.m4.lookAt([3, 3, 7], [0, 0, 0], [0, 1, 0]);
  const view = twgl.m4.inverse(camera);
  const viewProjection = twgl.m4.multiply(projection, view);

  function render(time: number) {
    if (!gl) return;
    time *= 0.001;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const model = twgl.m4.rotationY(time);
    twgl.m4.rotateX(model, time, model);
    const mvp = twgl.m4.multiply(viewProjection, model);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
      u_mvpMatrix: mvp,
    });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    requestAnimationFrame(render)
  }
  handleResize(gl);
  window.addEventListener("resize", handleResize.bind(null, gl));
  requestAnimationFrame(render);
};
