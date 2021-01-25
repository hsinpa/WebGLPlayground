export interface GLSLDataSet {
    vertex_shader : string;
    fragment_shader : string;
}

export interface GLSLPropADP6 {
    time : number;
    speed : number;
    strength : number;
    scale : number;
}

export interface SlideAnimationType {
    y_position : number;
    scale : number;
    gl_strength : number;
}

export enum SlideEffectStateEnum {
    Normal, SlideUp, SlideDown
}

export interface SlideSettingSet {
    slide_strength : number,
    slide_duration : 3000,
    components : SlideSettingComponent[]
}

export interface SlideSettingComponent {
    query : string,
    mainTex : string
}

export interface SlideParameter {
    cssAnimationNameOut : string,
    cssAnimationNameIn : string,
    targetPosY : number,
    direction : number
}

export let SlideDownParameter : SlideParameter = {
    cssAnimationNameOut : "down_slideout",
    cssAnimationNameIn : "down_slidein",
    targetPosY : 1.5,
    direction : 1
};

export let SlideUpParameter : SlideParameter = {
    cssAnimationNameOut : "up_slideout",
    cssAnimationNameIn : "up_slidein",
    targetPosY : -0.5,
    direction : -1
};