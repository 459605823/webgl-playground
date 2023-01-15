attribute vec4 a_position;
attribute vec4 a_normal;

uniform mat4 u_mvpMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  gl_Position = u_mvpMatrix * a_position;
  // 计算变换后的法向量
  v_normal = normalize(vec3(u_normalMatrix * a_normal));
  // 获取顶点世界坐标
  v_position = vec3(u_modelMatrix * a_position);
}