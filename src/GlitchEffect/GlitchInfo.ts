import WebglUtility from '../Hsinpa/WebGL/WebglUtility';
import {GlitchGLConfig } from './GlitchREGL';

class GlitchInfo {

    private _webglUtility : WebglUtility;
    private config: GlitchGLConfig;
    
    public index : number;

    constructor(config: GlitchGLConfig, webglUtility : WebglUtility) {
        this._webglUtility = webglUtility;
    }
    
    async LoadPageImages(index : number) : boolean {

        return true;
    }
    
    


}

export default GlitchInfo;