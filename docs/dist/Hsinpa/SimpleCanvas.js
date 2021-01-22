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
    this._canvasDom.width = window.innerWidth;
    this._canvasDom.height = window.innerHeight;
    this.screenHeight = this._canvasDom.offsetHeight;
    this.screenWidth = this._canvasDom.offsetWidth;
  }
}
export default SimpleClass;
