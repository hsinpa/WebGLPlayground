  precision mediump float;
  
  uniform sampler2D texture;
  varying vec2 v_uv;

  void main () {
    gl_FragColor = texture2D(texture, vec2(v_uv.x,  v_uv.y));
  }

  // uniform vec4 color;
  // void main () {
  //   gl_FragColor = color;
    
  // }