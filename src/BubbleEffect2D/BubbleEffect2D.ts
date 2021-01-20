import {StringVector2, IntVector2} from '../Hsinpa/UniversalType';
import {BubbleType} from './BubbleEffectType';
import {RandomRange, Normalize2D, VectorAdd, VectorNumAdd, VectorNumScale, VectorDistance, Clamp, Lerp} from '../Hsinpa/UtilityMethod';
interface PossiblePosSetting {
    StartHeight : number;
    EndHeight : number;
    WidthRange : IntVector2;
}

class BubbleEffect2D {

    private _canvasDom : HTMLCanvasElement;
    private _context : CanvasRenderingContext2D;
    private _intervalFunc : NodeJS.Timeout;

    public speed : number;
    public bubbleNum : number;
    private direction : IntVector2;

    private bubbles : BubbleType[];
    private screenHeight : number;
    private screenWidth : number;
    private spawnPosSetting : PossiblePosSetting;
    private delta = 0.02;
    private _tick : number = 0; 
    private _fps = 1000/60;

    private maxBubbleSize = 10;

    constructor(canvasDom: HTMLCanvasElement) {
        this._canvasDom = canvasDom;
        this._context = this._canvasDom.getContext("2d");

        window.addEventListener('resize', () => {
            this.SetCanvasSize();
        });

        this.SetCanvasSize();
    }

    public Play(bubbleNum : number, speed : number, direction : IntVector2) {
        this.bubbles = [];
        this.speed = speed;
        this.bubbleNum = bubbleNum;

        this.SetDireciton(direction);
        this._intervalFunc = setInterval(this.UpdateProcess.bind(this), this._fps);

        //Don't spawn everything at the start
        for (let i = 0; i < bubbleNum; i++) {
            this.SpawnBubble(true);
        }
    }

    public SetDireciton(direction : IntVector2) {
        this.direction = Normalize2D(direction);
        this.spawnPosSetting = this.FindStartPos();
    }

    public Stop() {
        if (this._intervalFunc != null)
            clearInterval(this._intervalFunc);
    }

    private UpdateProcess() {
        this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);
        this.ProcessBubbleMoves();
    }

    private ProcessBubbleMoves() {
        let currentBubbleCount = this.bubbles.length;
        
        for (let i = currentBubbleCount - 1; i >= 0; i--) {
            this.DrawBubble(this.bubbles[i]);

            if (this.CheckBubbleDistReach(this.bubbles[i])) {
                this.bubbles.splice(i, 1);

                //console.log("Index Delete " + i);
            }
        }

        if (currentBubbleCount < this.bubbleNum) {
            this.SpawnBubble();
        }
        this._tick += this._fps * 0.001;
    }

    private SpawnBubble(spawnFullScreen : boolean = false) {
        let bubble : any = {};
        bubble.Opacity = RandomRange(0.1, 0.7);
        bubble.Radius = RandomRange(2, this.maxBubbleSize);

        let randomSpeed = this.speed * 0.2;
        bubble.SpeedOffset = RandomRange(randomSpeed, randomSpeed);

        //Usually on initialize bubble
        if (spawnFullScreen || bubble.Opacity < 0.2 || (bubble.Radius < this.maxBubbleSize * 0.7)) {
            bubble.StartPoint = this.GetRandomFullScreenPos();
        } else {
            bubble.StartPoint = {x : RandomRange(this.spawnPosSetting.WidthRange.x, this.spawnPosSetting.WidthRange.y), 
                                y : this.spawnPosSetting.StartHeight};
        }

        let screenXHalf = this.screenWidth * 0.2;
        let constraintEndX = RandomRange( bubble.StartPoint.x - screenXHalf, bubble.StartPoint.x  + screenXHalf );

        bubble.EndPoint = {x : constraintEndX,
            //RandomRange(this.spawnPosSetting.WidthRange.x, this.spawnPosSetting.WidthRange.y), 
                            y : this.spawnPosSetting.EndHeight};

        bubble.CurrentEndPoint = bubble.EndPoint;
        bubble.CurrentPoint = bubble.StartPoint;
        bubble.CurrentOpacity = 0;

        this.bubbles.push(bubble);
    }

    private DrawBubble(bubble : BubbleType) {
        this._context.beginPath();

        //Make the track path curving
        let lerpX = bubble.EndPoint.x + (Math.sin((this._tick + bubble.SpeedOffset) ) * 1);

        bubble.CurrentEndPoint.x = lerpX;

        let dist : IntVector2 = {x : bubble.CurrentEndPoint.x - bubble.CurrentPoint.x, y : bubble.CurrentEndPoint.y - bubble.CurrentPoint.y };
        bubble.Direction = Normalize2D(dist);

        let offsetVec = VectorNumScale(bubble.Direction, ((bubble.SpeedOffset + this.speed) * this.delta));
        bubble.CurrentPoint = VectorAdd(bubble.CurrentPoint, offsetVec);
        bubble.CurrentOpacity = Lerp(bubble.CurrentOpacity, bubble.Opacity, 0.03);

        var startAngle     = 0;                     // Starting point on circle
        var endAngle       = 2 * Math.PI; // End point on circle
        var anticlockwise  = false; // clockwise or anticlockwise

        this._context.arc(bubble.CurrentPoint.x, bubble.CurrentPoint.y, bubble.Radius, startAngle, endAngle, anticlockwise);
        this._context.fillStyle = `rgba(245, 225, 5, ${bubble.CurrentOpacity})`;
        this._context.fill();
    }

    private CheckBubbleDistReach(bubble : BubbleType) : boolean {
        let distance = VectorDistance(bubble.CurrentPoint, bubble.CurrentEndPoint);
        //console.log(`CX ${bubble.CurrentEndPoint.x}, CY ${bubble.CurrentEndPoint.y}, EX ${bubble.CurrentEndPoint.x}, EY ${bubble.CurrentEndPoint.y}`);
        return (distance < 10);
    }

    private FindStartPos() : PossiblePosSetting {
        let setting : any = {};

        if (this.direction == null) return setting;

        //With Size Offset
        setting.WidthRange = {x : -this.maxBubbleSize, y : this.screenWidth + this.maxBubbleSize};

        let sphereSize = (this.maxBubbleSize * 2);
        //From Top
        if (this.direction.y > 0) {
            setting.StartHeight =  this.screenHeight + (sphereSize);
            setting.EndHeight = -(sphereSize);
        }

        //From Bottom
        if (this.direction.y <= 0) {
            setting.StartHeight =  -(sphereSize);
            setting.EndHeight = this.screenHeight + (sphereSize);
        }

        return setting;
    }

    private GetRandomFullScreenPos() : IntVector2 {
        return {x : RandomRange(0, this.screenWidth, ), 
                y : RandomRange(0, this.screenHeight)};
    }

    private SetCanvasSize() {
        this._canvasDom.width = window.innerWidth;
        this._canvasDom.height = window.innerHeight;

        this.screenHeight = this._canvasDom.offsetHeight;
        this.screenWidth = this._canvasDom.offsetWidth;  

        this.spawnPosSetting = this.FindStartPos();
        //console.log(`canvasWidth ${this._canvasDom.width}, canvasHeight ${this._canvasDom.height}, screenHeight ${this.screenHeight}, screenWidth ${this.screenWidth}`);
    }
}

export default BubbleEffect2D;