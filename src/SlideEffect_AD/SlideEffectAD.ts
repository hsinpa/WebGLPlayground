import SimpleCanvas from '../Hsinpa/SimpleCanvas';
import {GetImagePromise, Lerp} from '../Hsinpa/UtilityMethod';
import SlideEffectHelper from './SlideEffectHelper';
import SlideEffectAnimation from './SlideEffectAnimation';

import {GLSLDataSet, GLSLPropADP6, SlideAnimationType, SlideEffectStateEnum} from './GLSLType';
const reglPromise = import('regl');
import REGL, {Regl} from 'regl';
import {animate} from 'popmotion';

class SlideEffectAD extends SimpleCanvas {

    reglCanvas : Regl;
    webglDom : HTMLCanvasElement;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    slideEffectAnimation : SlideEffectAnimation;
    slideEffectHelper : SlideEffectHelper;
    mainImage : HTMLImageElement;
    dissolveTex : HTMLImageElement;

    dynamicREGLTexture : REGL.Texture2D;

    oriWidth = 1024;
    oriheight = 750;
    width = 1024;
    height = 750;
    time = 0;

    canvasPosX = 0;
    canvasPosY = 0;

    //WEBGL Parameters
    webglSpeed = 1.0;
    webglScale = 1.0;
    webglStrength = 0.0;

    _state : SlideEffectStateEnum = SlideEffectStateEnum.Normal;

    //One canvas to draw, one canvas for opengl effect
    constructor(canvas2DQueryString :string, webglQueryString : string, vertexFilePath : string, fragmentFilePath : string) {
        super(canvas2DQueryString);

        this.slideEffectAnimation = new SlideEffectAnimation();
        this.slideEffectHelper = new SlideEffectHelper();

        if (this.IsProgramValid) {
            this.SetupWebglPipeline(webglQueryString, vertexFilePath, fragmentFilePath);
        }
        let tempNextBtn = document.querySelector("button[name='next']");
        tempNextBtn.addEventListener('click', this.OnNextImageClick.bind(this));
    }

    async SetupWebglPipeline(webglQueryString : string, vertexFilePath : string, fragmentFilePath : string) {
        await this.LoadImages();

        this.webglDom = document.querySelector(webglQueryString);
        this.reglCanvas  = await this.CreatREGLCanvas(this.webglDom);
        this.dynamicREGLTexture = this.reglCanvas.texture({data:this._canvasDom, flipY: true});
        this.reglDrawCommand  = await this.PrepareREGLCommand(this.reglCanvas, vertexFilePath, fragmentFilePath);
        this.DrawREGL(this.reglCanvas, this.reglDrawCommand);

        this.UpdateProcess();
    }

    async CreatREGLCanvas(webglDom : HTMLCanvasElement) {
        let regl = await reglPromise;

        this.SetCanvasToSceenSize(webglDom);
        return regl.default(webglDom);
    }

    async PrepareREGLCommand(regl : Regl, vertexFilePath : string, fragmentFilePath : string) {
        let glslSetting = await this.slideEffectHelper.PrepareREGLShader(regl, vertexFilePath, fragmentFilePath);
        return this.slideEffectHelper.CreateREGLCommandObj(regl, glslSetting.vertex_shader, glslSetting.fragment_shader, this.dynamicREGLTexture, this.dissolveTex);
    }


    DrawREGL(regl : Regl, drawCommand : REGL.DrawCommand) {
        let self = this;

        this.reglFrame = regl.frame(function (context) {  

            if (self._state != SlideEffectStateEnum.Normal)
                self.UpdateProcess();

            self.time = context.time;   
            regl.clear({
                color: [0, 0, 0, 1],
                depth: 1
            });    
            
            drawCommand({
                speed : self.webglSpeed,
                strength : self.webglStrength,
                scale : self.webglScale,
                time : context.time
            });
        });
    }

    private UpdateProcess() {
        this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);

        // if (this._state != SlideEffectStateEnum.Normal)
        //     this.canvasPosY = Lerp(this.canvasPosY, this.targetPosY, 0.1);

        this._context.drawImage(this.mainImage, this.canvasPosX, this.canvasPosY, this.width, this.height);
        this.dynamicREGLTexture.subimage(this._context);
    }

    async LoadImages() {
        let mainTexPath = "./image/ADP9_Clone/Th06Main.jpg";
        this.mainImage = await GetImagePromise(mainTexPath);

        let noiseTexPath = "./image/noise_tex_02.jpg";
        this.dissolveTex = await GetImagePromise(noiseTexPath);

        this.SetImageToCenter(this.mainImage, this.width, this.height);
    }

    //#region  Sliding Effect Group
    //Test Purpose
    OnNextImageClick(event : MouseEvent) {
        let panelDom : HTMLBodyElement = document.querySelector(".slide_panel[name='touhou_6']");

        if (panelDom.style.animationName ==  "slidein") {
            panelDom.style.animationName = "";
            this._state = SlideEffectStateEnum.Normal;
        } else {
            panelDom.style.animationName = "slidein";
            this._state = SlideEffectStateEnum.SlideDown;

            this.slideEffectAnimation.CreateSlideAnim(
                [{y_position : this.canvasPosY, scale : this.webglScale, gl_strength : this.webglStrength},
                {y_position : this.canvasPosY, scale : 0.8, gl_strength : 0.04},
                 {y_position : this.canvasPosY + this.screenHeight, scale : 1, gl_strength : 0.0}
                ],
                
                
                3000,
                (x : SlideAnimationType) => {

                    this.canvasPosY = x.y_position;
                    this.width  = this.oriWidth * x.scale;
                    this.height = this.oriheight * x.scale;
                    this.canvasPosX = (this.screenWidth * 0.5) - (this.width * 0.5);
                    this.canvasPosY = (x.y_position * 0.5) - (this.height * 0.5);
            
                    this.webglStrength = x.gl_strength;

                }, () => {
                    this._state = SlideEffectStateEnum.Normal;
                });
        }
    }
    //#endregion

    SetImageToCenter(image : HTMLImageElement, width : number, height : number) {
        this.canvasPosX = (this.screenWidth * 0.5) - (width * 0.5);
        this.canvasPosY = (this.screenHeight * 0.5) - (height * 0.5);
    }

    SetCanvasSize() {
        super.SetCanvasSize();
        if (!this.IsProgramValid || this.webglDom == null) return;
        
        super.SetCanvasToSceenSize(this.webglDom);

        if(this.mainImage != null) {
            this.SetImageToCenter(this.mainImage, this.width, this.height);
            this.dynamicREGLTexture.resize(this._canvasDom.width, this._canvasDom.height);
            this.UpdateProcess();
        }
    }
}

export default SlideEffectAD;