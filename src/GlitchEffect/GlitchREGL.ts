import REGL, {Regl} from 'regl';

export interface GlitchGLType {
    time : number;
    speed : number;
    strength : number;
    scale : number;
}

export interface GlitchGLConfig {
    strength : number;
    components : GlitchComponent[];
    canvas_domQuery : string;
    webgl_domQuery : string;
    noiseTex : string;
}

export interface GlitchComponent {
    query : string;
    mainTex : string;
}

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, canvasTex : REGL.Texture2D, noiseTex : HTMLImageElement) {
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
            texture: canvasTex,
            noiseTex : regl.texture({data:noiseTex, wrap  : "repeat"}),
            time: regl.prop<GlitchGLType, "time">("time"),
            speed: regl.prop<GlitchGLType, "speed">('speed'),
            strength: regl.prop<GlitchGLType, "strength">('strength'),
            scale: regl.prop<GlitchGLType, "scale">('scale')
        },

        count: 6
    });
}