
import REGL, {Regl} from 'regl';
const reglPromise = import('regl');

abstract class WebglCanvas {
    protected _canvasDom : HTMLCanvasElement;
    protected _context : CanvasRenderingContext2D;
    protected _webglDom : HTMLCanvasElement;
    protected _reglContext : Regl;

    protected screenHeight : number;
    protected screenWidth : number;

    public IsProgramValid : boolean = false;

    constructor( canvas2dQuery : string, webglQuery : string) {
        this._canvasDom = document.querySelector(canvas2dQuery);
        this._webglDom = document.querySelector(webglQuery);

        this.IsProgramValid = this._canvasDom != null && this._webglDom != null;

        if (this.IsProgramValid) {
            this._context = this._canvasDom.getContext("2d");
            this.RegisterDomEvent();    
            this.SetCanvasSize();
        }
    }

    protected RegisterDomEvent() {
        window.addEventListener('resize', () => {
            this.SetCanvasSize();
        });
    }

    protected async CreatREGLCanvas(webglDom : HTMLCanvasElement) {
        let regl = await reglPromise;

        return regl.default(webglDom);
    }

    protected SetCanvasSize() {
        this.SetCanvasToSceenSize(this._canvasDom);
        this.SetCanvasToSceenSize(this._webglDom);
        this.screenHeight = window.innerHeight - 4;
        this.screenWidth = window.innerWidth ;
    }

    public SetCanvasToSceenSize(canvas : HTMLCanvasElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight -4;
    }
}

export default WebglCanvas;