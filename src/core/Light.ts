import { Object3D } from "./Object3D";
import type {v3} from 'twgl.js'

abstract class Light extends Object3D {
  type = "Light";

  isLight = true

  constructor(public color: v3.Vec3, public intensity = 1) {
    super();
  }
}

class AmbientLight extends Light {
  type = "AmbientLight";

  isAmbientLight = true

  constructor(color: v3.Vec3, intensity = 1) {
    super(color, intensity);
  }
}

class DirectionLight extends Light {
  type = "DirectionLight";

  isDirectionLight = true

  target = new Object3D();

  constructor(color: v3.Vec3, intensity = 1) {
    super(color, intensity);
  }
}

class PointLight extends Light {
  type = 'PointLight'

  isPointLight = true

  constructor(color: v3.Vec3, intensity = 1) {
    super(color, intensity);
  }
}

export {Light, AmbientLight, DirectionLight, PointLight}