import WebGLCanvas from '../Hsinpa/WebGL/WebglCanvas'
import REGL, {Regl} from 'regl';
import WebglUtility from '../Hsinpa/WebGL/WebglUtility';
import {CreateREGLCommandObj,GlitchGLConfig } from './GlitchREGL';
import {GetImagePromise} from '../Hsinpa/UtilityMethod';


class GlitchEffect extends WebGLCanvas {
    reglCanvas : Regl;
    dynamicREGLTexture : REGL.Texture2D;
    webglUtility : WebglUtility;
    reglDrawCommand : REGL.DrawCommand;

    constructor( config: GlitchGLConfig, vertexFilePath : string, fragmentFilePath : string) {
        super(config.canvas_domQuery, config.webgl_domQuery);

        this.webglUtility = new WebglUtility();
        this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this.reglCanvas  = await this.CreatREGLCanvas (this._webglDom);
        this.dynamicREGLTexture = this.reglCanvas.texture({data:this._canvasDom, flipY: true});
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);

        //Noise
        let noiseTexPath = "./image/noise_tex_02.jpg";
        let noiseTex = await GetImagePromise(noiseTexPath);

        this.reglDrawCommand  = await CreateREGLCommandObj(this.reglCanvas, glslSetting.vertex_shader, glslSetting.fragment_shader, this.dynamicREGLTexture, noiseTex);
    }

}

export default GlitchEffect;