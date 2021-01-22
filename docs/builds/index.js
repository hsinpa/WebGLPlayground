import "./stylesheet/main.css.proxy.js";
import DeepParallel from "./DeepParallel/DeepParallel.js";
import BubbleEffect2D from "./BubbleEffect2D/BubbleEffect2D.js";
window.onload = () => {
  let parallelModule = new DeepParallel(document.querySelector("body"));
  fetch("./Dataset/parallel_setting.json").then(function(response) {
    return response.json();
  }).then(function(myJson) {
    parallelModule.SetConfig(myJson);
  });
  let bubbleEffect = new BubbleEffect2D(document.querySelector("#webgl_canvas"));
  if (bubbleEffect.IsProgramValid) {
    let bubbleCount = document.querySelector("#particle_count");
    let bubbleSpeed = document.querySelector("#particle_speed");
    let bubbleInvertBox = document.querySelector("#particle_d_invert");
    console.log("bubbleCount " + bubbleEffect);
    bubbleCount.addEventListener("change", (e) => {
      bubbleEffect.bubbleNum = parseInt(e.target.value);
    });
    bubbleSpeed.addEventListener("change", (e) => {
      bubbleEffect.speed = parseInt(e.target.value);
    });
    bubbleInvertBox.addEventListener("change", (e) => {
      bubbleEffect.SetDireciton({x: 0, y: bubbleInvertBox.checked ? -1 : 1});
    });
    let direction = {x: 0, y: bubbleInvertBox.checked ? -1 : 1};
    bubbleEffect.Play(parseInt(bubbleCount.value), parseInt(bubbleSpeed.value), direction);
  }
};
