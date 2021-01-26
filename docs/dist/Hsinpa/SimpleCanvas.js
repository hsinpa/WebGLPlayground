class SimpleClass {
  constructor(queryString) {
    this.IsProgramValid = false;
    this._canvasDom = document.querySelector(queryString);
    this.IsProgramValid = this._canvasDom != null;
    if (this.IsProgramValid) {
      this._context = this._canvasDom.getContext("2d");
      this.RegisterDomEvent();
      this.SetCanvasSize();
    }
  }
  RegisterDomEvent() {
    window.addEventListener("resize", () => {
      this.SetCanvasSize();
    });
  }
  SetCanvasSize() {
    this.SetCanvasToSceenSize(this._canvasDom);
    this.screenHeight = window.innerHeight - 4;
    this.screenWidth = window.innerWidth;
  }
  SetCanvasToSceenSize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 4;
  }
}
export default SimpleClass;
