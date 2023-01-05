import * as twgl from 'twgl.js';
import vertexShader from '@/shaders/clickedPoints/vertex.glsl?raw';
import fragmentShader from '@/shaders/clickedPoints/fragment.glsl?raw';
import {getWebGLCoordinate} from '@/utils';

export default () => {
  const canvas = document.querySelector('#c') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }
  const programInfo = twgl.createProgramInfo(gl, [
    vertexShader,
    fragmentShader,
  ]);
  const arrays: {position: number[]} = {
    position: [],
  };

  const rect = canvas.getBoundingClientRect();
  const {width, height, left, top} = rect;
  canvas.onmousedown = (e) => {
    const {x, y} = getWebGLCoordinate(
      e.clientX,
      e.clientY,
      left,
      top,
      width,
      height
    );
    arrays.position.push(x, y, 0);
    render();
  };
  function render() {
    if (!gl) {
      return;
    }
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
  }
};
