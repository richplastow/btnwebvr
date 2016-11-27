AFRAME.registerComponent('channel-boost', {
  dependencies: ['post-process'],
  following: true, // `true` means we reuse the `dependencies` array

  schema: {
    rBoost: { default: 1.0 },
    gBoost: { default: 1.0 },
    bBoost: { default: 1.0 },
  },

  init: function () {
    this.material = new THREE.ShaderMaterial(THREE.ChannelBoostShader);
    this.inputUniform = this.material.uniforms.tDiffuse;
  },

  update: function () {
    var data = this.data;
    var uniforms = this.material.uniforms;
    Object.keys(uniforms).forEach(function (key) {
      if (key in data) uniforms[key].value = data[key];
    })
  },

  remove: function () {
    this.material.dispose();
  }
});
