attribute vec4 a_position;
attribute float a_size;
attribute vec3 a_color;

varying vec4 v_color;

void main() {
  gl_Position = a_position;
  gl_PointSize = a_size * 1.0;

  v_color = vec4(a_color, 1.0);
}