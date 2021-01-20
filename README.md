# WebGLPlayground
Practice some webgl effect, and actually creating js library
## Demo Link
[Github Page Demo](https://hsinpa.github.io/WebGLPlayground/)

### Deep Parallel
Highly customize parallel effect; Compatible with predefine html and css sytax.

JSON Layout
{ 
    //Put as many objects as you want, sequence no matter
    "elements" : [
        {
            "id" : string => selector query
            "depth_level" : number => set between 0 - 1
        },
        //Sample
          "id" : ".parallel_effect .parallel_holder",
          "depth_level" : 0.6
        }
    ],
    "strength" : number => apply how much effect according to mouse position,
    "lerp" : number => between 0.1 - 1; if 1 mean no lerp at all; if 0, app crash
}

//Initialize, get body for screen width, height data
let parallelModule = new DeepParallel( document.querySelector("body") );

//Insert JSON Object
parallelModule.SetConfig( myJson );

### Bubble2D Effect
//Again work independent from css or html syntax
//Pass the main webgl canvas dom here
let bubbleEffect = new BubbleEffect2D(document.querySelector("#webgl_canvas"));

//Direction only work with top->bottom / bottom->top only
bubbleEffect.Play(bubble_count : number, bubble_speed : number, direction:Vector2);

Full Setup can be find at /src/index.ts

