attribute vec4 position;
attribute vec4 color;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 v_color;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * position;
  v_color = color;
}