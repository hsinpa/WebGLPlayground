import SimpleCanvas from "../Hsinpa/SimpleCanvas.js";
import SlideEffectHelper from "./SlideEffectHelper.js";
import SlideEffectAnimation from "./SlideEffectAnimation.js";
import {SlideDownParameter, SlideUpParameter, SlideEffectStateEnum} from "./GLSLType.js";
const reglPromise = import("../../_snowpack/pkg/regl.js");
class SlideEffectAD extends SimpleCanvas {
  constructor(canvas2DQueryString, webglQueryString, vertexFilePath, fragmentFilePath, config) {
    super(canvas2DQueryString);
    this._index = 0;
    this.width = 1024;
    this.height = 750;
    this.canvasPosX = 0.5;
    this.canvasPosY = 0.5;
    this.webglSpeed = 1;
    this.webglScale = 1;
    this.webglStrength = 0;
    this.time = 0;
    this._state = SlideEffectStateEnum.Normal;
    this._config = config;
    this.slideEffectAnimation = new SlideEffectAnimation();
    this.slideEffectHelper = new SlideEffectHelper();
    this.IsProgramValid = this.IsProgramValid && this._config != null && this._config.components.length > 0;
    if (this.IsProgramValid) {
      this.SetupWebglPipeline(webglQueryString, vertexFilePath, fragmentFilePath);
      window.addEventListener("wheel", this.OnWheelImageClick.bind(this));
    }
  }
  async SetupWebglPipeline(webglQueryString, vertexFilePath, fragmentFilePath) {
    await this.LoadImages();
    this.webglDom = document.querySelector(webglQueryString);
    this.reglCanvas = await this.CreatREGLCanvas(this.webglDom);
    this.dynamicREGLTexture = this.reglCanvas.texture({data: this._canvasDom, flipY: true});
    this.reglDrawCommand = await this.PrepareREGLCommand(this.reglCanvas, vertexFilePath, fragmentFilePath);
    this.DrawREGL(this.reglCanvas, this.reglDrawCommand);
    this.UpdateProcess();
  }
  async CreatREGLCanvas(webglDom) {
    let regl = await reglPromise;
    this.SetCanvasToSceenSize(webglDom);
    return regl.default(webglDom);
  }
  async PrepareREGLCommand(regl, vertexFilePath, fragmentFilePath) {
    let glslSetting = await this.slideEffectHelper.PrepareREGLShader(regl, vertexFilePath, fragmentFilePath);
    return this.slideEffectHelper.CreateREGLCommandObj(regl, glslSetting.vertex_shader, glslSetting.fragment_shader, this.dynamicREGLTexture, this.dissolveTex);
  }
  DrawREGL(regl, drawCommand) {
    let self = this;
    this.reglFrame = regl.frame(function(context) {
      if (self._state != SlideEffectStateEnum.Normal)
        self.UpdateProcess();
      self.time = context.time;
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
      });
      drawCommand({
        speed: self.webglSpeed,
        strength: self.webglStrength,
        scale: self.webglScale,
        time: context.time
      });
    });
  }
  UpdateProcess() {
    this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);
    let mainTexWidth = this.width * this.webglScale, xCenterOffSet = mainTexWidth * 0.5;
    let mainTexHeight = this.height * this.webglScale, yCenterOffset = mainTexHeight * 0.5;
    let canvasPosX = this.screenWidth * this.canvasPosX - xCenterOffSet;
    let canvasPosY = this.screenHeight * this.canvasPosY - yCenterOffset;
    this._context.drawImage(this.mainImage, canvasPosX, canvasPosY, mainTexWidth, mainTexHeight);
    if (this._state != SlideEffectStateEnum.Normal) {
      let dir = this._state == SlideEffectStateEnum.SlideDown ? -1 : 1;
      let nextYPos = this.screenHeight * (this.canvasPosY + dir) - yCenterOffset;
      this._context.drawImage(this.nextImage, canvasPosX, nextYPos, mainTexWidth, mainTexHeight);
    }
    this.dynamicREGLTexture.subimage(this._context);
  }
  async LoadImages() {
    this.mainImage = await this.slideEffectHelper.GetImage(this._config.components[this._index].mainTex);
    let noiseTexPath = "./image/noise_tex_02.jpg";
    this.dissolveTex = await this.slideEffectHelper.GetImage(noiseTexPath);
    if (this._index >= 0 && this._index + 1 < this._config.components.length) {
      this.slideEffectHelper.GetImage(this._config.components[this._index + 1].mainTex);
    }
    if (this._index > 0) {
      this.slideEffectHelper.GetImage(this._config.components[this._index - 1].mainTex);
    }
  }
  OnWheelImageClick(event) {
    if (event.deltaY > 0)
      this.OnNextImageClick(null);
    if (event.deltaY < 0)
      this.OnPreviousImageClick(null);
  }
  OnPreviousImageClick(event) {
    if (this._index <= 0)
      return;
    this.OnSlideEffect(SlideEffectStateEnum.SlideUp, SlideUpParameter);
  }
  OnNextImageClick(event) {
    if (this._index + 1 >= this._config.components.length)
      return;
    this.OnSlideEffect(SlideEffectStateEnum.SlideDown, SlideDownParameter);
  }
  async OnSlideEffect(state, slideParameter) {
    if (this._state != SlideEffectStateEnum.Normal)
      return;
    let panelDom = document.querySelector(this._config.components[this._index].query);
    let nextPanelDom = document.querySelector(this._config.components[this._index + slideParameter.direction].query);
    this.nextImage = await this.slideEffectHelper.GetImage(this._config.components[this._index + slideParameter.direction].mainTex);
    panelDom.style.animationName = slideParameter.cssAnimationNameOut;
    nextPanelDom.style.animationName = slideParameter.cssAnimationNameIn;
    nextPanelDom.setAttribute("data-visibility", "true");
    this._state = state;
    this.slideEffectAnimation.CreateSlideAnim([
      {y_position: this.canvasPosY, scale: this.webglScale, gl_strength: this.webglStrength},
      {y_position: this.canvasPosY, scale: 0.9, gl_strength: 0.03},
      {y_position: slideParameter.targetPosY, scale: 1, gl_strength: 0}
    ], 3e3, (x) => {
      this.canvasPosY = x.y_position;
      this.webglScale = x.scale;
      this.canvasPosY = x.y_position;
      this.webglStrength = x.gl_strength;
    }, () => {
      this._index = this._index + slideParameter.direction;
      this._state = SlideEffectStateEnum.Normal;
      this.canvasPosY = 0.5;
      panelDom.setAttribute("data-visibility", "false");
      this.LoadImages();
    });
  }
  SetCanvasSize() {
    super.SetCanvasSize();
    if (!this.IsProgramValid || this.webglDom == null)
      return;
    super.SetCanvasToSceenSize(this.webglDom);
    if (this.mainImage != null) {
      this.dynamicREGLTexture.resize(this._canvasDom.width, this._canvasDom.height);
      this.UpdateProcess();
    }
  }
}
export default SlideEffectAD;
