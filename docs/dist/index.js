import "./stylesheet/main.css";
import DeepParallel from "./DeepParallel/DeepParallel.js";
import BubbleEffect2D from "./BubbleEffect2D/BubbleEffect2D.js";
import SlideEffectAD from "./SlideEffect_AD/SlideEffectAD.js";
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
  let vertFilePath = "./glsl/simple_texture.vert", fragFilePath = "./glsl/slide_effect.frag";
  fetch("./Dataset/sliding_setting.json").then(function(response) {
    return response.json();
  }).then(function(myJson) {
    let slideEffectAD = new SlideEffectAD(".adp6_canvas_2d", ".adp6_canvas_webgl", vertFilePath, fragFilePath, myJson);
    if (slideEffectAD.IsProgramValid) {
      let sliderStrength = document.querySelector("input[name='strength']");
      let sliderSpeed = document.querySelector("input[name='speed']");
      let sliderScale = document.querySelector("input[name='scale']");
      sliderStrength.addEventListener("input", (e) => {
        let sliderLabel = document.querySelector("label[name='strength']");
        sliderLabel.innerHTML = "Strength " + e.target.value;
        slideEffectAD.webglStrength = parseFloat(e.target.value);
      });
      sliderSpeed.addEventListener("input", (e) => {
        let sliderLabel = document.querySelector("label[name='speed']");
        sliderLabel.innerHTML = "Scale " + e.target.value;
        slideEffectAD.webglSpeed = parseFloat(e.target.value);
      });
      sliderScale.addEventListener("input", (e) => {
        let sliderLabel = document.querySelector("label[name='scale']");
        sliderLabel.innerHTML = "Scale " + e.target.value;
        slideEffectAD.webglScale = parseFloat(e.target.value);
      });
    }
  });
};
