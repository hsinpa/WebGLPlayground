precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D noiseTex;
uniform float time;
uniform float speed;
uniform float strength;
uniform float scale;
uniform float displacement;

varying vec2 v_uv;

void main () {
    float t = (time) *speed;

    // vec4 waveyDispl = mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), (sin(v_uv.y * speed) + 1.0) / 2.0);
    // vec2 displUV = vec2(waveyDispl.x * displacement - waveyDispl.y * displacement, 0.0);

    vec2 uv = v_uv;

	float amount = 0.0;
	
	amount = (1.0 + sin(t*6.0)) * 0.5;
	amount *= 1.0 + sin(t*16.0) * 0.5;
	amount *= 1.0 + sin(t*19.0) * 0.5;
	amount *= 1.0 + sin(t*27.0) * 0.5;
	amount = pow(amount, 3.0);

	amount *= 0.05 * strength;

    // vec2 uv = (v_uv - 0.5) * scale + 0.5;

    // vec4 noiseOffset = texture2D(noiseTex, vec2(uv.x + t,  uv.y + sin(t) * 0.25));
    // float normalizeOffset = ( ((noiseOffset.x * 2.0) - 1.0)) * strength;
    vec4 finalColor = texture2D( texture, uv);

    finalColor.g = finalColor.g;
    finalColor.r = texture2D( texture, vec2(uv.x+amount,uv.y + amount*0.1) ).r;
    finalColor.b = texture2D( texture, vec2(uv.x-amount*0.5,uv.y - amount*0.1) ).b;
	finalColor *= (1.0 - amount * 0.5);
    
    float l = length(finalColor);

    if (l > 0.1) {
        finalColor.a = 1.0;
    }

    // texture2D(texture, vec2(uv.x + normalizeOffset * 0.5, uv.y + (normalizeOffset)));

    gl_FragColor = finalColor;
}