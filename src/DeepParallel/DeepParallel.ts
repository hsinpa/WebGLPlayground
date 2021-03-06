import {ParallelDataType} from './ParallelDataType';
import {Lerp} from '../Hsinpa/UtilityMethod';

class DeepParallel {

    _domBody : HTMLElement;
    _config : ParallelDataType;

    _recordOffsetX : number;
    _recordOffsetY : number;
    _targetOffsetX : number;
    _targetOffsetY : number;

    _intervalFunc : number;

    constructor(body : HTMLElement) {
        this._domBody = body;
    }

    public SetConfig(config :ParallelDataType) {
        console.log("ONLOAD");

        this._config = config;
        if (this._config.elements.length <= 0) {
            return;
        }

        this._domBody.addEventListener('mousemove', this.OnMouseMove.bind(this));
        
        //Find Element in DOM
        this._config.elements.forEach(x => {
            x.dom = this._domBody.querySelector(x.id);
        });

        this._recordOffsetX = 0;
        this._recordOffsetY = 0;
        
        this.StartInverval();
    }

    private OnMouseMove(event : MouseEvent) {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let nMouseX = event.clientX / screenWidth;
        let nMouseY = event.clientY / screenHeight;

        this._targetOffsetX = 0.5 - nMouseX;
        this._targetOffsetY = 0.5 - nMouseY;

        //console.log(`screenHeight ${screenHeight}, screenWidth ${screenWidth}, event.clientX ${event.clientX}, event.clientY ${event.clientY}`);
        //console.log(`mouse moveement xOffset ${xOffset}, yOffset ${yOffset}`);
    }

    private UpdateProcess() {

        let diff = Math.abs(this._targetOffsetX-this._recordOffsetX) + Math.abs(this._recordOffsetY - this._targetOffsetY);

        if (diff < 0.01) return;

        this._recordOffsetX = Lerp(this._recordOffsetX, this._targetOffsetX, this._config.lerp);
        this._recordOffsetY = Lerp(this._recordOffsetY, this._targetOffsetY, this._config.lerp);
            
        if (isNaN(this._recordOffsetY))
            this._recordOffsetY = 0;

        if (isNaN(this._recordOffsetX))
            this._recordOffsetX = 0;

        this.Translate(this._recordOffsetX, this._recordOffsetY); 
    }

    private Translate(mouseOffsetX : number, mouseOffsetY : number) {
        this._config.elements.forEach(element => {
            let domOffsetX =  mouseOffsetX * this._config.strength * element.depth_level;
            let domOffsetY =  mouseOffsetY * this._config.strength * element.depth_level;

            let translate = `translate(${domOffsetX}px, ${domOffsetY}px)`;

            if (element.dom != null)
                element.dom.style.transform = translate;
        });
    }

    private StartInverval() {
        this._intervalFunc = setInterval(this.UpdateProcess.bind(this), 1000/60);   
    }

    public Dispose() {
        if (this._intervalFunc != null)
            clearInterval(this._intervalFunc);
    }
}

export default DeepParallel;