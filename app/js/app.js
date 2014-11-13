(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Experiment, experiment;

Experiment = require("experiment/Experiment");

experiment = new Experiment();

experiment.start();



},{"experiment/Experiment":2}],2:[function(require,module,exports){
var Experiment, Scene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Scene = require("experiment/scene/Scene");

Experiment = (function() {
  function Experiment() {
    this._update = __bind(this._update, this);
    this._resize = __bind(this._resize, this);
    this._domScene = document.getElementById("scene");
    this._updateDimensions();
    this._scene = new Scene(this._domScene, this._w, this._h);
    window.addEventListener("resize", this._resize, false);
  }

  Experiment.prototype._updateDimensions = function() {
    this._w = window.innerWidth;
    this._h = window.innerHeight;
    return console.log(this._w, this._h);
  };

  Experiment.prototype._resize = function() {
    this._updateDimensions();
    return this._scene.resize(this._w, this._h);
  };

  Experiment.prototype.start = function() {
    return this._update();
  };

  Experiment.prototype._update = function() {
    this._scene.update();
    return requestAnimationFrame(this._update);
  };

  return Experiment;

})();

module.exports = Experiment;



},{"experiment/scene/Scene":3}],3:[function(require,module,exports){
var Scene, Village;

Village = require("experiment/village/Village");

Scene = (function() {
  function Scene(dom, _w, _h) {
    this.dom = dom;
    this._w = _w;
    this._h = _h;
    this._initEngine();
    this._initLights();
    this._createScene();
  }

  Scene.prototype._initEngine = function() {
    this.scene = new THREE.Scene;
    this.camera = new THREE.PerspectiveCamera(50, this._w / this._h, 1, 5000);
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(this._w, this._h);
    return this.dom.appendChild(this.renderer.domElement);
  };

  Scene.prototype._initLights = function() {
    this._lightAmbient = new THREE.AmbientLight(0x404040);
    this._lightAmbient.intensity = .75;
    return this.scene.add(this._lightAmbient);
  };

  Scene.prototype._createScene = function() {
    this._village = new Village;
    return this.scene.add(this._village);
  };

  Scene.prototype.update = function() {
    return this.renderer.render(this.scene, this.camera);
  };

  Scene.prototype.resize = function(_w, _h) {
    this._w = _w;
    this._h = _h;
    this.camera.aspect = this._w / this._h;
    this.camera.updateProjectionMatrix();
    return this.renderer.setSize(this._w, this._h);
  };

  return Scene;

})();

module.exports = Scene;



},{"experiment/village/Village":4}],4:[function(require,module,exports){
var Village,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Village = (function(_super) {
  __extends(Village, _super);

  function Village() {
    var geom, material, mesh;
    Village.__super__.constructor.apply(this, arguments);
    material = new THREE.MeshLambertMaterial({
      color: 0xff00ff
    });
    geom = new THREE.PlaneGeometry(5, 5);
    mesh = new THREE.Mesh(geom, material);
    this.add(mesh);
  }

  return Village;

})(THREE.Object3D);

module.exports = Village;



},{}]},{},[1])