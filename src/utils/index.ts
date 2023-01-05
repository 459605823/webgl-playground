export const getWebGLCoordinate = (
  clientX: number,
  clientY: number,
  left: number,
  top: number,
  width: number,
  height: number
) => {
  const x = (clientX - left - width / 2) / (width / 2);
  const y = -(clientY - top - height / 2) / (height / 2);
  return {x, y};
};
