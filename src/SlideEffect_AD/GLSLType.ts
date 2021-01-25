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