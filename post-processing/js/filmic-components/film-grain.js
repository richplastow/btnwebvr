AFRAME.registerComponent("film-grain", {
  schema: {
    "speed": { default: 1 },
    "nIntensity": { default: 0.5 },
    "sIntensity": { default: 0.05 },
    "sCount":     { default: 4096 },
    "grayscale":  { default: false }
  },

  init: function () {
    this.material = new THREE.ShaderMaterial(THREE.FilmShader);
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
    this.material.uniforms.time.value = this.data.speed * time / 1000;
  },
  
  remove: function () {
    this.material.dispose();
  }
});
