precision mediump float;

uniform vec3 u_diffuseLight;
uniform vec3 u_ambientLight;
uniform vec3 u_lightPosition;
uniform vec4 u_color;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  // 计算光线方向
  vec3 lightDirection = normalize(u_lightPosition - v_position);
  // 计算光线方向与法线的点积，当点积值小于0时，说明入射角大于90度，光线照射在背面。
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // 漫反射光颜色
  vec3 diffuseColor = u_diffuseLight * u_color.rgb * nDotL;
  // 环境反射光颜色
  vec3 ambientColor = u_ambientLight * u_color.rgb;
  gl_FragColor = vec4(diffuseColor + ambientColor, u_color.a);
}