precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D noiseTex;
uniform float time;
uniform float speed;
uniform float strength;

varying vec2 v_uv;

void main () {
    float t = (time) * speed;

    vec4 noiseOffset = texture2D(noiseTex, vec2(v_uv.x + t,  v_uv.y + t * 0.1));
    float normalizeOffset = ( ((noiseOffset.x * 2.0) - 1.0)) * strength;
    vec4 finalColor = texture2D(texture, vec2(v_uv.x + normalizeOffset * 0.5, v_uv.y + (normalizeOffset)));

    float _length = length(finalColor);
    float dynamicPower = _length * sin(t) * strength * 5.0;
    
    finalColor.z = (dynamicPower * 0.9)  + (normalizeOffset + finalColor.z) * ( _length);
    finalColor.y = (dynamicPower * 0.6)  + (normalizeOffset + finalColor.y) * (_length);
    finalColor.x = (dynamicPower * 0.4)  + (normalizeOffset + finalColor.x) * (_length);


    gl_FragColor = finalColor;
    //vec4(length, 0.0 , 0.0 , 1.0);
}