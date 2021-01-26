export var SlideEffectStateEnum;
(function(SlideEffectStateEnum2) {
  SlideEffectStateEnum2[SlideEffectStateEnum2["Normal"] = 0] = "Normal";
  SlideEffectStateEnum2[SlideEffectStateEnum2["SlideUp"] = 1] = "SlideUp";
  SlideEffectStateEnum2[SlideEffectStateEnum2["SlideDown"] = 2] = "SlideDown";
})(SlideEffectStateEnum || (SlideEffectStateEnum = {}));
export let SlideDownParameter = {
  cssAnimationNameOut: "down_slideout",
  cssAnimationNameIn: "down_slidein",
  targetPosY: 1.5,
  direction: 1
};
export let SlideUpParameter = {
  cssAnimationNameOut: "up_slideout",
  cssAnimationNameIn: "up_slidein",
  targetPosY: -0.5,
  direction: -1
};
