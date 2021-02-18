import REGL, {Regl} from 'regl';

export interface GlitchGLType {
    time : number;
    speed : number;
    strength : number;
    scale : number;
    displacement : number;
    transition : number;
}

export interface GlitchGLConfig {
    strength : number;
    components : GlitchComponent[];
    canvas_domQuery : string;
    webgl_domQuery : string;
    noiseTex : string;
    distortTex : string;
}

export interface GlitchComponent {
    query : string;
    mainTex : string;
}

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, canvasTex : REGL.Texture2D, 
    noiseTex : HTMLImageElement, distortTex : HTMLImageElement) {
    return regl({
        frag: fragment,

        vert: vertex,

        blend : {
            enable: true,
            func: {
              srcRGB: 'src alpha',
              srcAlpha: 1,
              dstRGB: 'src alpha',
              dstAlpha: 0
            },
            equation: {
              rgb: 'add',
              alpha: 'add'
            },
            color: [0, 0, 0, 0]
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
            blendTexture: canvasTex,
            noiseTex : regl.texture({data:noiseTex, wrap  : "repeat"}),
            distortTex : regl.texture({data:distortTex, wrap  : "repeat"}),
            time: regl.prop<GlitchGLType, "time">("time"),
            speed: regl.prop<GlitchGLType, "speed">('speed'),
            strength: regl.prop<GlitchGLType, "strength">('strength'),
            scale: regl.prop<GlitchGLType, "scale">('scale'),
            displacement : regl.prop<GlitchGLType, "displacement">('displacement'),
            transition : regl.prop<GlitchGLType, 'transition'>('transition')
        },

        count: 6
    });
}