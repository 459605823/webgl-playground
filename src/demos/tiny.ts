import * as twgl from 'twgl.js';
import vertexShader from '@/shaders/tiny/vertex.glsl?raw';
import fragmentShader from '@/shaders/tiny/fragment.glsl?raw';

export default () =>  {
  const gl = (document.querySelector('#c') as HTMLCanvasElement).getContext(
    'webgl'
  );
  if (!gl) {
    return;
  }
  const programInfo = twgl.createProgramInfo(gl, [
    vertexShader,
    fragmentShader,
  ]);

  const arrays = {
    position: [0, 0, 0, 0.7, 0, 0, 0, 0.5, 0],
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  function render(time: number) {
    if (!gl) {
      return;
    }
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
      time: time * 0.001,
      resolution: [gl.canvas.width, gl.canvas.height],
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};
