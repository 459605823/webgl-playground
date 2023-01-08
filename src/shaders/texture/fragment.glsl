precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_cover;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(u_texture, vUv) * texture2D(u_cover, vUv);
}