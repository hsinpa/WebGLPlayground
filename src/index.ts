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
    bubbleEffect.Play(100, 40, {x:0.5, y : 1});
};