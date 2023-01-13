attribute vec4 position;
attribute vec4 color;

uniform mat4 u_mvpMatrix;

varying vec4 v_color;

void main() {
  gl_Position = u_mvpMatrix * position;
  v_color = color;
}