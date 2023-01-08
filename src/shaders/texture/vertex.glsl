attribute vec4 a_position;
attribute vec2 uv;

uniform mat4 u_matrix;

varying vec2 vUv;

void main() {
  gl_Position = u_matrix * a_position;
  vUv = uv;
}