import {animate, linear, easeInOut} from 'popmotion';
import {SlideAnimationType} from './GLSLType';

class SlideEffectAnimation {

    CreateSlideAnim(toState : SlideAnimationType[], duration : number, 
        onUpdateCallback : (data : SlideAnimationType) => void, onCompCallback: () => void) {
        let self = this;
        animate({
            to : toState,
            ease : [linear, easeInOut],
            // offset : [0.0, 0.8, 1.0],
            duration : duration,
            onComplete : () => {
                onCompCallback();
            }, 
            onUpdate : (r) => {
                console.log(r.scale +", " +r.y_position);
                onUpdateCallback(r);
            }
        });
    }

}

export default SlideEffectAnimation;