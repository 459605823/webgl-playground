import * as twgl from 'twgl.js';

export const handleResize = (gl: WebGLRenderingContext) => {
  twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

export const createElementNS = ( name: string ) => {
	return document.createElementNS( 'http://www.w3.org/1999/xhtml', name );
}
