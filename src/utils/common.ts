import * as twgl from 'twgl.js';

export const handleResize = (gl: WebGLRenderingContext) => {
  twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
