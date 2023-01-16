precision mediump float;

varying vec4 v_color;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  if (d > 0.5) discard;
  gl_FragColor = v_color;
}