import './stylesheet/main.scss';
import DeepParallel from './DeepParallel/DeepParallel';
import BubbleEffect2D from './BubbleEffect2D/BubbleEffect2D';

import {ParallelDataType} from './DeepParallel/ParallelDataType';

window.onload = () => {
    let parallelModule = new DeepParallel( document.querySelector("body") );
    
    fetch('./Dataset/parallel_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        parallelModule.SetConfig( myJson );
    });

    let bubbleEffect = new BubbleEffect2D(document.querySelector("#webgl_canvas"));
    if (bubbleEffect.IsProgramValid) {
        let bubbleCount : any = document.querySelector("#particle_count");
        let bubbleSpeed : any = document.querySelector("#particle_speed");
        let bubbleInvertBox : any = document.querySelector("#particle_d_invert");
    
        console.log("bubbleCount "+ bubbleEffect);
    
        bubbleCount.addEventListener("change", (e : any) => {
            bubbleEffect.bubbleNum = parseInt(e.target.value);
        });
    
        bubbleSpeed.addEventListener("change", (e : any) => {
            bubbleEffect.speed = parseInt(e.target.value);
        });
    
        bubbleInvertBox.addEventListener("change", (e : any) => {
            bubbleEffect.SetDireciton( {x:0, y : (bubbleInvertBox.checked) ? -1 : 1} );
        });
    
        let direction = {x:0, y : (bubbleInvertBox.checked) ? -1 : 1};
        bubbleEffect.Play(parseInt(bubbleCount.value), parseInt(bubbleSpeed.value), direction);  
    }
};