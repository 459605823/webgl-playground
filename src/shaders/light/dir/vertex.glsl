attribute vec4 a_position;
attribute vec4 a_normal;

uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
uniform vec3 directionLightColor;
uniform vec3 directionLightPosition;

varying vec3 v_diffuse;

void main() {
  // 计算变换后的法向量
  vec4 normal = normalMatrix * a_normal;
  // 计算光线方向与法线的点积，当点积值小于0时，说明入射角大于90度，光线照射在背面。
  float nDotL = max(dot(directionLightPosition, normalize(normal.xyz)), 0.0);
  // 计算漫反射光的颜色
  v_diffuse = directionLightColor * nDotL;
  gl_Position = mvpMatrix * a_position;
}