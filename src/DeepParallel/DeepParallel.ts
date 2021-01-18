import {ParallelDataType} from './ParallelDataType';

class DeepParallel {

    _domBody : HTMLElement;
    _config : ParallelDataType;

    constructor(body : HTMLElement) {
        this._domBody = body;
        this._domBody.addEventListener('mousemove', this.OnMouseMove.bind(this));
    }

    public SetConfig(config :ParallelDataType) {
        this._config = config;
        
        //Find Element in DOM
        this._config.elements.forEach(x => {
            x.dom = this._domBody.querySelector(x.id);
        });    
    }

    private OnMouseMove(event : MouseEvent) {
        let screenWidth = this._domBody.offsetWidth;
        let screenHeight = this._domBody.offsetHeight;
        let nMouseX = event.clientX / screenWidth;
        let nMouseY = event.clientY / screenHeight;
        let xOffset = 0.5 - nMouseX;
        let yOffset = 0.5 - nMouseY;

        this.Process(xOffset, yOffset);
        // console.log(`screenHeight ${screenHeight}, screenWidth ${screenWidth}, event.clientX ${event.clientX}, event.clientY ${event.clientY}`);
        //console.log(`mouse moveement xOffset ${xOffset}, yOffset ${yOffset}`);
    }

    private Process(mouseOffsetX : number, mouseOffsetY : number) {
        
        this._config.elements.forEach(element => {
            let domOffsetX =  mouseOffsetX * this._config.strength * element.depth_level;
            let domOffsetY =  mouseOffsetY * this._config.strength * element.depth_level;

            let translate = `translate(${domOffsetX}px, ${domOffsetY}px)`;
            element.dom.style.transform = translate;
        }); 
    }
}

export default DeepParallel;