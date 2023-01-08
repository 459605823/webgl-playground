attribute vec4 a_position;
attribute vec3 a_color;

uniform mat4 u_Matrix;

varying vec3 v_color;

void main() {
  gl_Position = u_Matrix * a_position;
  v_color = a_color;
}