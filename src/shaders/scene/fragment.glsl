precision mediump float;

varying vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

void main() {
  gl_FragColor = v_color * u_colorMult + u_colorOffset;
}