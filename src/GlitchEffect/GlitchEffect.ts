import WebGLCanvas from '../Hsinpa/WebGL/WebglCanvas'
import REGL, {Regl} from 'regl';
import WebglUtility from '../Hsinpa/WebGL/WebglUtility';
import {CreateREGLCommandObj,GlitchGLConfig } from './GlitchREGL';
import GlitchInfo from './GlitchInfo';
import {GetImagePromise} from '../Hsinpa/UtilityMethod';


class GlitchEffect extends WebGLCanvas {
    //#region Parameters
    reglCanvas : Regl;
    dynamicREGLTexture : REGL.Texture2D;
    webglUtility : WebglUtility;
    glitchInfo : GlitchInfo;
    reglDrawCommand : REGL.DrawCommand;

    width = 1024;
    height = 750;

    imagePosX = 0.5;
    imagePosY = 0.5;

    //#endregion
    //#region Inspector
    //WEBGL Parameters
    webglSpeed = 1.0;
    webglScale = 1.0;
    webglStrength = 0.0;
    private time = 0;
    //#endregion


    constructor( config: GlitchGLConfig, vertexFilePath : string, fragmentFilePath : string) {
        super(config.canvas_domQuery, config.webgl_domQuery);
        this.webglUtility = new WebglUtility();
        this.glitchInfo = new GlitchInfo(config, this.webglUtility);
        this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this.reglCanvas  = await this.CreatREGLCanvas (this._webglDom);
        this.dynamicREGLTexture = this.reglCanvas.texture({data:this._canvasDom, flipY: true});
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);

        //Noise
        let noiseTexPath = this.config.noiseTex;
        let noiseTex = await GetImagePromise(noiseTexPath);

        this.reglDrawCommand  = await CreateREGLCommandObj(this.reglCanvas, glslSetting.vertex_shader, glslSetting.fragment_shader, this.dynamicREGLTexture, noiseTex);
    }

    DrawCanvas2D() {
        this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);

        let mainTexWidth = this.width * this.webglScale, xCenterOffSet = mainTexWidth * 0.5;
        let mainTexHeight = this.height * this.webglScale, yCenterOffset = mainTexHeight * 0.5;
        let canvasPosX = (this.screenWidth * this.imagePosX) - (xCenterOffSet);
        let canvasPosY = (this.screenHeight * this.imagePosY) - (yCenterOffset);

        this._context.drawImage(this.mainImage, canvasPosX, canvasPosY, mainTexWidth, mainTexHeight);       

    }

}

export default GlitchEffect;