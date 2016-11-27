THREE.ChannelBoostShader = {

	uniforms: {

		tDiffuse: { value: null },
    rBoost:   { default: 1.0 },
    gBoost:   { default: 1.0 },
    bBoost:   { default: 1.0 },
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

		//// Component parameters, eg 'channel-boost="gBoost:2.0; bBoost:0.3"'
		"uniform float rBoost;",
		"uniform float gBoost;",
		"uniform float bBoost;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 tex = texture2D( tDiffuse, vec2(vUv.x, vUv.y) );",
			// "vec4 newTex = vec4(tex.r, (tex.g + tex.b) * 0.001, (tex.g + tex.b) * 0.999, 0.001);",
			"vec4 newTex = vec4(tex.r*rBoost, tex.g*gBoost, tex.b*bBoost, 1.0);",

			"gl_FragColor = newTex;",

		"}"

	].join( "\n" )

};
