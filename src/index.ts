import './stylesheet/main.scss';
import DeepParallel from './DeepParallel/DeepParallel';
import BubbleEffect2D from './BubbleEffect2D/BubbleEffect2D';
import SlideEffectAD from './SlideEffect_AD/SlideEffectAD';
import {ParallelBubbleSetUp, SlidingEffectSetUp, GlitchEffectSetUp} from './Sample';

import {GetRelativeURL} from './Hsinpa/UtilityMethod';

let _DeepParallel = DeepParallel;

window.onload = () => {

    let router = GetRelativeURL(window.location.href);

    console.log(router);
    switch(router) {
        case "" :
            ParallelBubbleSetUp();
        break;

        case "glitch_effect.html" :
            GlitchEffectSetUp();
        break;

        case "adp6_effect.html" :
            SlidingEffectSetUp();
        break;
    }
};