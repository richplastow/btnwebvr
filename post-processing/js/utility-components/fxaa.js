AFRAME.registerComponent("fxaa", {
  init: function () {
    this.material = new THREE.ShaderMaterial(THREE.FXAAShader);
    this.inputUniform = this.material.uniforms.tDiffuse;
  },
  
  tock: function (time) {
    var renderTarget = this.el.sceneEl.renderTarget;
    this.material.uniforms.resolution.value.set(renderTarget.width, renderTarget.height);
  },
  
  remove: function () {
    this.material.dispose();
  }
});
