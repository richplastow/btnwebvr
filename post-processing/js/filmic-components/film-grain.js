AFRAME.registerComponent("film-grain", {
  schema: {
    "speed": { default: 1 },
    "nIntensity": { default: 1.0 },
    "sIntensity": { default: 0.05 },
    "sCount":     { default: 1.0 },
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
      if ('sCount' === key) {
        uniforms.sCount.value = data.sCount * 100;
      } else if ('nIntensity' === key) {
        if (1 < uniforms.nIntensity.value) { // 1.01 to 10
          uniforms.nIntensity.value = (data.nIntensity/20) + 0.5; // 0.55 to 1.0
        } else { // 0.01 to 1
          uniforms.nIntensity.value = data.nIntensity / 2; // 0.005 to 0.5
        }
      } else if ('sIntensity' === key) {
        if (1 < uniforms.nIntensity.value) { // 1.01 to 10
          uniforms.sIntensity.value = (data.nIntensity/50)+0.05; // 0.06 to 0.1
        } else { // 0.01 to 1
          uniforms.sIntensity.value = 0.05;
        }
      } else if ( key in data ) {
        uniforms[key].value = data[key];
      }
    })
  },

  tock: function (time) {
    this.material.uniforms.time.value = this.data.speed * time / 1000;
  },

  remove: function () {
    this.material.dispose();
  }
});
