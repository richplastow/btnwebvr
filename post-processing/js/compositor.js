AFRAME.registerSystem("compositor", {
  schema: { type: "string" },
  
  update: function () {
    this.setShaders(this.data ? this.data.match((/(\S+)/gi)):this.data);
  },
  
  init: function () {
    var self = this;
    this.setupPostState();
    var rtOptions = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };
    this.renderTargets = [
      new THREE.WebGLRenderTarget(1, 1, rtOptions),
      new THREE.WebGLRenderTarget(1, 1, rtOptions)
    ];
  },
  
  setShaders: function (s) {
    if(s) { this.shaders = s; }
  },
  
  setupPostState: function () {
    this.scenePost = new THREE.Scene();
    this.cameraPost = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadPost = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.scenePost.add(this.quadPost);
    this.update();
  },
  
  getTargets: function () {
    var srt = this.sceneEl.renderTarget;
    for (var i = 0; i < 2; i++) {
      var rt = this.renderTargets[i];
      if (rt.width !== srt.width || rt.height !== srt.height) {
        rt.setSize(srt.width, srt.height);
      }
    }
    return this.renderTargets;
  },
  
  tock: function () {
    var rts = this.getTargets();
    var scene = this.sceneEl;
    var rt = scene.renderTarget;
    var components = this.sceneEl.components;

    // Ping pong the render targets.
    for (var i = 0; i < this.shaders.length; i++) {
      var component = components[this.shaders[i]]
      if (!component) {
        console.warn("Compositor: specified component is not attached to scene element.");
        return;
      } else if (!component.material || !component.inputUniform) {
        console.warn("Compositor: invalid component specified.");
        return;
      }
      this.quadPost.material = component.material;
      component.inputUniform.value = rt;
      rt = rts[i & 1];
      scene.renderer.render(this.scenePost, this.cameraPost, i === this.shaders.length - 1 ? null: rt);
    }
  },
});