attribute vec4 a_position;
attribute vec4 a_normal;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  gl_Position = mvpMatrix * a_position;
  // 计算变换后的法向量
  v_normal = normalize(vec3(normalMatrix * a_normal));
  // 获取顶点世界坐标
  v_position = vec3(modelMatrix * a_position);
}