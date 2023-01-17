precision mediump float;

uniform vec3 u_diffuseLight;
uniform vec3 u_ambientLight;
uniform vec3 u_lightPosition;
uniform float u_shininess;
uniform vec3 u_specularColor;
uniform vec3 cameraPosition;
uniform vec4 u_color;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
  vec3 normal = normalize(v_normal);
  // 计算光线方向
  vec3 lightDirection = normalize(u_lightPosition - v_position);
  // 计算顶点到相机的方向
  vec3 cameraDirection = normalize(cameraPosition - v_position);
  /*
  * 当光线入射角与反射角与眼睛和光源的夹角相同，这时光线就会反射到眼前
  * 用两个方向的中间向量与法线向量点积，为1时方向相同，为-1时方向相反，为0时方向垂直
  */
  vec3 halfVector = normalize(lightDirection + cameraDirection);
  // 计算光线方向与法线的点积，当点积值小于0时，说明入射角大于90度，光线照射在背面。
  float nDotL = dot(normal, lightDirection);
  // 计算高光颜色
  float specular = 0.0;
  if (nDotL > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }
  vec3 specularColor = u_specularColor * specular;
  // 漫反射光颜色
  vec3 diffuseColor = u_diffuseLight * u_color.rgb * nDotL;
  // 环境反射光颜色
  vec3 ambientColor = u_ambientLight * u_color.rgb;
  gl_FragColor = vec4(diffuseColor + ambientColor + specularColor, u_color.a);
}