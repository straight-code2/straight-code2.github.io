function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classPrivateMethodGet(receiver, privateSet, fn) {if (!privateSet.has(receiver)) {throw new TypeError("attempted to get private field on non-instance");}return fn;}function _classPrivateFieldGet(receiver, privateMap) {var descriptor = privateMap.get(receiver);if (!descriptor) {throw new TypeError("attempted to get private field on non-instance");}if (descriptor.get) {return descriptor.get.call(receiver);}return descriptor.value;}function _classPrivateFieldSet(receiver, privateMap, value) {var descriptor = privateMap.get(receiver);if (!descriptor) {throw new TypeError("attempted to set private field on non-instance");}if (descriptor.set) {descriptor.set.call(receiver, value);} else {if (!descriptor.writable) {throw new TypeError("attempted to set read only private field");}descriptor.value = value;}return value;}console.clear();

const { Button, ButtonGroup, Carousel, CloseButton, Dropdown } = ReactBootstrap;
const { useState } = React;
const {
  devicePixelRatio,
  innerHeight: viewportHeight,
  innerWidth: viewportWidth } =
window;var _building = new WeakMap();var _controls = new WeakMap();var _orbital = new WeakMap();var _player = new WeakMap();var _prevTimestamp = new WeakMap();var _renderer = new WeakMap();var _showroom = new WeakMap();var _activeMouseOvers = new WeakMap();var _addPlayer = new WeakSet();var _addBuilding = new WeakSet();var _addShowroom = new WeakSet();var _update = new WeakMap();var _render = new WeakMap();

class Scene extends THREE.Scene {

















  constructor() {
    super();_addShowroom.add(this);_addBuilding.add(this);_addPlayer.add(this);_building.set(this, { writable: true, value: void 0 });_controls.set(this, { writable: true, value: void 0 });_orbital.set(this, { writable: true, value: void 0 });_player.set(this, { writable: true, value: void 0 });_prevTimestamp.set(this, { writable: true, value: void 0 });_renderer.set(this, { writable: true, value: void 0 });_showroom.set(this, { writable: true, value: void 0 });_activeMouseOvers.set(this, { writable: true, value: new Set() });_defineProperty(this, "addActiveMouseOver",


















    id => _classPrivateFieldGet(this, _activeMouseOvers).add(id));_defineProperty(this, "deleteActiveMouseOver",

    id => _classPrivateFieldGet(this, _activeMouseOvers).delete(id));_update.set(this, { writable: true, value:


































      elapsedTime => {
        _classPrivateFieldGet(this, _renderer).setSize(window.innerWidth, window.innerHeight);

        document.body.style.cursor = _classPrivateFieldGet(this, _activeMouseOvers).size > 0 ?
        'pointer' :
        'default';

        emit(Scene.EVENTS.UPDATE, {
          elapsedTime,
          addActiveMouseOver: this.addActiveMouseOver,
          deleteActiveMouseOver: this.deleteActiveMouseOver,
          controls: _classPrivateFieldGet(this, _controls),
          orbital: _classPrivateFieldGet(this, _orbital),
          player: _classPrivateFieldGet(this, _player) });

      } });_render.set(this, { writable: true, value:

      timestamp => {
        if (_classPrivateFieldGet(this, _prevTimestamp) === undefined) _classPrivateFieldSet(this, _prevTimestamp, timestamp);

        const elapsedTime = (timestamp - _classPrivateFieldGet(this, _prevTimestamp)) / 1000;
        _classPrivateFieldGet(this, _update).call(this, elapsedTime);
        _classPrivateFieldSet(this, _prevTimestamp, timestamp);

        TWEEN.update(timestamp);
        _classPrivateFieldGet(this, _renderer).render(this, _classPrivateFieldGet(this, _orbital).camera);
      } });scene = this;_classPrivateFieldSet(this, _renderer, new THREE.WebGLRenderer({ antialias: true }));_classPrivateFieldGet(this, _renderer).shadowMap.enabled = true;_classPrivateMethodGet(this, _addPlayer, _addPlayer2).call(this);_classPrivateMethodGet(this, _addBuilding, _addBuilding2).call(this);_classPrivateMethodGet(this, _addShowroom, _addShowroom2).call(this); // const axesHelper = new THREE.AxesHelper(15)
    // this.add(axesHelper)
    document.body.appendChild(_classPrivateFieldGet(this, _renderer).domElement);_classPrivateFieldGet(this, _renderer).setAnimationLoop(_classPrivateFieldGet(this, _render));}}_defineProperty(Scene, "width", 50);_defineProperty(Scene, "height", 30);_defineProperty(Scene, "timeDilation", .1);_defineProperty(Scene, "EVENTS", { UPDATE: 'update' });var _addPlayer2 = function _addPlayer2() {// Create the playable character
  _classPrivateFieldSet(this, _player, new Player({ animationNames: ['idle', 'walk', 'run'], modelName: 'root', onLoad: () => document.querySelector('#loading').style.display = 'none', path: 'https://assets.codepen.io/829639/' }));this.add(_classPrivateFieldGet(this, _player)); // Create the player/camera controls
  _classPrivateFieldSet(this, _controls, { position: new TouchInput(TouchInput.POSITION_LEFT), rotation: new TouchInput(TouchInput.POSITION_RIGHT) }); // Create the orbital camera, and attach it to the player
  const aspect = viewportWidth / viewportHeight;_classPrivateFieldSet(this, _orbital, new OrbitalCamera(60, aspect, 1, 1000));_classPrivateFieldGet(this, _player).add(_classPrivateFieldGet(this, _orbital));};var _addBuilding2 = function _addBuilding2() {_classPrivateFieldSet(this, _building, new Building());this.add(_classPrivateFieldGet(this, _building));};var _addShowroom2 = function _addShowroom2() {_classPrivateFieldSet(this, _showroom, new Showroom(productData));_classPrivateFieldGet(this, _showroom).position.set(0, 0, Scene.width / -2 + 12);this.add(_classPrivateFieldGet(this, _showroom));};var _sides = new WeakMap();var _addSide = new WeakSet();var _addStructure = new WeakSet();var _addLights = new WeakSet();var _makeLight = new WeakSet();var _makeWall = new WeakSet();var _update2 = new WeakMap();class Building extends THREE.Group {
  constructor() {
    super();_makeWall.add(this);_makeLight.add(this);_addLights.add(this);_addStructure.add(this);_addSide.add(this);_sides.set(this, { writable: true, value: [] });_update2.set(this, { writable: true, value:































































































      e => {
        try {
          const { detail: { orbital: { rayToTarget: raycaster } } } = e;
          const maxDistance = raycaster.distanceToTarget;
          const activeSides = raycaster.intersectObjects(_classPrivateFieldGet(this, _sides));

          _classPrivateFieldGet(this, _sides).forEach(side => {
            const activeSide = activeSides.find(s => s.object.name === side.name);
            const isBlockingView = !!activeSide &&
            activeSide.distance <= raycaster.distanceToTarget;
            // side.material.wireframe = isBlockingView
            side.material.opacity = isBlockingView ? 0.0 : 1;
          });
        } catch (e) {
          console.error('OOPS:', e);
        }
      } });_classPrivateMethodGet(this, _addLights, _addLights2).call(this);_classPrivateMethodGet(this, _addStructure, _addStructure2).call(this);observe(Scene.EVENTS.UPDATE, _classPrivateFieldGet(this, _update2));}}var _addSide2 = function _addSide2(side) {_classPrivateFieldGet(this, _sides).push(side);this.add(side);};var _addStructure2 = function _addStructure2() {const halfWidth = Scene.width / 2;const halfHeight = Scene.height / 2;const halfTurn = Math.PI / 2;const floorGeometry = new THREE.BoxGeometry(Scene.width, 0.1, Scene.width);const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .2, roughness: 0 });const floor = new THREE.Mesh(floorGeometry, floorMaterial);floor.receiveShadow = true;floor.position.set(0, 0, 0);floor.name = 'floor';floor.userData.normal = new THREE.Vector3(0, 0, -1);_classPrivateMethodGet(this, _addSide, _addSide2).call(this, floor);const ceiling = floor.clone();ceiling.position.set(0, Scene.height, 0);ceiling.name = 'ceiling';ceiling.userData.normal = new THREE.Vector3(0, 0, -1);_classPrivateMethodGet(this, _addSide, _addSide2).call(this, ceiling);const northWall = _classPrivateMethodGet(this, _makeWall, _makeWall2).call(this, 'north');northWall.position.set(0, halfHeight, -halfWidth);const southWall = _classPrivateMethodGet(this, _makeWall, _makeWall2).call(this, 'south');southWall.position.set(0, halfHeight, halfWidth);const westWall = _classPrivateMethodGet(this, _makeWall, _makeWall2).call(this, 'west');westWall.rotateY(halfTurn);westWall.position.set(-halfWidth, halfHeight, 0);const eastWall = _classPrivateMethodGet(this, _makeWall, _makeWall2).call(this, 'east');eastWall.rotateY(-halfTurn);eastWall.position.set(halfWidth, halfHeight, 0);};var _addLights2 = function _addLights2() {const lastLight = Scene.width - 20;const halfWidth = Scene.width / 2;const ambient = new THREE.AmbientLight(0xffffff, .5);this.add(ambient);let l = 0;const spacing = 100;const intensity = spacing / Scene.width;for (let x = 0; x < Scene.width; x += spacing) {for (let z = 0; z < Scene.width; z += spacing) {const position = new THREE.Vector3(x - halfWidth, 20, z - halfWidth);const target = new THREE.Vector3(x - halfWidth, 0, z - halfWidth);_classPrivateMethodGet(this, _makeLight, _makeLight2).call(this, position, target, intensity);l++;}}};var _makeLight2 = function _makeLight2(position, target, intensity = .1) {const light = new THREE.SpotLight(0xffffff, intensity);light.position.copy(position);light.target.position.copy(target);light.castShadow = true;this.add(light); // const h = new THREE.SpotLightHelper(light)
  // scene.add(h)
};var _makeWall2 = function _makeWall2(name, color = 0xffffff) {const wallGeometry = new THREE.BoxGeometry(Scene.width, Scene.height, 0.1);const wallMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0, roughness: 0, transparent: true, opacity: .5 });const wall = new THREE.Mesh(wallGeometry, wallMaterial);wall.receiveShadow = true;wall.name = name;_classPrivateMethodGet(this, _addSide, _addSide2).call(this, wall);return wall;};var _color = new WeakMap();var _booths = new WeakMap();var _productData = new WeakMap();var _raycaster = new WeakMap();var _makeBooths = new WeakSet();
class Showroom extends THREE.Group {






  constructor(products, color = 0xffffff) {
    super();_makeBooths.add(this);_color.set(this, { writable: true, value: void 0 });_booths.set(this, { writable: true, value: [] });_productData.set(this, { writable: true, value: void 0 });_raycaster.set(this, { writable: true, value: new THREE.Raycaster() });_defineProperty(this, "update",

















    (timestamp, lookAt) => _classPrivateFieldGet(this, _booths).forEach(booth => booth.update(timestamp, lookAt)));_classPrivateFieldSet(this, _color, color);_classPrivateFieldSet(this, _productData, productData);_classPrivateMethodGet(this, _makeBooths, _makeBooths2).call(this);}}var _makeBooths2 = async function _makeBooths2() {const inventory = await Promise.all(productData.map(async (data, index) => {const booth = await new Booth(data).promise();this.add(booth);_classPrivateFieldGet(this, _booths).push(booth);return booth;}));};var _assetUri = new WeakMap();var _id = new WeakMap();var _lightColor = new WeakMap();var _model = new WeakMap();var _path = new WeakMap();var _position = new WeakMap();var _scale = new WeakMap();var _sizes = new WeakMap();var _title = new WeakMap();var _loadModel = new WeakMap();var _makeStand = new WeakSet();var _makeLight3 = new WeakSet();var _makeHotspot = new WeakSet();var _update3 = new WeakMap();


class Booth extends THREE.Group {










  constructor({
    id: _id2,
    product: {
      lightColor,
      sizes,
      title },

    scene: {
      assetUri,
      path,
      position,
      scale = 1 } })

  {
    super();_makeHotspot.add(this);_makeLight3.add(this);_makeStand.add(this);_assetUri.set(this, { writable: true, value: void 0 });_id.set(this, { writable: true, value: void 0 });_lightColor.set(this, { writable: true, value: 0xffffff });_model.set(this, { writable: true, value: void 0 });_path.set(this, { writable: true, value: void 0 });_position.set(this, { writable: true, value: void 0 });_scale.set(this, { writable: true, value: void 0 });_sizes.set(this, { writable: true, value: void 0 });_title.set(this, { writable: true, value: void 0 });_loadModel.set(this, { writable: true, value:



















      async () => {
        const loader = loaderAsPromise(THREE.GLTFLoader);
        loader.setPath(_classPrivateFieldGet(this, _path));
        const { scene: model } = await loader.load(_classPrivateFieldGet(this, _assetUri));
        model.scale.setScalar(_classPrivateFieldGet(this, _scale));
        model.position.set(0, 4, 0);
        model.traverse(mesh => {
          mesh.castShadow = true;
        });
        _classPrivateFieldSet(this, _model, model);
        _classPrivateFieldGet(this, _model).name = `${_classPrivateFieldGet(this, _id)}_model`;
        this.add(_classPrivateFieldGet(this, _model));

        _classPrivateMethodGet(this, _makeLight3, _makeLight4).call(this);
      } });_update3.set(this, { writable: true, value:









































      e => {
        const { detail: { orbital } } = e;
        const cameraWorldPosition = new THREE.Vector3();
        orbital.camera.getWorldPosition(cameraWorldPosition);
        const lookAt = new THREE.Vector3(cameraWorldPosition.x, 0, cameraWorldPosition.z);
        this.lookAt(lookAt);
      } });_classPrivateFieldSet(this, _assetUri, assetUri);_classPrivateFieldSet(this, _id, _id2);_classPrivateFieldSet(this, _lightColor, lightColor);_classPrivateFieldSet(this, _path, path);_classPrivateFieldSet(this, _position, position);_classPrivateFieldSet(this, _scale, scale);_classPrivateFieldSet(this, _sizes, sizes);_classPrivateFieldSet(this, _title, title);this.position.set(..._classPrivateFieldGet(this, _position));_classPrivateFieldGet(this, _loadModel).call(this);_classPrivateMethodGet(this, _makeStand, _makeStand2).call(this);_classPrivateMethodGet(this, _makeHotspot, _makeHotspot2).call(this);observe(Scene.EVENTS.UPDATE, _classPrivateFieldGet(this, _update3));}

  async promise() {
    return await this;
  }}var _makeStand2 = function _makeStand2() {const width = 1.5;const geometry = new THREE.SphereGeometry(width, 64, 64);const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: .6, roughness: 0 });const stand = new THREE.Mesh(geometry, material);stand.castShadow = true;stand.receiveShadow = true;stand.position.set(0, width, 0);this.add(stand);};var _makeLight4 = function _makeLight4() {const spotLight = new THREE.SpotLight(_classPrivateFieldGet(this, _lightColor), .1);spotLight.position.set(0, 10, 0);spotLight.target.position.set(0, 0, -5);spotLight.castShadow = true;spotLight.shadow.mapSize.width = 1024;spotLight.shadow.mapSize.height = 1024;spotLight.shadow.camera.near = 500;spotLight.shadow.camera.far = 4000;spotLight.shadow.camera.fov = 30;this.add(spotLight);this.add(spotLight.target);};var _makeHotspot2 = function _makeHotspot2() {const id = _classPrivateFieldGet(this, _id);const hotspot = new Hotspot({ id, onClick: _ => toggleProductDetail(id) });hotspot.position.set(-.5, 5, 1);this.add(hotspot);};var _aura = new WeakMap();var _base = new WeakMap();var _centerRing = new WeakMap();var _id3 = new WeakMap();var _onClick = new WeakMap();var _raycaster2 = new WeakMap();var _ring = new WeakMap();var _size = new WeakMap();var _state = new WeakMap();var _stateList = new WeakMap();var _target = new WeakMap();var _makeTarget = new WeakSet();var _makeButton = new WeakSet();var _transformAura = new WeakSet();var _update4 = new WeakMap();


class Hotspot extends THREE.Group {
































  constructor({ id, onClick, raycaster }) {
    super();_transformAura.add(this);_makeButton.add(this);_makeTarget.add(this);_aura.set(this, { writable: true, value: void 0 });_base.set(this, { writable: true, value: void 0 });_centerRing.set(this, { writable: true, value: void 0 });_id3.set(this, { writable: true, value: void 0 });_onClick.set(this, { writable: true, value: void 0 });_raycaster2.set(this, { writable: true, value: void 0 });_ring.set(this, { writable: true, value: void 0 });_size.set(this, { writable: true, value: .4 });_state.set(this, { writable: true, value: void 0 });_stateList.set(this, { writable: true, value: void 0 });_target.set(this, { writable: true, value: void 0 });_update4.set(this, { writable: true, value:









































































      e => {
        try {
          const { detail: {
              addActiveMouseOver,
              deleteActiveMouseOver,
              orbital: { camera, rayToMouse },
              scene } } =
          e;

          rayToMouse.setFromCamera(rayToMouse.mouse, camera);

          const mousedOver = rayToMouse.intersectObject(_classPrivateFieldGet(this, _target));
          const isMousedOver = mousedOver.length > 0;
          const isClicked = isMousedOver && rayToMouse.isMouseDown;
          console.log('isMousedOver:', isMousedOver, '| rayToMouse.isMouseDown', rayToMouse.isMouseDown);
          if (isMousedOver) addActiveMouseOver(_classPrivateFieldGet(this, _id3));else
          deleteActiveMouseOver(_classPrivateFieldGet(this, _id3));

          _classPrivateMethodGet(this, _transformAura, _transformAura2).call(this, isMousedOver);
          if (isClicked) _classPrivateFieldGet(this, _onClick).call(this, _classPrivateFieldGet(this, _id3));
        } catch (e) {
          console.error('OOPS:', e);
        }
      } });_classPrivateFieldSet(this, _id3, id);_classPrivateFieldSet(this, _onClick, onClick);_classPrivateFieldSet(this, _raycaster2, raycaster instanceof THREE.Raycaster ? raycaster : new THREE.Raycaster());_classPrivateMethodGet(this, _makeTarget, _makeTarget2).call(this);_classPrivateMethodGet(this, _makeButton, _makeButton2).call(this);observe(Scene.EVENTS.UPDATE, _classPrivateFieldGet(this, _update4));}}_defineProperty(Hotspot, "auraMaterial", new THREE.MeshBasicMaterial({ color: 0x777777, opacity: .3, side: THREE.DoubleSide, transparent: true }));_defineProperty(Hotspot, "baseMaterial", new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }));_defineProperty(Hotspot, "ringMaterial", new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));_defineProperty(Hotspot, "targetMaterial", new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0, transparent: true, side: THREE.DoubleSide }));var _makeTarget2 = function _makeTarget2() {const geometry = new THREE.CylinderGeometry(_classPrivateFieldGet(this, _size), _classPrivateFieldGet(this, _size), .01, 32);const material = Hotspot.targetMaterial;_classPrivateFieldSet(this, _target, new THREE.Mesh(geometry, material));_classPrivateFieldGet(this, _target).name = _classPrivateFieldGet(this, _id3);_classPrivateFieldGet(this, _target).rotateX(Math.PI / 2);_classPrivateFieldGet(this, _target).position.set(0, 0, .1);this.add(_classPrivateFieldGet(this, _target));};var _makeButton2 = function _makeButton2() {const group = new THREE.Group();const centerRadius = .3;this.add(group);const baseGeometry = new THREE.CylinderGeometry(centerRadius, centerRadius, .1, 32);const base = new THREE.Mesh(baseGeometry, Hotspot.baseMaterial);base.rotateX(Math.PI / 2);base.position.set(0, 0, .001);_classPrivateFieldSet(this, _base, base);group.add(_classPrivateFieldGet(this, _base));const ringGeometry = new THREE.RingGeometry(centerRadius + .1, .05, 64);const ring = new THREE.Mesh(ringGeometry, Hotspot.ringMaterial);ring.position.set(0, 0, .002);_classPrivateFieldSet(this, _ring, ring);group.add(_classPrivateFieldGet(this, _ring));const auraGeometry = new THREE.RingGeometry(centerRadius + .2, .1, 64);const aura = new THREE.Mesh(auraGeometry, Hotspot.auraMaterial);_classPrivateFieldSet(this, _aura, aura);group.add(_classPrivateFieldGet(this, _aura));};var _transformAura2 = function _transformAura2(isMousedOver) {if (isMousedOver) {const scaleBy = 2;new TWEEN.Tween(_classPrivateFieldGet(this, _target).scale).to(new THREE.Vector3(scaleBy, scaleBy, scaleBy), 25).start();new TWEEN.Tween(_classPrivateFieldGet(this, _aura).scale).to(new THREE.Vector3(scaleBy, scaleBy, scaleBy), 25).start();new TWEEN.Tween(_classPrivateFieldGet(this, _aura).material).to({ opacity: .3 }, 25).start();} else {new TWEEN.Tween(_classPrivateFieldGet(this, _target).scale).to(new THREE.Vector3(1, 1, 1), 25).start();new TWEEN.Tween(_classPrivateFieldGet(this, _aura).scale).to(new THREE.Vector3(1, 1, 1), 25).start();new TWEEN.Tween(_classPrivateFieldGet(this, _aura).material).to({ opacity: .7 }, 25).start();}};var _originalCameraAngle = new WeakMap();var _position2 = new WeakMap();var _target2 = new WeakMap();var _update5 = new WeakMap();var _updateRayToMouse = new WeakMap();var _updateRayToTarget = new WeakSet();var _updateRotation = new WeakSet();


class OrbitalCamera extends THREE.Object3D {







  constructor(fov, aspect, near, far) {
    super();_updateRotation.add(this);_updateRayToTarget.add(this);_originalCameraAngle.set(this, { writable: true, value: void 0 });_position2.set(this, { writable: true, value: void 0 });_target2.set(this, { writable: true, value: void 0 });_defineProperty(this, "rayToMouse", new THREE.Raycaster());_defineProperty(this, "rayToTarget", new THREE.Raycaster());_update5.set(this, { writable: true, value:




















      e => {
        const { detail: { controls, elapsedTime, orbital, player } } = e;
        const easeIn = 91;
        let { x: yRotation, y: xRotation } = controls.rotation;
        xRotation = Math.pow(xRotation, easeIn);
        const rotation = new THREE.Euler(xRotation, yRotation, 0);

        _classPrivateMethodGet(this, _updateRotation, _updateRotation2).call(this, elapsedTime, rotation);
        _classPrivateMethodGet(this, _updateRayToTarget, _updateRayToTarget2).call(this, player);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      } });_updateRayToMouse.set(this, { writable: true, value:

      e => {
        const mouse = new THREE.Vector2();
        const cameraWorldPosition = new THREE.Vector3();

        this.camera.getWorldPosition(cameraWorldPosition);
        mouse.x = event.clientX / window.innerWidth * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.rayToMouse.mouse = mouse;
        // console.log('mouse:', ...Object.values(mouse))
        // this.rayToMouse.set(cameraWorldPosition, mouse)
      } });_classPrivateFieldSet(this, _position2, new THREE.Vector3(2, 10, 10));this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);this.camera.position.copy(_classPrivateFieldGet(this, _position2)); // 2, 20, 30
    this.camera.lookAt(0, 5, 0);this.add(this.camera);_classPrivateFieldSet(this, _originalCameraAngle, this.camera.rotation.x);this.rayToMouse.mouse = new THREE.Vector2();this.rayToMouse.isMouseDown = false;observe('mousedown', () => this.rayToMouse.isMouseDown = true);observe('mouseup', () => this.rayToMouse.isMouseDown = false);observe('touchstart', () => this.rayToMouse.isMouseDown = true);observe('touchmove', () => this.rayToMouse.isMouseDown = true);observe('touchend', () => this.rayToMouse.isMouseDown = false);observe('mousemove', _classPrivateFieldGet(this, _updateRayToMouse));observe(Scene.EVENTS.UPDATE, _classPrivateFieldGet(this, _update5));}}var _updateRayToTarget2 = function _updateRayToTarget2(
target) {
  const cameraWorldPosition = new THREE.Vector3();
  const targetWorldPosition = new THREE.Vector3();

  this.camera.getWorldPosition(cameraWorldPosition);
  target.getWorldPosition(targetWorldPosition);

  const dir = cameraWorldPosition.
  clone().
  sub(targetWorldPosition).
  normalize();
  const maxDistance = cameraWorldPosition.distanceTo(targetWorldPosition);
  this.rayToTarget.set(targetWorldPosition, dir);
  this.rayToTarget.distanceToTarget = cameraWorldPosition.distanceTo(targetWorldPosition);
};var _updateRotation2 = function _updateRotation2(

elapsedTime, rotation) {
  if (!rotation instanceof THREE.Euler) return;
  const groupY = this.rotation.y + rotation.y * -elapsedTime;
  this.rotation.set(0, groupY, 0);

  const newCamPos = this.camera.position.clone();
  newCamPos.setY(_classPrivateFieldGet(this, _position2).y - rotation.x * 11);
  this.camera.position.lerp(newCamPos, 0.1);

  const newCamQuat = this.camera.quaternion.clone();
  newCamQuat.setFromAxisAngle(
  new THREE.Vector3(1, 0, 0),
  _classPrivateFieldGet(this, _originalCameraAngle) + rotation.x * Scene.timeDilation);

  this.camera.quaternion.slerp(newCamQuat, 0.1);
};var _action = new WeakMap();var _actionList = new WeakMap();var _areModelsLoaded = new WeakMap();var _mixer = new WeakMap();var _model2 = new WeakMap();var _update6 = new WeakMap();var _animate = new WeakMap();var _move = new WeakMap();var _setAction = new WeakSet();


class Player extends THREE.Group {






  constructor(props) {
    super();_setAction.add(this);_action.set(this, { writable: true, value: void 0 });_actionList.set(this, { writable: true, value: {} });_areModelsLoaded.set(this, { writable: true, value: false });_mixer.set(this, { writable: true, value: void 0 });_model2.set(this, { writable: true, value: void 0 });_update6.set(this, { writable: true, value:































































      e => {
        if (!_classPrivateFieldGet(this, _action)) return;

        const { detail: { controls, elapsedTime, orbital } } = e;
        const { x: xPos, y: zPos } = controls.position;
        const playerPosition = new THREE.Vector3(xPos, 0, zPos);

        playerPosition.multiplyScalar(Scene.timeDilation);
        // Adjust x, z positioning according to orbital rotation
        playerPosition.applyEuler(orbital.rotation);
        _classPrivateFieldGet(this, _animate).call(this, elapsedTime, playerPosition);
        _classPrivateFieldGet(this, _move).call(this, elapsedTime, playerPosition);
      } });_animate.set(this, { writable: true, value:

      (elapsedTime, movement) => {
        const { x, z } = movement;

        const speed = Math.min(Math.abs(x) + Math.abs(z), 1);

        let action = 'idle';

        if (speed === 0) action = 'idle';else
        if (speed < 0.3) action = 'walk';else
        action = 'run';

        _classPrivateMethodGet(this, _setAction, _setAction2).call(this, action);
        _classPrivateFieldGet(this, _mixer).update(elapsedTime);
      } });_move.set(this, { writable: true, value:

      (elapsedTime, movement) => {
        if (!movement instanceof THREE.Vector3) return;
        if (movement.x === 0 && movement.z === 0) return;

        const oldPosition = this.position.clone();
        const halfWidth = Scene.width / 2 - 1.1;
        const nextPosition = this.position.clone();
        nextPosition.add(movement);

        if (nextPosition.x < -halfWidth) nextPosition.x = -halfWidth;
        if (nextPosition.z < -halfWidth) nextPosition.z = -halfWidth;
        if (nextPosition.x > halfWidth) nextPosition.x = halfWidth;
        if (nextPosition.z > halfWidth) nextPosition.z = halfWidth;
        this.position.copy(nextPosition);


        const angle =
        Math.PI +
        Math.atan2(
        oldPosition.x - nextPosition.x,
        oldPosition.z - nextPosition.z);


        if (_classPrivateFieldGet(this, _model2))
        _classPrivateFieldGet(this, _model2).setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      } });const { animationNames, modelName, onLoad, path } = props;const loader = new THREE.FBXLoader();loader.setPath(path);loader.load(`${modelName}.fbx`, model => {/**
       * Resize the model I happened to use. Not a required.
       */model.scale.setScalar(0.04); /**
       * Change the colors of some of the materials in the model I happened to use. Not a required.
       */model.traverse(mesh => {var _mesh$material, _mesh$material2;mesh.castShadow = true;if (((_mesh$material = mesh.material) === null || _mesh$material === void 0 ? void 0 : _mesh$material.name) === 'asdf1:Beta_HighLimbsGeoSG2') {mesh.material.color.setHex(0x333333);mesh.metalicness = 1;mesh.roughness = 0;} else if (((_mesh$material2 = mesh.material) === null || _mesh$material2 === void 0 ? void 0 : _mesh$material2.name) === 'Beta_Joints_MAT') {mesh.material.color.setRGB((Math.floor(Math.random() * 80) + 20) / 100, (Math.floor(Math.random() * 80) + 20) / 100, (Math.floor(Math.random() * 80) + 20) / 100);}});model.position.set(0, 0, 0);model.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);_classPrivateFieldSet(this, _model2, model);this.add(model);_classPrivateFieldSet(this, _mixer, new THREE.AnimationMixer(_classPrivateFieldGet(this, _model2)));const loadingManager = new THREE.LoadingManager();const loader = new THREE.FBXLoader(loadingManager);loader.setPath(path);loadingManager.onLoad = () => {_classPrivateFieldSet(this, _areModelsLoaded, true);_classPrivateMethodGet(this, _setAction, _setAction2).call(this, 'idle');if (typeof onLoad === 'function') onLoad();};animationNames.forEach(name => {loader.load(`${name}.fbx`, model => {const clip = model.animations[0];const action = _classPrivateFieldGet(this, _mixer).clipAction(clip);action.name = name;_classPrivateFieldGet(this, _actionList)[name] = action;});});}, null, e => console.log(e));observe(Scene.EVENTS.UPDATE, _classPrivateFieldGet(this, _update6));}}var _setAction2 = function _setAction2(name) {const prevAction = _classPrivateFieldGet(this, _action);if ((prevAction === null || prevAction === void 0 ? void 0 : prevAction.name) === name) return;

  _classPrivateFieldSet(this, _action, _classPrivateFieldGet(this, _actionList)[name]);

  if (prevAction) {
    _classPrivateFieldGet(this, _action).time = 0.1;
    _classPrivateFieldGet(this, _action).enabled = true;
    _classPrivateFieldGet(this, _action).setEffectiveTimeScale(Scene.timeDilation);
    _classPrivateFieldGet(this, _action).setEffectiveWeight(1.0);
    _classPrivateFieldGet(this, _action).crossFadeFrom(prevAction, 0.5, true);
  }

  _classPrivateFieldGet(this, _action).play();
};


class TouchInput extends THREE.Vector3 {




  constructor(position = TouchInput.POSITION_CENTER) {
    super();_defineProperty(this, "tap",




















































    e => {
      const event = e || window.event;
      event.preventDefault();

      this.isMouseDown = true;

      this.offset = this.getMousePosition(event);
    });_defineProperty(this, "move",

    e => {
      if (!this.isMouseDown) return;

      const event = e || window.event;
      event.preventDefault();

      const mouse = this.getMousePosition(event);
      let left = mouse.x - this.offset.x;
      let top = mouse.y - this.offset.y;

      const sqMag = left * left + top * top;
      if (sqMag > this.maxRadiusSquared) {
        const magnitude = Math.sqrt(sqMag);
        left /= magnitude;
        top /= magnitude;
        left *= this.maxRadius;
        top *= this.maxRadius;
      }

      this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
      this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

      const x =
      (left - this.origin.left + this.domElement.clientWidth / 2) /
      this.maxRadius;
      const y =
      (top - this.origin.top + this.domElement.clientHeight / 2) /
      this.maxRadius;

      this.set(x, y, 0);
      this.normalize();
    });_defineProperty(this, "up",

    e => {
      const event = e || window.event;
      event.preventDefault();

      this.isMouseDown = false;

      this.domElement.style.top = `${this.origin.top}px`;
      this.domElement.style.left = `${this.origin.left}px`;
      this.set(0, 0, 0);
    });const joystick = document.createElement('div');const thumb = document.createElement('div');const threshold = document.createElement('div');thumb.appendChild(threshold);joystick.appendChild(thumb);joystick.className = 'joystick';if (position === TouchInput.POSITION_LEFT) {joystick.className = `${joystick.className} left`;} else if (position === TouchInput.POSITION_RIGHT) {joystick.className = `${joystick.className} right`;} else {joystick.className = `${joystick.className} center`;}thumb.className = 'thumb';threshold.className = 'threshold';document.body.appendChild(joystick);this.domElement = thumb;this.maxRadius = 55;this.maxRadiusSquared = this.maxRadius * this.maxRadius;this.origin = { left: this.domElement.offsetLeft, top: this.domElement.offsetTop };this.isMouseDown = false;if ('ontouchstart' in window) {this.domElement.addEventListener('touchstart', this.tap);this.domElement.addEventListener('touchmove', this.move);this.domElement.addEventListener('touchend', this.up);} else {this.domElement.addEventListener('mousedown', this.tap);this.domElement.addEventListener('mousemove', this.move);this.domElement.addEventListener('mouseup', this.up);this.domElement.addEventListener('mouseout', this.up);}this.up(new Event(''));}getMousePosition(event) {let clientX = event.targetTouches ? event.targetTouches[0].pageX : event.clientX;let clientY = event.targetTouches ? event.targetTouches[0].pageY : event.clientY;return { x: clientX, y: clientY };}}_defineProperty(TouchInput, "POSITION_CENTER", 'center');_defineProperty(TouchInput, "POSITION_LEFT", 'left');_defineProperty(TouchInput, "POSITION_RIGHT", 'right');


function loaderAsPromise(loaderClass, ...args) {
  const loader = new loaderClass(...args);
  const origLoadFn = loader.load;

  loader.load = (modelUri, onProgress) => new Promise((resolve, reject) => {
    origLoadFn.call(
    loader,
    modelUri,
    resolve,
    xhr => {
      if (typeof onProgress === 'function') onProgress(xhr);
    },
    reject);

  });

  return loader;
}

function emit(name, detail) {
  return document.dispatchEvent(new CustomEvent(name, { detail }));
}

function observe(name, callback) {
  return document.addEventListener(name, callback);
}

const productData = [

// left side start
  {
  id: 'mystery-box',
  product: {
    description: 'support straight-code and the team by owning some straight-code merch.',
    images: [
    './assets/jumper1of1.png'],

    sizes: [
    { name: 'xs', price: 35 },
    { name: 'sm', price: 35 },
    { name: 'md', price: 35 },
    { name: 'lg', price: 35 },
    { name: 'xl', price: 35 },
    { name: 'xxl', price: 35 }],

    title: 'straight-code 1of1 Jumper' },

  scene: {
    assetUri: 'mystery-box.glb',
    path: 'https://straight-code.github.io/assets/',
    position: [20, 0, -10],
    quaternion: null,
    rotation: [0, 0, 0],
    scale: 4 } },

    {
      id: 'mystery-box1',
      product: {
        description: 'support straight-code and the team by owning some straight-code merch.',
        images: [
        './assets/jumper1of1.png'],
    
        sizes: [
        { name: 'xs', price: 35 },
        { name: 'sm', price: 35 },
        { name: 'md', price: 35 },
        { name: 'lg', price: 35 },
        { name: 'xl', price: 35 },
        { name: 'xxl', price: 35 }],
    
        title: 'straight-code 1of1 Jumper' },
    
      scene: {
        assetUri: 'mystery-box1.glb',
        path: 'https://straight-code.github.io/assets/',
        position: [20, 0, 0],
        quaternion: null,
        rotation: [0, 0, 0],
        scale: 4 } },
    
        {
          id: 'mystery-box2',
          product: {
            description: 'support straight-code and the team by owning some straight-code merch.',
            images: [
            './assets/jumper1of1.png'],
        
            sizes: [
            { name: 'xs', price: 35 },
            { name: 'sm', price: 35 },
            { name: 'md', price: 35 },
            { name: 'lg', price: 35 },
            { name: 'xl', price: 35 },
            { name: 'xxl', price: 35 }],
        
            title: 'straight-code 1of1 Jumper' },
        
          scene: {
            assetUri: 'mystery-box.glb',
            path: 'https://straight-code.github.io/assets/',
            position: [20, 0, 10],
            quaternion: null,
            rotation: [0, 0, 0],
            scale: 4 } },
    
    
    {
      id: 'mystery-box3',
      product: {
        description: 'straight-code hoodie ',
        images: [
        'https://straight-code.github.io/assets/hoodie.png'],
    
        sizes: [
        { name: 'xs', price: 45.00 },
        { name: 'sm', price: 45.00 },
        { name: 'md', price: 45.00 },
        { name: 'lg', price: 45.00 },
        { name: 'xl', price: 45.00 },
        { name: 'xxl', price: 45.00 }],
    
        title: 'straight-code hoodie' },
    
      scene: {
        assetUri: 'mystery-box1.glb',
        path: 'https://straight-code.github.io/assets/',
        position: [20, 0, 20],
        quaternion: null,
        rotation: [0, 0, 0],
        scale: 4 } },
      
        {
          id: 'mystery-box4',
          product: {
            description: 'support straight-code and the team by owning some straight-code merch.',
            images: [
            './assets/jumper1of1.png'],
        
            sizes: [
            { name: 'xs', price: 35 },
            { name: 'sm', price: 35 },
            { name: 'md', price: 35 },
            { name: 'lg', price: 35 },
            { name: 'xl', price: 35 },
            { name: 'xxl', price: 35 }],
        
            title: 'straight-code 1of1 Jumper' },
        
          scene: {
            assetUri: 'mystery-box.glb',
            path: 'https://straight-code.github.io/assets/',
            position: [20, 0, 30],
            quaternion: null,
            rotation: [0, 0, 0],
            scale: 4 } },

            // left side end

         // front side start
            {
              id: 'mystery-box5',
              product: {
                description: 'support straight-code and the team by owning some straight-code merch.',
                images: [
                './assets/jumper1of1.png'],
            
                sizes: [
                { name: 'xs', price: 35 },
                { name: 'sm', price: 35 },
                { name: 'md', price: 35 },
                { name: 'lg', price: 35 },
                { name: 'xl', price: 35 },
                { name: 'xxl', price: 35 }],
            
                title: 'straight-code 1of1 Jumper' },
            
              scene: {
                assetUri: 'mystery-box.glb',
                path: 'https://straight-code.github.io/assets/',
                position: [-10, 0, -10],
                quaternion: null,
                rotation: [0, 0, 0],
                scale: 4 } },
            
                {
                  id: 'mystery-box6',
                  product: {
                    description: 'support straight-code and the team by owning some straight-code merch.',
                    images: [
                    './assets/jumper1of1.png'],
                
                    sizes: [
                    { name: 'xs', price: 35 },
                    { name: 'sm', price: 35 },
                    { name: 'md', price: 35 },
                    { name: 'lg', price: 35 },
                    { name: 'xl', price: 35 },
                    { name: 'xxl', price: 35 }],
                
                    title: 'straight-code 1of1 Jumper' },
                
                  scene: {
                    assetUri: 'mystery-box1.glb',
                    path: 'https://straight-code.github.io/assets/',
                    position: [0, 0, -10],
                    quaternion: null,
                    rotation: [0, 0, 0],
                    scale: 4 } },
                
                    {
                      id: 'mystery-box7',
                      product: {
                        description: 'support straight-code and the team by owning some straight-code merch.',
                        images: [
                        './assets/jumper1of1.png'],
                    
                        sizes: [
                        { name: 'xs', price: 35 },
                        { name: 'sm', price: 35 },
                        { name: 'md', price: 35 },
                        { name: 'lg', price: 35 },
                        { name: 'xl', price: 35 },
                        { name: 'xxl', price: 35 }],
                    
                        title: 'straight-code 1of1 Jumper' },
                    
                      scene: {
                        assetUri: 'mystery-box.glb',
                        path: 'https://straight-code.github.io/assets/',
                        position: [10, 0, -10],
                        quaternion: null,
                        rotation: [0, 0, 0],
                        scale: 4 } },
                
                  
            // front side end 

// right side start
    {
      id: 'mystery-box8',
      product: {
        description: 'support straight-code and the team by owning some straight-code merch.',
        images: [
        './assets/jumper1of1.png'],
    
        sizes: [
        { name: 'xs', price: 35 },
        { name: 'sm', price: 35 },
        { name: 'md', price: 35 },
        { name: 'lg', price: 35 },
        { name: 'xl', price: 35 },
        { name: 'xxl', price: 35 }],
    
        title: 'straight-code 1of1 Jumper' },
    
      scene: {
        assetUri: 'mystery-box.glb',
        path: 'https://straight-code.github.io/assets/',
        position: [-20, 0, -10],
        quaternion: null,
        rotation: [0, 0, 0],
        scale: 4 } },


{
  id: 'mystery-box9',
  product: {
    description: 'straight-code hoodie ',
    images: [
    'https://straight-code.github.io/assets/hoodie.png'],

    sizes: [
    { name: 'xs', price: 45.00 },
    { name: 'sm', price: 45.00 },
    { name: 'md', price: 45.00 },
    { name: 'lg', price: 45.00 },
    { name: 'xl', price: 45.00 },
    { name: 'xxl', price: 45.00 }],

    title: 'straight-code hoodie' },

  scene: {
    assetUri: 'mystery-box1.glb',
    path: 'https://straight-code.github.io/assets/',
    position: [-20, 0, 0],
    quaternion: null,
    rotation: [0, 0, 0],
    scale: 4 } },
  
    {
      id: 'mystery-box10',
      product: {
        description: 'support straight-code and the team by owning some straight-code merch.',
        images: [
        './assets/jumper1of1.png'],
    
        sizes: [
        { name: 'xs', price: 35 },
        { name: 'sm', price: 35 },
        { name: 'md', price: 35 },
        { name: 'lg', price: 35 },
        { name: 'xl', price: 35 },
        { name: 'xxl', price: 35 }],
    
        title: 'straight-code 1of1 Jumper' },
    
      scene: {
        assetUri: 'mystery-box.glb',
        path: 'https://straight-code.github.io/assets/',
        position: [-20, 0, 10],
        quaternion: null,
        rotation: [0, 0, 0],
        scale: 4 } },
    
        {
          id: 'mystery-box11',
          product: {
            description: 'support straight-code and the team by owning some straight-code merch.',
            images: [
            './assets/jumper1of1.png'],
        
            sizes: [
            { name: 'xs', price: 35 },
            { name: 'sm', price: 35 },
            { name: 'md', price: 35 },
            { name: 'lg', price: 35 },
            { name: 'xl', price: 35 },
            { name: 'xxl', price: 35 }],
        
            title: 'straight-code 1of1 Jumper' },
        
          scene: {
            assetUri: 'mystery-box1.glb',
            path: 'https://straight-code.github.io/assets/',
            position: [-20, 0, 20],
            quaternion: null,
            rotation: [0, 0, 0],
            scale: 4 } },
    
    {
      id: 'mystery-box12',
      product: {
        description: 'straight-code hoodie ',
        images: [
        'https://straight-code.github.io/assets/hoodie.png'],
    
        sizes: [
        { name: 'xs', price: 45.00 },
        { name: 'sm', price: 45.00 },
        { name: 'md', price: 45.00 },
        { name: 'lg', price: 45.00 },
        { name: 'xl', price: 45.00 },
        { name: 'xxl', price: 45.00 }],
    
        title: 'straight-code hoodie' },
    
      scene: {
        assetUri: 'mystery-box.glb',
        path: 'https://straight-code.github.io/assets/',
        position: [-20, 0, 30],
        quaternion: null,
        rotation: [0, 0, 0],
        scale: 4 } }

        // right side end
  ];




/**
 * Product detail overlay
 */
const SizeText = ({ name, price }) => /*#__PURE__*/
React.createElement(React.Fragment, null, "Size ", /*#__PURE__*/
React.createElement("span", { className: "size" }, name), " $", price);


const ProductDetail = ({ id }) => {
  if (!id) return null;

  const data = productData.find(({ id: pid }) => pid === id);
  if (!data) return null;

  const [selectedSize, setSelectedSize] = useState('md');
  const { product: { description, images, sizes, title } } = data;
  const makeSizeText = (name, price) => /*#__PURE__*/
  React.createElement(React.Fragment, null, /*#__PURE__*/
  React.createElement("span", { className: "size" }, name), " $", price);


  const sizeOptions = sizes.map(({ name, price }) => /*#__PURE__*/
  React.createElement(Dropdown.Item, { eventKey: name, href: `#`, key: name, onClick: () => setSelectedSize(name) }, /*#__PURE__*/
  React.createElement(SizeText, { name: name, price: price })));


  const SizeButton = sizes.
  filter(({ name }) => name === selectedSize).
  map(({ name, price }) => /*#__PURE__*/
  React.createElement(Dropdown.Toggle, { variant: "light" }, /*#__PURE__*/
  React.createElement(SizeText, { name: name, price: price })));


  return /*#__PURE__*/(
    React.createElement("aside", { id: "product-overlay" }, /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement(CloseButton, { className: "close-button", onClick: toggleProductDetail }), /*#__PURE__*/
    React.createElement(Button, { variant: "secondary", size: "sm", className: "cancel-button", onClick: toggleProductDetail }, "Cancel"), /*#__PURE__*/
    React.createElement("h2", null, title), /*#__PURE__*/
    React.createElement(ButtonGroup, { className: "social" }, /*#__PURE__*/
    React.createElement(Button, { variant: "light" }, /*#__PURE__*/React.createElement("i", { class: "fa-solid fa-hands-clapping" })), /*#__PURE__*/
    React.createElement(Button, { variant: "light" }, /*#__PURE__*/React.createElement("i", { class: "fa-solid fa-bookmark" })), /*#__PURE__*/
    React.createElement(Button, { variant: "light" }, /*#__PURE__*/React.createElement("i", { class: "fa-brands fa-instagram" })), /*#__PURE__*/
    React.createElement(Button, { variant: "light" }, /*#__PURE__*/React.createElement("i", { class: "fa-brands fa-twitter" })), /*#__PURE__*/


    React.createElement(Carousel, { className: "images" },
    images.map((image) => /*#__PURE__*/
    React.createElement(Carousel.Item, null, /*#__PURE__*/
    React.createElement("img", {
      className: "d-block w-100",
      src: image,
      alt: title })))), /*#__PURE__*/




    React.createElement("p", { className: "description" }, description), /*#__PURE__*/
    React.createElement(ButtonGroup, { className: "buttons" }, /*#__PURE__*/
    React.createElement(Dropdown, { as: ButtonGroup },
    SizeButton, /*#__PURE__*/
    React.createElement(Dropdown.Menu, null, sizeOptions), /*#__PURE__*/
    React.createElement(Button, { variant: "primary", href: "confirm/index.html" }, "Buy")))))));



    };

// Not an ideal implementation, but React isn't the point of this demo.
const toggleProductDetail = id => {
  ReactDOM.render( /*#__PURE__*/
  React.createElement(ProductDetail, { id: id }),
  document.getElementById('overlay'));

};

// toggleProductDetail('green-bay-jacket')
let scene;
new Scene();