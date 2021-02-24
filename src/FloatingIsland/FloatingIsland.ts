import WebGLCanvas from '../Hsinpa/WebGL/WebglCanvas'
import REGL, {Regl} from 'regl';
import WebglUtility from '../Hsinpa/WebGL/WebglUtility';
import {CreateREGLCommandObj } from './FIslandREGL';
import {GlitchGLConfig } from '../GlitchEffect/GlitchREGL';
import GlitchInfo from '../GlitchEffect/GlitchInfo';
import {GetImagePromise} from '../Hsinpa/UtilityMethod';

class FloatingIsland extends WebGLCanvas {
    //#region Parameters
    reglCanvas : Regl;
    dynamicREGLTexture : REGL.Texture2D;
    nextREGLTexture : REGL.Texture2D;
    webglUtility : WebglUtility;
    glitchInfo : GlitchInfo;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    width = 1024;
    height = 750;

    imagePosX = 0.5;
    imagePosY = 0.5;

    //#endregion
    //#region Inspector
    //WEBGL Parameters
    webglSpeed = 1.0;
    webglScale = 0.7;
    webglStrength = 0.0;
    webglDisplacement = 0.0;
    private time = 0;
    //#endregion

    constructor( config: GlitchGLConfig, vertexFilePath : string, fragmentFilePath : string) {
        super(config.canvas_domQuery, config.webgl_domQuery);
        this.webglUtility = new WebglUtility();
        this.glitchInfo = new GlitchInfo(config, this.webglUtility);

        this.InitProcess(vertexFilePath, fragmentFilePath);
    }

    async InitProcess(vertexFilePath : string, fragmentFilePath : string) {
        await this.glitchInfo.LoadPageImages();
        await this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);

        //Draw the image in first frame
        this.DrawCanvas2D();
        this.DrawREGLCavnas(this.reglCanvas, this.reglDrawCommand);
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this.reglCanvas  = await this.CreatREGLCanvas (this._webglDom);
        this.dynamicREGLTexture = this.reglCanvas.texture({data:this._canvasDom, flipY: true});
        
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);

        //Noise
        let noiseTexPath = this.glitchInfo.config.noiseTex;
        let noiseTex = await GetImagePromise(noiseTexPath);
        let distortTex = await GetImagePromise(this.glitchInfo.config.distortTex);

        this.reglDrawCommand  = await CreateREGLCommandObj(this.reglCanvas, glslSetting.vertex_shader, glslSetting.fragment_shader, this.dynamicREGLTexture, noiseTex, distortTex);
    }

    DrawCanvas2D() {
        this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);

        let mainTexWidth = this.width * 0.7, xCenterOffSet = mainTexWidth * 0.5;
        let mainTexHeight = this.height * 0.7, yCenterOffset = mainTexHeight * 0.5;
        let canvasPosX = (this.screenWidth * this.imagePosX) - (xCenterOffSet);
        let canvasPosY = (this.screenHeight * this.imagePosY) - (yCenterOffset);

        this._context.fillStyle = "rgb(205,238,250)";
        this._context.fillRect(0, 0, this._canvasDom.width, this._canvasDom.height);        

        this._context.drawImage(this.glitchInfo.mainTex, canvasPosX, canvasPosY, mainTexWidth, mainTexHeight);       
        
        this.dynamicREGLTexture.subimage(this._context);
    }

    DrawREGLCavnas(regl : Regl, drawCommand : REGL.DrawCommand) {
        let self = this;

        this.reglFrame = regl.frame(function (context) {  
            //Frame Loop
            self.time = context.time;   
            regl.clear({
                color: [0, 0, 0, 1],
                depth: 1
            });
            
            drawCommand({
                speed : self.webglSpeed,
                strength : self.webglStrength,
                scale : self.webglScale,
                sea_level : self.webglDisplacement,
                time : context.time
            });
        });
    }


    SetCanvasSize() {
        super.SetCanvasSize();
        
        if (this.dynamicREGLTexture != null) {
            this.dynamicREGLTexture.resize(this._canvasDom.width, this._canvasDom.height);
            this.DrawCanvas2D();
        }
    }
}

export default FloatingIsland;