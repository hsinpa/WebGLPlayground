import REGL, {Regl} from 'regl';

export interface FIslandGLType {
    time : number;
    speed : number;
    strength : number;
    scale : number;
    sea_level : number;
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

            thinOceanColor : [122 / 255, 222 / 255, 194 / 255, 1],
            thickOceanColor : [94 / 255, 189 / 255, 193 / 255, 1],
            oceanColor : [58 / 255, 108 / 255, 185 / 255, 1],

            time: regl.prop<FIslandGLType, "time">("time"),
            speed: regl.prop<FIslandGLType, "speed">('speed'),
            strength: regl.prop<FIslandGLType, "strength">('strength'),
            scale: regl.prop<FIslandGLType, "scale">('scale'),
            sea_level : regl.prop<FIslandGLType, "sea_level">('sea_level')
        },

        count: 6
    });
}