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

export const randFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const randFloatSpread = (range: number) => {
  return range * (0.5 - Math.random());
}

export const randInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randIntSpread = (range: number) => {
  return Math.floor(range * (0.5 - Math.random()));
}
