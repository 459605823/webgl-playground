precision mediump float;

uniform float u_width;
uniform float u_height;

varying vec3 v_color;

void main() {
  gl_FragColor = vec4(gl_FragCoord.x / u_width, 0.0, gl_FragCoord.y / u_height, 1.0);
}