var objModel = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null,
  clock: null,
  stats: null,

  init: function() { // Initialization

    // create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    // prepare camera
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 2000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(755, 65, -60);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // prepare renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    // prepare container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // events
    THREEx.WindowResize(this.renderer, this.camera);

    // prepare controls (OrbitControls)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 2000;

    // prepare clock
    this.clock = new THREE.Clock();

    // prepare stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '50px';
    this.stats.domElement.style.bottom = '50px';
    this.stats.domElement.style.zIndex = 1;
    this.container.appendChild( this.stats.domElement );

    // add directional lightening
    var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(1, 1, 1);
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-1, 1, 1);
    var directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight3.position.set(1, 1, -1);

    this.scene.add(directionalLight1);
    this.scene.add(directionalLight2);
    this.scene.add(directionalLight3);

    // load a model
    this.loadModel();
  },
  loadModel: function() {

    // prepare loader and load the model
    var oLoader = new THREE.ColladaLoader();
    oLoader.load('models/house.dae', function(collada) {
      var object = collada.scene;
      var skin = collada.skins[0];

      object.rotation.x = -Math.PI / 2;
      object.rotation.z = Math.PI / 2;
      object.position.x = -50;
      object.position.y = -100;
      object.position.z = 0;
      object.updateMatrix();
      object.scale.set(1, 1, 1);
      objModel.scene.add(object);
    });
  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  objModel.controls.update(objModel.clock.getDelta());
  objModel.stats.update();
}

// Render the scene
function render() {
  if (objModel.renderer) {
    objModel.renderer.render(objModel.scene, objModel.camera);
    //view = objModel.camera.position;
    //console.log("Position:" + view.x + " " + view.y + " " + view.z);
  }
}

// Initialize objModel on page load
function initializeobjModel() {
  objModel.init();
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeobjModel, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeobjModel);
else window.onload = initializeobjModel;
