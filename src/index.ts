import './stylesheet/main.scss';
import DeepParallel from './DeepParallel/DeepParallel';
import BubbleEffect2D from './BubbleEffect2D/BubbleEffect2D';
import SlideEffectAD from './SlideEffect_AD/SlideEffectAD';
import {ParallelBubbleSetUp, SlidingEffectSetUp, GlitchEffectSetUp} from './Sample';

import {GetRelativeURL} from './Hsinpa/UtilityMethod';

let _DeepParallel = DeepParallel;

window.onload = () => {

    let hrefString = GetRelativeURL(window.location.href);
    let n = hrefString.lastIndexOf("/");
    let router = (n < 0) ? hrefString : hrefString.slice(n);

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