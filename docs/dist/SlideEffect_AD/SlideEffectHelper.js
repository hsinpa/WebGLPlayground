import {Dictionary} from "../../_snowpack/pkg/typescript-collections.js";
import {GetImagePromise} from "../Hsinpa/UtilityMethod.js";
class SlideEffectHelper {
  constructor() {
    this.textureCache = new Dictionary();
  }
  async PrepareREGLShader(regl, vertFilePath, fragFilePath) {
    let VertPros = fetch(vertFilePath, {method: "GET", credentials: "include"});
    let FragPros = fetch(fragFilePath, {method: "GET", credentials: "include"});
    return Promise.all([VertPros, FragPros]).then((responses) => Promise.all([responses[0].text(), responses[1].text()])).then((values) => {
      let gLSLDataSet = {
        vertex_shader: values[0],
        fragment_shader: values[1]
      };
      return gLSLDataSet;
    });
  }
  CreateREGLCommandObj(regl, vertex, fragment, canvasTex, noiseTex) {
    return regl({
      frag: fragment,
      vert: vertex,
      blend: {
        enable: true
      },
      attributes: {
        a_position: [
          [-1, -1],
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, 1],
          [1, -1]
        ]
      },
      uniforms: {
        color: [1, 0, 0, 1],
        texture: canvasTex,
        noiseTex: regl.texture({data: noiseTex, wrap: "repeat"}),
        time: regl.prop("time"),
        speed: regl.prop("speed"),
        strength: regl.prop("strength"),
        scale: regl.prop("scale")
      },
      count: 6
    });
  }
  async GetImage(path) {
    if (this.textureCache.containsKey(path)) {
      return this.textureCache.getValue(path);
    }
    let texture = await GetImagePromise(path);
    this.textureCache.setValue(path, texture);
    return texture;
  }
}
export default SlideEffectHelper;
