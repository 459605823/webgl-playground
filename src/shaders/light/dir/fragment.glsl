precision mediump float;

uniform vec4 u_color;
uniform vec3 ambientLightColor;

varying vec3 v_diffuse;

void main() {
  // 漫反射光颜色
  vec3 diffuseColor = v_diffuse * u_color.rgb;
  // 环境反射光颜色
  vec3 ambientColor = ambientLightColor * u_color.rgb;
  gl_FragColor = vec4(diffuseColor + ambientColor, u_color.a);
}