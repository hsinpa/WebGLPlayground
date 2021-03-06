import {StringVector2} from '../Hsinpa/UniversalType';

export interface ParallelDataType {
    elements : ParallelDomElement[];
    lerp : number;
    strength : number;
}

export interface ParallelDomElement {
    id : string;
    depth_level : number;
    // rect : ParallelRectType;
    dom? : HTMLElement;
}

export interface ParallelRectType {
    position : ParallelCondtionType;
    size : ParallelCondtionType;
}

export interface ParallelCondtionType {
    condition : string;
    position : StringVector2;
    size : StringVector2;
}