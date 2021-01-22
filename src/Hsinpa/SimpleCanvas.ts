abstract class SimpleClass {
    protected _canvasDom : HTMLCanvasElement;
    protected _context : CanvasRenderingContext2D;
    protected screenHeight : number;
    protected screenWidth : number;

    public IsProgramValid : boolean = false;

    constructor(queryString :string) {
        this._canvasDom = document.querySelector(queryString);
        this.IsProgramValid = this._canvasDom != null;

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

    protected SetCanvasSize() {
        this._canvasDom.width = window.innerWidth;
        this._canvasDom.height = window.innerHeight;

        this.screenHeight = this._canvasDom.offsetHeight;
        this.screenWidth = this._canvasDom.offsetWidth;
    }
}

export default SimpleClass;