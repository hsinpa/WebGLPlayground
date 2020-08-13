  precision mediump float;
  
  uniform sampler2D texture;
  uniform sampler2D noiseTex;
  uniform sampler2D transitionTex;

  uniform float time;
  uniform float transition;

  varying vec2 v_uv;

  void main () {
    float scaleTime = time * 0.5;
    vec4 noiseOffset = texture2D(noiseTex, vec2(v_uv.x + scaleTime,  v_uv.y + scaleTime)) * 0.05;

    gl_FragColor = texture2D(texture, vec2(v_uv.x,  v_uv.y + noiseOffset.x));
  }

  // uniform vec4 color;
  // void main () {
  //   gl_FragColor = color;
    
  // }