import {StringVector2, IntVector2} from '../Hsinpa/UniversalType';

export interface BubbleType {
    StartPoint : IntVector2;
    EndPoint : IntVector2;
    Opacity : number;
    Radius : number;
    Direction : IntVector2;
    CurrentPoint : IntVector2;
}