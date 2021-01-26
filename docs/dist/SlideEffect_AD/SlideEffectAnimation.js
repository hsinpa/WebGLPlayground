import {animate, linear, easeInOut} from "../../_snowpack/pkg/popmotion.js";
class SlideEffectAnimation {
  CreateSlideAnim(toState, duration, onUpdateCallback, onCompCallback) {
    let self = this;
    animate({
      to: toState,
      ease: [linear, easeInOut],
      duration,
      onComplete: () => {
        onCompCallback();
      },
      onUpdate: (r) => {
        onUpdateCallback(r);
      }
    });
  }
}
export default SlideEffectAnimation;
