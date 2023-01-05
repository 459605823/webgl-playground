import * as twgl from 'twgl.js';
import vertexShader from '@/shaders/clickedPoints/vertex.glsl?raw';
import fragmentShader from '@/shaders/clickedPoints/fragment.glsl?raw';
import {getWebGLCoordinate, randFloat} from '@/utils';

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
  const arrays: Record<string, any> = {
    a_position: {numComponents: 3, data: []},
    a_size: {numComponents: 1, data: []},
    a_color: {numComponents: 3, data: []},
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
    arrays.a_position.data.push(x, y, 0);
    arrays.a_size.data.push(randFloat(10, 20));
    arrays.a_color.data.push(
      randFloat(0.1, 1),
      randFloat(0.1, 1),
      randFloat(0.1, 1)
    );
    render();
  };
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  function render() {
    if (!gl) {
      return;
    }
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
  }
};
