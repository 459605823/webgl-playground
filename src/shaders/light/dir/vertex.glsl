attribute vec4 a_position;
attribute vec4 a_normal;

uniform mat4 u_mvpMatrix;
uniform mat4 u_normalMatrix;
uniform vec3 u_diffuseLight;
uniform vec3 u_lightDirection;

varying vec3 v_diffuse;

void main() {
  // 计算变换后的法向量
  vec4 normal = u_normalMatrix * a_normal;
  // 计算光线方向与法线的点积，当点积值小于0时，说明入射角大于90度，光线照射在背面。
  float nDotL = max(dot(u_lightDirection, normalize(normal.xyz)), 0.0);
  // 计算漫反射光的颜色
  v_diffuse = u_diffuseLight * nDotL;
  gl_Position = u_mvpMatrix * a_position;
}