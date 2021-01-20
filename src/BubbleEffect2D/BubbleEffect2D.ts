import {StringVector2, IntVector2} from '../Hsinpa/UniversalType';
import {BubbleType} from './BubbleEffectType';
import {RandomRange, Normalize2D, VectorAdd, VectorNumAdd, VectorNumScale, VectorDistance} from '../Hsinpa/UtilityMethod';

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
        this.direction = Normalize2D(direction);

        this.spawnPosSetting = this.FindStartPos();
        console.log(this.spawnPosSetting);
        this._intervalFunc = setInterval(this.UpdateProcess.bind(this), 1000/60);

        for (let i = 0; i < bubbleNum; i++) {
            this.SpawnBubble(true);
        }
    }

    public Stop() {
        if (this._intervalFunc != null)
            clearInterval(this._intervalFunc);
    }

    private UpdateProcess() {
        this._context.clearRect(0, 0, this._canvasDom.width, this._canvasDom.height);

        let currentBubbleCount = this.bubbles.length;
        
        for (let i = currentBubbleCount - 1; i >= 0; i--) {
            this.DrawBubble(this.bubbles[i]);

            if (this.CheckBubbleDistReach(this.bubbles[i])) {
                this.bubbles.splice(i, 1);
                console.log("Delete Bubble index " + i);
                if (currentBubbleCount < this.bubbleNum) {
                    

                    this.SpawnBubble();
                }
            }
        }
    }

    private SpawnBubble(spawnFullScreen : boolean = false) {
        let bubble : any = {};
        bubble.Opacity = RandomRange(0.1, 0.7);
        bubble.Radius = RandomRange(3, this.maxBubbleSize);

        //Usually on initialize bubble
        if (spawnFullScreen || bubble.Opacity < 0.3 || (bubble.Radius < this.maxBubbleSize * 0.6)) {
            bubble.StartPoint = this.GetRandomFullScreenPos();
        } else {
            bubble.StartPoint = {x : RandomRange(this.spawnPosSetting.WidthRange.x, this.spawnPosSetting.WidthRange.y), 
                                y : this.spawnPosSetting.StartHeight};
        }

        bubble.EndPoint = {x : RandomRange(this.spawnPosSetting.WidthRange.x, this.spawnPosSetting.WidthRange.y), 
                            y : this.spawnPosSetting.EndHeight};

        bubble.CurrentPoint = bubble.StartPoint;

        this.bubbles.push(bubble);
    }

    private DrawBubble(bubble : BubbleType) {
        this._context.beginPath();

        let dist : IntVector2 = {x : bubble.EndPoint.x - bubble.StartPoint.x, y : bubble.EndPoint.y - bubble.StartPoint.y };
        bubble.Direction = Normalize2D(dist);

        let offsetVec = VectorNumScale(bubble.Direction, (this.speed * this.delta));
        bubble.CurrentPoint = VectorAdd(bubble.CurrentPoint, offsetVec);

        var startAngle     = 0;                     // Starting point on circle
        var endAngle       = 2 * Math.PI; // End point on circle
        var anticlockwise  = false; // clockwise or anticlockwise

        this._context.arc(bubble.CurrentPoint.x, bubble.CurrentPoint.y, bubble.Radius, startAngle, endAngle, anticlockwise);
        this._context.fillStyle = `rgba(245, 225, 5, ${bubble.Opacity})`;
        this._context.fill();
    }

    private CheckBubbleDistReach(bubble : BubbleType) : boolean {
        let distance = VectorDistance(bubble.CurrentPoint, bubble.EndPoint);

        return (distance < 5);
    }

    private FindStartPos() : PossiblePosSetting {
        let setting : any = {};

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

        console.log(`canvasWidth ${this._canvasDom.width}, canvasHeight ${this._canvasDom.height}, screenHeight ${this.screenHeight}, screenWidth ${this.screenWidth}`);
    }
}

export default BubbleEffect2D;