import DeepParallel from '../DeepParallel/DeepParallel';
import BubbleEffect2D from '../BubbleEffect2D/BubbleEffect2D';
import SlideEffectAD from '../SlideEffect_AD/SlideEffectAD';
import GlitchEffect from '../GlitchEffect/GlitchEffect';
import FloatingIsland from '../FloatingIsland/FloatingIsland';

export function ParallelBubbleSetUp() {
    //===================== Parallel Effect SetUp Script =====================
    let parallelModule = new DeepParallel( document.querySelector("body") );
    
    fetch('./Dataset/parallel_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        
        parallelModule.SetConfig( myJson );
    });
    //===================== END =====================

    // ===================== Bubble2D Effect SetUp Script =====================
    let bubbleEffect = new BubbleEffect2D(document.querySelector("#webgl_canvas"));
    if (bubbleEffect.IsProgramValid) {
        let bubbleCount : any = document.querySelector("#particle_count");
        let bubbleSpeed : any = document.querySelector("#particle_speed");
        let bubbleInvertBox : any = document.querySelector("#particle_d_invert");
        
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
    // ===================== END =====================
}

export function SlidingEffectSetUp() {
    // ===================== Slide Effect ADP6 SetUp Script =====================
    let vertFilePath = "./glsl/simple_texture.vert", fragFilePath = "./glsl/slide_effect.frag";

    fetch('./Dataset/sliding_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let slideEffectAD = new SlideEffectAD(".adp6_canvas_2d", ".adp6_canvas_webgl", vertFilePath, fragFilePath, myJson);

        if (slideEffectAD.IsProgramValid ) {

            let sliderStrength : any = document.querySelector("input[name='strength']");
            let sliderSpeed : any = document.querySelector("input[name='speed']");
            let sliderScale : any = document.querySelector("input[name='scale']");
    
            sliderStrength.addEventListener("input", (e : any) => {
    
                let sliderLabel: any = document.querySelector("label[name='strength']");
                sliderLabel.innerHTML = "Strength " + e.target.value;
    
                slideEffectAD.webglStrength = parseFloat(e.target.value);
            });
        
            sliderSpeed.addEventListener("input", (e : any) => {
                let sliderLabel: any = document.querySelector("label[name='speed']");
                sliderLabel.innerHTML = "Scale " + e.target.value;
    
                slideEffectAD.webglSpeed = parseFloat(e.target.value);
            });
    
            sliderScale.addEventListener("input", (e : any) => {
                let sliderLabel: any = document.querySelector("label[name='scale']");
                sliderLabel.innerHTML = "Scale " + e.target.value;
    
                slideEffectAD.webglScale = parseFloat(e.target.value);
            });
        }

    });
    // ===================== END =====================
}

export function GlitchEffectSetUp() {
    let vertFilePath = "./glsl/simple_texture.vert", fragFilePath = "./glsl/glitch_effect.frag";
    fetch('./Dataset/glitch_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let glitchEffect = new GlitchEffect(myJson, vertFilePath, fragFilePath);

        SetDomInputValue("strength", (x) => {
            glitchEffect.webglStrength = (x);
        });

        SetDomInputValue("displacement", (x) => {
            glitchEffect.webglDisplacement = (x);
        });

        SetDomInputValue("speed", (x) => {
            glitchEffect.webglSpeed = (x);
        });

        SetDomInputValue("transition", (x) => {
            glitchEffect.webglTransition = (x);
        });
    });
}

export function FloatingIslandSetUp() {
    let vertFilePath = "./glsl/simple_texture.vert", fragFilePath = "./glsl/floating_island_effect.frag";
    fetch('./Dataset/fIsland_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let floatingIsland = new FloatingIsland(myJson, vertFilePath, fragFilePath);

        SetDomInputValue("strength", (x) => {
            floatingIsland.webglStrength = (x);
        });

        SetDomInputValue("sea_level", (x) => {
            floatingIsland.webglDisplacement = (x);
        });

        SetDomInputValue("speed", (x) => {
            floatingIsland.webglSpeed = (x);
        });

        SetDomInputValue("scale", (x) => {
            floatingIsland.webglScale = (x);
        });
    });
}

export function SetDomInputValue(inputName : string, callback : (x : number) => void ) {
    let inputDom : any = document.querySelector(`input[name='${inputName}']`);
    inputDom.addEventListener("input", (e : any) => {    
        let sliderLabel: any = document.querySelector(`label[name='${inputName}']`);
        sliderLabel.innerHTML = inputName.toUpperCase() + " " + e.target.value;

        callback(parseFloat(e.target.value));
    });
    callback(parseFloat(inputDom.value));
}