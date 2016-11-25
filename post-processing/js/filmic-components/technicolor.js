AFRAME.registerComponent("technicolor", {
  init: function () {
    this.material = new THREE.ShaderMaterial(THREE.TechnicolorShader);
    this.inputUniform = this.material.uniforms.tDiffuse;
  },
  
  remove: function () {
    this.material.dispose();
  }
});
