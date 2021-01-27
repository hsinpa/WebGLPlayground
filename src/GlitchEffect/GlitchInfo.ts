import WebglUtility from '../Hsinpa/WebGL/WebglUtility';
import {GlitchGLConfig } from './GlitchREGL';

class GlitchInfo {

    private _webglUtility : WebglUtility;
    private _config: GlitchGLConfig;
    public get config() { return this._config; }

    public index : number;
    public mainTex : HTMLImageElement;

    constructor(config: GlitchGLConfig, webglUtility : WebglUtility) {
        this._config = config;
        this._webglUtility = webglUtility;
        this.index = 0;
    }
    
    async LoadPageImages() : Promise<HTMLImageElement> {
        //Cache image without waiting
        if (this.index >= 0 && (this.index + 1) < this._config.components.length)
            this._webglUtility.GetImage(this._config.components[this.index+1].mainTex);

        if (this.index > 0)
            this._webglUtility.GetImage(this._config.components[this.index-1].mainTex);
        
        this.mainTex = await this._webglUtility.GetImage(this._config.components[this.index].mainTex);

        return this.mainTex;
    }
    

}

export default GlitchInfo;