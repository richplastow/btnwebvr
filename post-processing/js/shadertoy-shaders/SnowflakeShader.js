THREE.SnowflakeShader = {

  uniforms: {

    tDiffuse:    { value: null },
    distance:    { default: 0.01 },
    level:       { default: 0.5 },
    speed:       { default: 0.001 },
    iGlobalTime: { default: 0.0 },

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",

    "}"

  ].join( "\n" ),


  fragmentShader: [

    "uniform sampler2D tDiffuse;",

    //// Component parameters, eg 'snowflake="distance:0.01;"'
    "uniform float distance;",
    "uniform float level;",
    "uniform float speed;",

    //// Passed in by `tock()`.
    "uniform float iGlobalTime;",

    "varying vec2 vUv;",


    //// From www.shadertoy.com/view/XtlSzX
    "#define count 6.0",
    '#define tau 6.28',


    'void mainImage( out vec4 fragColor, in vec2 fragCoord ) {',

    //// The following line was: 'vec2 uv = fragCoord.xy / iResolution.xy;'
    '  vec2 uv = vUv;',

    //// This was 'vec4 c  = texture2D(iChannel0,uv);'
    '  vec4 c  = texture2D(tDiffuse,uv);',

    '  float t = iGlobalTime * speed;',

    //// This was 'float d = .01+sin(t)*.01+iMouse.x/iResolution.x;'
    '  float d = distance;',

    '  for (float i=0.0; i<tau; i+=tau/count) {',
    '    float a = i+t;',

    //// Was 'vec4 c2 = texture2D(iChannel0,vec2(uv.x+cos(a)*d,uv.y+sin(a)*d));'
    '    vec4 c2 = texture2D(tDiffuse,vec2(uv.x+cos(a)*d,uv.y+sin(a)*d));',

    //// The original allowed a darken option, using 'c = max(c,c2);'.
    '    c = max(c,c2*level);',
    '  }',

    '  fragColor = c;',
    '}',


    "void main() {",

      "mainImage( gl_FragColor, vUv );",

    "}"
  ].join( "\n" )

};
