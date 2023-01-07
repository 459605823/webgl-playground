import * as twgl from 'twgl.js';
import pointVertexShader from '@/shaders/clickedPoints/vertex.glsl?raw';
import pointFragmentShader from '@/shaders/clickedPoints/fragment.glsl?raw';
import lineVextexShader from '@/shaders/line/vertex.glsl?raw';
import lineFragmentShader from '@/shaders/line/fragment.glsl?raw';
import {getWebGLCoordinate, randFloat, handleResize} from '@/utils';

export default () => {
  const canvas = document.querySelector('#c') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }
  const pointProgram = twgl.createProgramInfo(gl, [
    pointVertexShader,
    pointFragmentShader,
  ]);
  const lineProgram = twgl.createProgramInfo(gl, [
    lineVextexShader,
    lineFragmentShader,
  ]);
  const arrays: Record<string, any> = {
    a_position: {numComponents: 3, data: []},
    a_size: {numComponents: 1, data: []},
    a_color: {numComponents: 3, data: []},
  };

  const rect = canvas.getBoundingClientRect();
  const {width, height, left, top} = rect;
  let isDrawing = false;
  let pointCount = 0;
  canvas.onmousedown = (e) => {
    isDrawing = !isDrawing;
    const {x, y} = getWebGLCoordinate(
      e.clientX,
      e.clientY,
      left,
      top,
      width,
      height
    );
    arrays.a_position.data[pointCount * 3] = x;
    arrays.a_position.data[pointCount * 3 + 1] = y;
    arrays.a_position.data[pointCount * 3 + 2] = 0;
    arrays.a_size.data[pointCount] = randFloat(10, 20);
    arrays.a_color.data[pointCount * 3] = randFloat(0.1, 1);
    arrays.a_color.data[pointCount * 3 + 1] = randFloat(0.1, 1);
    arrays.a_color.data[pointCount * 3 + 2] = randFloat(0.1, 1);
    pointCount += 1;
    render();
  };
  canvas.onmousemove = (e) => {
    if (!isDrawing) return;
    const {x, y} = getWebGLCoordinate(
      e.clientX,
      e.clientY,
      left,
      top,
      width,
      height
    );
    arrays.a_position.data[pointCount * 3] = x;
    arrays.a_position.data[pointCount * 3 + 1] = y;
    arrays.a_position.data[pointCount * 3 + 2] = 0;
    arrays.a_size.data[pointCount] = 10;
    arrays.a_color.data[pointCount * 3] = 1;
    arrays.a_color.data[pointCount * 3 + 1] = 1;
    arrays.a_color.data[pointCount * 3 + 2] = 1;
    render();
  };
  handleResize(gl);
  window.addEventListener('resize', handleResize.bind(null, gl));
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  function render() {
    if (!gl) {
      return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    gl.useProgram(pointProgram.program);
    twgl.setBuffersAndAttributes(gl, pointProgram, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
    gl.useProgram(lineProgram.program);
    twgl.setBuffersAndAttributes(gl, lineProgram, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl.LINE_LOOP);
  }
};
