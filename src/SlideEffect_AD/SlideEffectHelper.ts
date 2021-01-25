import REGL, {Regl, TextureImageData} from 'regl';
import {GLSLDataSet, GLSLPropADP6} from './GLSLType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise, Lerp} from '../Hsinpa/UtilityMethod';


class SlideEffectHelper {

    textureCache : Dictionary<string, HTMLImageElement>;

    constructor() {
        this.textureCache = new Dictionary();
    }

    async PrepareREGLShader(regl : Regl, vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : GLSLDataSet = {
                vertex_shader : values[0],
                fragment_shader : values[1],
            };

            return gLSLDataSet; 
        });
    }

    CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, canvasTex : REGL.Texture2D, noiseTex : HTMLImageElement) {

        return regl({
            frag: fragment,

            vert: vertex,

            blend : {
                enable : true
            },
            attributes: {
                a_position: [
                    [-1, -1],
                    [-1, 1],
                    [1, 1],

                    [-1, -1],
                    [1, 1],
                    [1, -1],
                    ]
            },

            uniforms: {
                color: [1, 0, 0, 1],
                texture: canvasTex,
                //regl.texture({data: regl.prop<GLSLPropADP6, "canvas">( 'canvas'), flipY: true}),
                // texture: regl.texture({data:img, flipY: true}),
                // transitionTex : regl.texture({data:transitionTex, wrap  : "repeat"}),
                noiseTex : regl.texture({data:noiseTex, wrap  : "repeat"}),
                time: regl.prop<GLSLPropADP6, "time">("time"),
                speed: regl.prop<GLSLPropADP6, "speed">('speed'),
                strength: regl.prop<GLSLPropADP6, "strength">('strength'),
                scale: regl.prop<GLSLPropADP6, "scale">('scale')
            },

            count: 6
        });
    }

    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.setValue(path, texture);

        return texture;         
    }
}

export default SlideEffectHelper;