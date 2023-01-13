import * as twgl from "twgl.js";
import vertexShader from "@/shaders/cube/vertex.glsl?raw";
import fragmentShader from "@/shaders/cube/fragment.glsl?raw";
import {handleResize, degToRad} from '@/utils'

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
    position: [
      0.0, 1.0, -4.0, -0.5, -1.0, -4.0, 0.5, -1.0, -4.0,
      0.0, 1.0, 0.0, -0.5, -1.0, 0.0, 0.5, -1.0, 0.0,
      0.0, 1.0, -2.0, -0.5, -1.0, -2.0, 0.5, -1.0, -2.0,
    ],
    color: {
      numComponents: 3,
      data: [
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 1.0, 0.4, 0.4,
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 0.4, 0.4,
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 1.0, 0.4, 0.4,
      ],
    },
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  const projection = twgl.m4.perspective(degToRad(30), canvas.clientWidth / canvas.clientHeight, 1, 100);

  let tx = -0.75, ty = 0, tz = 0;
  let cx = 0, cy = 0, cz = 5;

  function render() {
    if (!gl) return;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const camera = twgl.m4.lookAt([cx, cy, cz], [0, 0, -100], [0, 1, 0]);
    const view = twgl.m4.inverse(camera);
    const viewProjection = twgl.m4.multiply(projection, view);
    const model = twgl.m4.translation([tx, ty, tz]);
    const mvp = twgl.m4.multiply(viewProjection, model);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, {
      u_mvpMatrix: mvp,
    });
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  }
  handleResize(gl)
  window.addEventListener("resize", handleResize.bind(null, gl));
  requestAnimationFrame(render);
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case "ArrowRight":
        tx += 0.01;
        break;
      case 'ArrowLeft':
        tx -= 0.01;
        break;
      case 'ArrowUp':
        ty += 0.01;
        break;
      case 'ArrowDown':
        ty -= 0.01;
        break;
      case 'w':
        cz -= 0.01;
        break;
      case 's':
        cz += 0.01;
        break;
      case 'a':
        cx -= 0.01;
        break;
      case 'd':
        cx += 0.01;
        break;
      case ' ':
        cy += 0.01;
        break;
      default:
        break;
    }
    render()
  })
};
