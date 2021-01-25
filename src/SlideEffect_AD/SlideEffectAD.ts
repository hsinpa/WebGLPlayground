import SimpleCanvas from '../Hsinpa/SimpleCanvas';
import {GetImagePromise, Lerp} from '../Hsinpa/UtilityMethod';
import SlideEffectHelper from './SlideEffectHelper';
import SlideEffectAnimation from './SlideEffectAnimation';

import {SlideDownParameter, SlideUpParameter, SlideParameter, SlideAnimationType, SlideEffectStateEnum, SlideSettingSet} from './GLSLType';
const reglPromise = import('regl');
import REGL, {Regl} from 'regl';
import {animate} from 'popmotion';

class SlideEffectAD extends SimpleCanvas {

    _config : SlideSettingSet;
    _index : number = 0;

    reglCanvas : Regl;
    webglDom : HTMLCanvasElement;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    slideEffectAnimation : SlideEffectAnimation;
    slideEffectHelper : SlideEffectHelper;

    mainImage : HTMLImageElement;
    nextImage : HTMLImageElement;
    dissolveTex : HTMLImageElement;

    dynamicREGLTexture : REGL.Texture2D;

    width = 1024;
    height = 750;
    time = 0;

    canvasPosX = 0.5;
    canvasPosY = 0.5;

    //WEBGL Parameters
    webglSpeed = 1.0;
    webglScale = 1.0;
    webglStrength = 0.0;

    _state : SlideEffectStateEnum = SlideEffectStateEnum.Normal;

    //One canvas to draw, one canvas for opengl effect
    constructor(canvas2DQueryString :string, webglQueryString : string, vertexFilePath : string, fragmentFilePath : string, config : SlideSettingSet) {
        super(canvas2DQueryString);

        this._config = config;
        this.slideEffectAnimation = new SlideEffectAnimation();
        this.slideEffectHelper = new SlideEffectHelper();
        this.IsProgramValid = (this.IsProgramValid && this._config != null &&  this._config.components.length > 0);
        if (this.IsProgramValid) {
            this.SetupWebglPipeline(webglQueryString, vertexFilePath, fragmentFilePath);
        }

        let tempNextBtn = document.querySelector("button[name='next']");
        tempNextBtn.addEventListener('click', this.OnNextImageClick.bind(this));

        let tempPreviousBtn = document.querySelector("button[name='previous']");
        tempPreviousBtn.addEventListener('click', this.OnPreviousImageClick.bind(this));

        window.addEventListener('wheel', this.OnWheelImageClick.bind(this));
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


        let mainTexWidth = this.width * this.webglScale;
        let mainTexHeight = this.height * this.webglScale;
        let canvasPosX = (this.screenWidth * this.canvasPosX) - (mainTexWidth * this.canvasPosX);
        let canvasPosY = (this.screenHeight * this.canvasPosY) - (mainTexHeight * 0.5);

        this._context.drawImage(this.mainImage, canvasPosX, canvasPosY, mainTexWidth, mainTexHeight);       

        if (this._state != SlideEffectStateEnum.Normal) {
            let dir = (this._state == SlideEffectStateEnum.SlideDown) ? -1 : 1;
            let nextYPos = (this.screenHeight * (this.canvasPosY + dir)) - (mainTexHeight * 0.5);
            this._context.drawImage(this.nextImage, canvasPosX, nextYPos, mainTexWidth, mainTexHeight);
        }

        this.dynamicREGLTexture.subimage(this._context);
    }

    async LoadImages() {
        this.mainImage = await this.slideEffectHelper.GetImage(this._config.components[this._index].mainTex);

        //Noise
        let noiseTexPath = "./image/noise_tex_02.jpg";
        this.dissolveTex = await this.slideEffectHelper.GetImage(noiseTexPath);

        //Cache image first
        if (this._index >= 0 && (this._index + 1) < this._config.components.length) {
            this.slideEffectHelper.GetImage(this._config.components[this._index+1].mainTex);
        }

        if (this._index > 0) {
            this.slideEffectHelper.GetImage(this._config.components[this._index-1].mainTex);
        }

        //this.SetImageToCenter(this.mainImage, this.width, this.height);
    }

    //#region  Sliding Effect Group
    OnWheelImageClick(event : WheelEvent) {
        console.log(event.deltaY);

        if (event.deltaY > 0)
            this.OnNextImageClick(null);

        if (event.deltaY < 0)
            this.OnPreviousImageClick(null);
    }


    OnPreviousImageClick(event : MouseEvent) {
        if (this._index <= 0) return;

        this.OnSlideEffect(SlideEffectStateEnum.SlideUp, SlideUpParameter);
    }

    //Test Purpose
    OnNextImageClick(event : MouseEvent) {
        if (this._index + 1 >= this._config.components.length) return;
        console.log(this._index, this._config.components.length);

        this.OnSlideEffect(SlideEffectStateEnum.SlideDown, SlideDownParameter);
    }

    async OnSlideEffect(state : SlideEffectStateEnum, slideParameter : SlideParameter ) {
        if (this._state != SlideEffectStateEnum.Normal) return;

        let panelDom : HTMLBodyElement = document.querySelector(this._config.components[this._index].query);
        let nextPanelDom : HTMLBodyElement = document.querySelector(this._config.components[this._index + slideParameter.direction].query);

        this.nextImage = await this.slideEffectHelper.GetImage(this._config.components[this._index + slideParameter.direction].mainTex);

        panelDom.style.animationName = slideParameter.cssAnimationNameOut;
        nextPanelDom.style.animationName = slideParameter.cssAnimationNameIn;
        nextPanelDom.setAttribute("data-visibility", "true");
        this._state = state;

        this.slideEffectAnimation.CreateSlideAnim(
            [{y_position : this.canvasPosY, scale : this.webglScale, gl_strength : this.webglStrength},
            {y_position : this.canvasPosY, scale : 0.9, gl_strength : 0.03},
                {y_position : slideParameter.targetPosY, scale : 1, gl_strength : 0.0}
            ],
            
            3000,
            (x : SlideAnimationType) => {

                this.canvasPosY = x.y_position;
                this.webglScale  =  x.scale;

                this.canvasPosY = (x.y_position);
        
                this.webglStrength = x.gl_strength;

            }, () => {
                this._index = this._index + slideParameter.direction;
                this._state = SlideEffectStateEnum.Normal;
                this.canvasPosY = 0.5;
                panelDom.setAttribute("data-visibility", "false");
                panelDom.style.animationName = "";
                nextPanelDom.style.animationName = "";
                this.LoadImages();
            });

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
            //this.SetImageToCenter(this.mainImage, this.width, this.height);
            this.dynamicREGLTexture.resize(this._canvasDom.width, this._canvasDom.height);
            this.UpdateProcess();
        }
    }
}

export default SlideEffectAD;