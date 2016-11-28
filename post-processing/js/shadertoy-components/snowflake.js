AFRAME.registerComponent('snowflake', {
  dependencies: ['post-process'],
  following: true, // `true` means we reuse the `dependencies` array

  schema: {
    distance:    { default: 0.01 },
    level:       { default: 0.5 },
    speed:       { default: 0.001 },
  },

  init: function () {
    this.material = new THREE.ShaderMaterial(THREE.SnowflakeShader);
    this.inputUniform = this.material.uniforms.tDiffuse;
  },

  update: function () {
    var data = this.data;
    var uniforms = this.material.uniforms;
    Object.keys(uniforms).forEach(function (key) {
      if ( key in data ) uniforms[key].value = data[key];
    })
  },

  tock: function (time) {
    this.material.uniforms.iGlobalTime.value = time;
  },

  remove: function () {
    this.material.dispose();
  }
});