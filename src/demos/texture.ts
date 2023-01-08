import * as twgl from "twgl.js";
import vertexShader from "@/shaders/texture/vertex.glsl?raw";
import fragmentShader from "@/shaders/texture/fragment.glsl?raw";
import { handleResize } from "@/utils";

export default () => {
  const gl = (document.querySelector("#c") as HTMLCanvasElement).getContext("webgl");
  if (!gl) {
    return;
  }
  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);

  const arrays = {
    a_position: {
      numComponents: 3,
      data: [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],
    },
    uv: { numComponents: 2, data: [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0] },
  };
  const texture = twgl.createTextures(
    gl,
    {
      base: {
        src: "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
        crossOrigin: "anonymous",
        flipY: 1,
        min: gl.NEAREST,
        mag: gl.NEAREST,
      },
      cover: {
        src: "/circle.gif",
        crossOrigin: "anonymous",
        flipY: 1,
        min: gl.NEAREST,
        mag: gl.NEAREST,
      },
    },
    (err) => {
      if (!err) {
        render();
      }
    }
  );
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  function render() {
    if (!gl) {
      return;
    }

    const uniforms = {
      u_texture: texture.base,
      u_cover: texture.cover,
      u_matrix: twgl.m4.scale(twgl.m4.identity(), [1.5, 1.5, 1.5]),
    };
    gl.clear(gl.COLOR_BUFFER_BIT);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  }
  handleResize(gl);
  window.addEventListener("resize", () => {
    handleResize(gl);
  });
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};
