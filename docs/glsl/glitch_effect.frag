precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D noiseTex;
uniform sampler2D distortTex;

uniform float time;
uniform float speed;
uniform float strength;
uniform float scale;
uniform float displacement;
uniform float transition;

varying vec2 v_uv;

float GetRandNumber(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float ToGrayScale(vec4 color) {
    return(color.r * 0.299 + color.g * 0.587 + color.b * 0.114);
}

float Normalize(float val, float min, float max) {
    return (val - min) / (max - min);
}

void main () {
    float t = (time) *speed;

    // vec4 waveyDispl = mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), (sin(v_uv.y * speed) + 1.0) / 2.0);
    // vec2 displUV = vec2(waveyDispl.x * displacement - waveyDispl.y * displacement, 0.0);
    vec2 scaleUV = vec2((v_uv.x - 0.5), (v_uv.y - 0.5));
        scaleUV *= 100.0;

    vec2 id = vec2(floor(scaleUV.x), floor(scaleUV.y));
    float randValue = (GetRandNumber(id) * 2.0) - 1.0;

    vec2 uv = v_uv;

    vec4 distortOffset = texture2D(distortTex, vec2(uv.x + t,  uv.y + t));
    float distortValue = ((distortOffset.x * 2.0) - 1.0) * displacement;
    vec4 noiseOffset = texture2D(noiseTex, vec2(uv.x * 2.0,  uv.y + t * 2.0));
    float noiseValue = Normalize((noiseOffset.x * uv.y) * randValue + uv.x * distortOffset.x, 0.0, 1.1);

    vec2 effectID = vec2(floor(scaleUV.x), floor(scaleUV.y));
    float randEffectValue = GetRandNumber(effectID + distortOffset.xy);

	float amount = 0.0;
	
	amount = (1.0 + sin(t*6.0)) * 0.5;
	amount *= 1.0 + sin(t*16.0) * 0.5;
	amount *= 1.0 + sin(t*19.0) * 0.5;
	amount *= 1.0 + sin(t*27.0) * 0.5;
	amount = pow(amount, 3.0);

	amount *= 0.05 * strength;

    // vec2 uv = (v_uv - 0.5) * scale + 0.5;
    
    vec4 finalColor = texture2D( texture, vec2(uv.x + (distortValue) , uv.y + (distortValue)));
    vec4 noiseColor = finalColor;

    float sequnce = ((uv.y * 5.0) + uv.x) / 5.0;
    float alpha = sin(t) + 1.0 * 0.5;
    if ((noiseValue) >= transition ) {
        float gradient = randValue + 1.0 * (distortValue+1.0 * 0.5);
        vec4 col = vec4(0.152, 0.679, 0.375, 1.0);

        if (randEffectValue < 0.3) {
            col = vec4(0.75 , 0.2226, 0.1679, 1.0);
        } else if ( randEffectValue < 0.76) {
            col = vec4(0.16, 0.5, 0.7226 , 1.0);
        }

        noiseColor = col;
    }

    finalColor.g = finalColor.g;
    finalColor.r = texture2D( texture, vec2(uv.x+amount + distortValue, uv.y + amount*0.1 + distortValue) ).r;
    finalColor.b = texture2D( texture, vec2(uv.x-amount*randValue + distortValue,uv.y - amount * randValue + distortValue) ).b;
    finalColor *= (1.0 - amount * 0.5);
    
    float l = length(finalColor);
    if (l > 0.1) {
        finalColor.a = 1.0;
    }

    vec4 mixColor = mix(finalColor, noiseColor, alpha);
    
    gl_FragColor = mixColor;
}