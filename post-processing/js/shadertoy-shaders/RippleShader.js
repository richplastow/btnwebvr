THREE.RippleShader = {

	uniforms: {

		tDiffuse:    { value: null },
    wavelength:  { default: 1000.0 },
    amplitude:   { default: 0.5 },
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

		//// Component parameters, eg 'ripple="level:0.8;"'
		"uniform float wavelength;",
		"uniform float amplitude;",

		//// Passed in by `tock()`.
		"uniform float iGlobalTime;",

		"varying vec2 vUv;",

    //// From www.shadertoy.com/view/4djGzz
    '// MTAT.03.015 Computer Graphics',
    '// https://courses.cs.ut.ee/2013/cg/',
    '//',
    '// Basic ripple effect example',


    '// Simple circular wave function',
    'float wave(vec2 pos, float t, float freq, float numWaves, vec2 center) {',

    '	float d = length(pos - center);',
    '	d = log(1.0 + exp(d));',
    '	return 1.0/(1.0+20.0*d*d) *',
    '		   sin(2.0*3.1415*(-numWaves*d + t*freq));',

    '}',


    '// This height map combines a couple of waves',
    'float height(vec2 pos, float t) {',

    '	float w;',
    '	w =  wave(pos, t, 1.0/wavelength, amplitude, vec2(0.5, -0.5));',
    '	w += wave(pos, t, 1.0/wavelength, amplitude, -vec2(0.5, -0.5));',
    '	return w;',

    '}',


    '// Discrete differentiation',
    'vec2 normal(vec2 pos, float t) {',

    '	return 	vec2(height(pos - vec2(0.01, 0), t) - height(pos, t), ',
    '				 height(pos - vec2(0, 0.01), t) - height(pos, t));',

    '}',


    '// Simple ripple effect',
    'void mainImage( out vec4 fragColor, in vec2 fragCoord ) {',

    // The following line was: '	vec2 uv = fragCoord.xy / iResolution.xy;',
    '	vec2 uv = vUv;',
    '	vec2 uvn = 2.0*uv - vec2(1.0);	',
    '	uv += normal(uvn, iGlobalTime);',
    '	fragColor = texture2D( tDiffuse, vec2(uv.x, uv.y) );',

    '}',


		"void main() {",

			"mainImage( gl_FragColor, vUv );",

		"}"
	].join( "\n" )

};
