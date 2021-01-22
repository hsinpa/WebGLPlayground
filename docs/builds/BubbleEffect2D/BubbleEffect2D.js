import {RandomRange, Normalize2D, VectorAdd, VectorNumScale, VectorDistance, Lerp} from "../Hsinpa/UtilityMethod.js";
class BubbleEffect2D {
  constructor(canvasDom) {
    this.delta = 0.02;
    this._tick = 0;
    this._fps = 1e3 / 60;
    this.maxBubbleSize = 10;
    this.IsProgramValid = false;
    this._canvasDom = canvasDom;
    this.IsProgramValid = this._canvasDom != null;
    if (this.IsProgramValid) {
      this._context = this._canvasDom.getContext("2d");
      window.addEventListener("resize", () => {
        this.SetCanvasSize();
      });
      this.SetCanvasSize();
    }
  }
  Play(bubbleNum, speed, direction) {
    if (!this.IsProgramValid)
      return;
    this.bubbles = [];
    this.speed = speed;
    this.bubbleNum = bubbleNum;
    this.SetDireciton(direction);
    this._intervalFunc = setInterval(this.UpdateProcess.bind(this), this._fps);
    for (let i = 0; i < bubbleNum; i++) {
      this.SpawnBubble(true);
    }
  }
  SetDireciton(direction) {
    this.direction = Normalize2D(direction);
    this.spawnPosSetting = this.FindStartPos();
  }
  Stop() {
    if (this._intervalFunc != null)
      clearInterval(this._intervalFunc);
  }
  UpdateProcess() {
    this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);
    this.ProcessBubbleMoves();
  }
  ProcessBubbleMoves() {
    let currentBubbleCount = this.bubbles.length;
    for (let i = currentBubbleCount - 1; i >= 0; i--) {
      this.DrawBubble(this.bubbles[i]);
      if (this.CheckBubbleDistReach(this.bubbles[i])) {
        this.bubbles.splice(i, 1);
      }
    }
    if (currentBubbleCount < this.bubbleNum) {
      this.SpawnBubble();
    }
    this._tick += this._fps * 1e-3;
  }
  SpawnBubble(spawnFullScreen = false) {
    let bubble = {};
    bubble.Opacity = RandomRange(0.1, 0.7);
    bubble.Radius = RandomRange(2, this.maxBubbleSize);
    let randomSpeed = this.speed * 0.2;
    bubble.SpeedOffset = RandomRange(randomSpeed, randomSpeed);
    if (spawnFullScreen || bubble.Opacity < 0.2 || bubble.Radius < this.maxBubbleSize * 0.7) {
      bubble.StartPoint = this.GetRandomFullScreenPos();
    } else {
      bubble.StartPoint = {
        x: RandomRange(this.spawnPosSetting.WidthRange.x, this.spawnPosSetting.WidthRange.y),
        y: this.spawnPosSetting.StartHeight
      };
    }
    let screenXHalf = this.screenWidth * 0.2;
    let constraintEndX = RandomRange(bubble.StartPoint.x - screenXHalf, bubble.StartPoint.x + screenXHalf);
    bubble.EndPoint = {
      x: constraintEndX,
      y: this.spawnPosSetting.EndHeight
    };
    bubble.CurrentEndPoint = bubble.EndPoint;
    bubble.CurrentPoint = bubble.StartPoint;
    bubble.CurrentOpacity = 0;
    this.bubbles.push(bubble);
  }
  DrawBubble(bubble) {
    this._context.beginPath();
    let lerpX = bubble.EndPoint.x + Math.sin(this._tick + bubble.SpeedOffset) * 1;
    bubble.CurrentEndPoint.x = lerpX;
    let dist = {x: bubble.CurrentEndPoint.x - bubble.CurrentPoint.x, y: bubble.CurrentEndPoint.y - bubble.CurrentPoint.y};
    bubble.Direction = Normalize2D(dist);
    let offsetVec = VectorNumScale(bubble.Direction, (bubble.SpeedOffset + this.speed) * this.delta);
    bubble.CurrentPoint = VectorAdd(bubble.CurrentPoint, offsetVec);
    bubble.CurrentOpacity = Lerp(bubble.CurrentOpacity, bubble.Opacity, 0.03);
    var startAngle = 0;
    var endAngle = 2 * Math.PI;
    var anticlockwise = false;
    this._context.arc(bubble.CurrentPoint.x, bubble.CurrentPoint.y, bubble.Radius, startAngle, endAngle, anticlockwise);
    this._context.fillStyle = `rgba(245, 225, 5, ${bubble.CurrentOpacity})`;
    this._context.fill();
  }
  CheckBubbleDistReach(bubble) {
    let distance = VectorDistance(bubble.CurrentPoint, bubble.CurrentEndPoint);
    return distance < 10;
  }
  FindStartPos() {
    let setting = {};
    if (this.direction == null)
      return setting;
    setting.WidthRange = {x: -this.maxBubbleSize, y: this.screenWidth + this.maxBubbleSize};
    let sphereSize = this.maxBubbleSize * 2;
    if (this.direction.y > 0) {
      setting.StartHeight = this.screenHeight + sphereSize;
      setting.EndHeight = -sphereSize;
    }
    if (this.direction.y <= 0) {
      setting.StartHeight = -sphereSize;
      setting.EndHeight = this.screenHeight + sphereSize;
    }
    return setting;
  }
  GetRandomFullScreenPos() {
    return {
      x: RandomRange(0, this.screenWidth),
      y: RandomRange(0, this.screenHeight)
    };
  }
  SetCanvasSize() {
    this._canvasDom.width = window.innerWidth;
    this._canvasDom.height = window.innerHeight;
    this.screenHeight = this._canvasDom.offsetHeight;
    this.screenWidth = this._canvasDom.offsetWidth;
    this.spawnPosSetting = this.FindStartPos();
  }
}
export default BubbleEffect2D;
