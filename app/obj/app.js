(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Experiment, Loader, loader, start;

Loader = require("loader/Loader");

Experiment = require("experiment/Experiment");

start = function() {
  var experiment;
  experiment = new Experiment();
  return experiment.start();
};

loader = new Loader;

loader.on("complete", start);

loader.load();



},{"experiment/Experiment":2,"loader/Loader":9}],2:[function(require,module,exports){
var Experiment, Scene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Scene = require("experiment/engine/Scene");

Experiment = (function() {
  function Experiment() {
    this._update = __bind(this._update, this);
    this._resize = __bind(this._resize, this);
    this._hXP = 1450;
    this._updateDimensions();
    this._domScene = document.getElementById("scene");
    this._scene = new Scene(this._domScene, this._w, this._hXP);
    this._stats = new Stats();
    this._stats.domElement.style.position = "absolute";
    this._stats.domElement.style.left = "0px";
    this._stats.domElement.style.top = "0px";
    document.body.appendChild(this._stats.domElement);
    this._resize();
    window.addEventListener("resize", this._resize, false);
  }

  Experiment.prototype._updateDimensions = function() {
    this._w = window.innerWidth;
    return this._h = window.innerHeight;
  };

  Experiment.prototype._resize = function() {
    var h;
    this._updateDimensions();
    h = this._h < this._hXP ? this._hXP : this._h;
    this._scene.resize(this._w, h);
    return TweenLite.set(this._domScene, {
      css: {
        y: this._h - h >> 1,
        force3D: true
      }
    });
  };

  Experiment.prototype.start = function() {
    return this._update();
  };

  Experiment.prototype._update = function() {
    this._stats.begin();
    this._scene.update();
    this._stats.end();
    return requestAnimationFrame(this._update);
  };

  return Experiment;

})();

module.exports = Experiment;



},{"experiment/engine/Scene":6}],3:[function(require,module,exports){
module.exports = {
  isOBJ: true
};



},{}],4:[function(require,module,exports){
var Interactions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Interactions = (function() {
  function Interactions() {
    this._downs = {};
    this._moves = {};
    this._ups = {};
    this._interactions = [this._downs, this._moves, this._ups];
    this._isTouchDevice = __indexOf.call(window, "ontouchstart") >= 0 || __indexOf.call(window, "onmsgesturechange") >= 0;
  }

  Interactions.prototype.on = function(elt, action, cb) {
    var evt, obj, proxy;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      obj[elt] = [];
    }
    proxy = function(e) {
      var data;
      data = {};
      if (this._isTouchDevice) {
        data.x = e.touches[0].clientX;
        data.y = e.touches[0].clientY;
      } else {
        data.x = e.clientX;
        data.y = e.clientY;
      }
      return cb.call(this, {
        origin: e,
        x: data.x,
        y: data.y
      });
    };
    obj[elt].push({
      cb: cb,
      proxy: proxy
    });
    return elt.addEventListener(evt, proxy, false);
  };

  Interactions.prototype.off = function(elt, action, cb) {
    var data, datas, evt, obj, result, _i, _len;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      return;
    }
    datas = obj[elt];
    if (cb) {
      result = this._find(cb, datas);
      if (!result) {
        return;
      }
      elt.removeEventListener(evt, result.data.proxy, false);
      datas.splice(result.idx, 1);
    } else {
      for (_i = 0, _len = datas.length; _i < _len; _i++) {
        data = datas[_i];
        elt.removeEventListener(evt, data.proxy, false);
      }
      obj[elt] = [];
    }
  };

  Interactions.prototype.dispose = function(elt) {
    var interaction, _i, _len, _ref;
    _ref = this._interactions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      interaction = _ref[_i];
      if (interaction[elt]) {
        interaction[elt] = null;
        delete interaction[elt];
      }
    }
  };

  Interactions.prototype._getEvent = function(action) {
    var evt;
    evt = "";
    if (this._isTouchDevice) {
      switch (action) {
        case "down":
          return evt = "touchstart";
        case "move":
          return evt = "touchmove";
        case "up":
          return evt = "touchend";
      }
    } else {
      switch (action) {
        case "down":
          return evt = "mousedown";
        case "move":
          return evt = "mousemove";
        case "up":
          return evt = "mouseup";
      }
    }
  };

  Interactions.prototype._getObj = function(action) {
    var obj;
    switch (action) {
      case "down":
        return obj = this._downs;
      case "move":
        return obj = this._moves;
      case "up":
        return obj = this._ups;
    }
  };

  Interactions.prototype._find = function(cb, datas) {
    var data, idx, _i, _len;
    for (idx = _i = 0, _len = datas.length; _i < _len; idx = ++_i) {
      data = datas[idx];
      if (data.cb === cb) {
        return {
          data: data,
          idx: idx
        };
      }
    }
    return null;
  };

  return Interactions;

})();

module.exports = new Interactions;



},{}],5:[function(require,module,exports){
var CameraControls, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("experiment/core/interactions");

CameraControls = (function() {
  function CameraControls(camera) {
    this.camera = camera;
    this._onUp = __bind(this._onUp, this);
    this._onMove = __bind(this._onMove, this);
    this._onDown = __bind(this._onDown, this);
    this._vCenter = new THREE.Vector3(0, 10, 0);
    this._a = 0;
    this._toA = 0;
    this._updatePosition();
    interactions.on(window, "down", this._onDown);
  }

  CameraControls.prototype._onDown = function(e) {
    this._lx = e.x;
    this._ly = e.y;
    interactions.on(window, "move", this._onMove);
    return interactions.on(window, "up", this._onUp);
  };

  CameraControls.prototype._onMove = function(e) {
    var dx;
    dx = e.x - this._lx;
    this._lx = e.x;
    this._toA -= dx * .005;
    if (this._toA < -.86) {
      this._toA = -.86;
    }
    if (this._toA > 1.005) {
      return this._toA = 1.005;
    }
  };

  CameraControls.prototype._onUp = function(e) {
    interactions.off(window, "move", this._onMove);
    return interactions.off(window, "up", this._onUp);
  };

  CameraControls.prototype._updatePosition = function() {
    this.camera.position.x = Math.sin(this._a) * 90;
    this.camera.position.z = Math.cos(this._a) * 90;
    return this.camera.lookAt(this._vCenter);
  };

  CameraControls.prototype.update = function() {
    var a;
    a = this._a;
    this._a += (this._toA - this._a) * .25;
    if (this._a - a === 0) {
      return;
    }
    return this._updatePosition();
  };

  return CameraControls;

})();

module.exports = CameraControls;



},{"experiment/core/interactions":4}],6:[function(require,module,exports){
var CameraControls, Grass, Scene, Village;

CameraControls = require("experiment/engine/CameraControls");

Village = require("experiment/village/Village");

Grass = require("experiment/landscape/Grass");

Scene = (function() {
  function Scene(dom, _w, _h) {
    this.dom = dom;
    this._w = _w;
    this._h = _h;
    this._initEngine();
    this._initPostProcessing();
    this._initLights();
    this._createScene();
  }

  Scene.prototype._initEngine = function() {
    this.scene = new THREE.Scene;
    this.camera = new THREE.PerspectiveCamera(50, this._w / this._h, 1, 5000);
    this.camera.position.y = 12;
    this._cameraControls = new CameraControls(this.camera);
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(this._w, this._h);
    this.renderer.setClearColor(0x1b8fbb);
    return this.dom.appendChild(this.renderer.domElement);
  };

  Scene.prototype._initPostProcessing = function() {
    var pass;
    this._renderTarget = new THREE.WebGLRenderTarget(this._w * window.devicePixelRatio, this._h * window.devicePixelRatio, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    });
    this._composer = new THREE.EffectComposer(this.renderer, this._renderTarget);
    pass = new THREE.RenderPass(this.scene, this.camera);
    this._composer.addPass(pass);
    this._passFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    this._passFXAA.uniforms.resolution.value.x = 1 / this._w / window.devicePixelRatio;
    this._passFXAA.uniforms.resolution.value.y = 1 / this._h / window.devicePixelRatio;
    this._passFXAA.renderToScreen = true;
    return this._composer.addPass(this._passFXAA);
  };

  Scene.prototype._initLights = function() {
    this._lightAmbient = new THREE.AmbientLight(0xffffff);
    return this.scene.add(this._lightAmbient);
  };

  Scene.prototype._createScene = function() {
    this._grass = new Grass;
    this._grass.position.x = 7;
    this.scene.add(this._grass);
    this._village = new Village;
    this._village.position.x = 7;
    return this.scene.add(this._village);
  };

  Scene.prototype.update = function() {
    this._cameraControls.update();
    return this.renderer.render(this.scene, this.camera);
  };

  Scene.prototype.resize = function(_w, _h) {
    this._w = _w;
    this._h = _h;
    this.renderer.setSize(this._w, this._h);
    this._composer.setSize(this._w * window.devicePixelRatio, this._h * window.devicePixelRatio);
    this.camera.aspect = this._w / this._h;
    this.camera.updateProjectionMatrix();
    this._passFXAA.uniforms.resolution.value.x = 1 / this._w / window.devicePixelRatio;
    return this._passFXAA.uniforms.resolution.value.y = 1 / this._h / window.devicePixelRatio;
  };

  return Scene;

})();

module.exports = Scene;



},{"experiment/engine/CameraControls":5,"experiment/landscape/Grass":7,"experiment/village/Village":8}],7:[function(require,module,exports){
var Grass, conf, objs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

conf = require("experiment/core/conf");

Grass = (function(_super) {
  __extends(Grass, _super);

  function Grass() {
    var data, mat, obj, _i, _len, _ref;
    Grass.__super__.constructor.apply(this, arguments);
    if (!conf.isOBJ) {
      data = objs.get("grass");
      _ref = data.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mat = _ref[_i];
        mat.side = THREE.DoubleSide;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
    } else {
      obj = objs.get("grass").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
  }

  return Grass;

})(THREE.Object3D);

module.exports = Grass;



},{"experiment/core/conf":3,"models/objs":11}],8:[function(require,module,exports){
var Village, conf, objs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

conf = require("experiment/core/conf");

Village = (function(_super) {
  __extends(Village, _super);

  function Village() {
    var data, mat, obj, _i, _len, _ref;
    Village.__super__.constructor.apply(this, arguments);
    if (!conf.isOBJ) {
      data = objs.get("village");
      _ref = data.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mat = _ref[_i];
        mat.side = THREE.DoubleSide;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
    } else {
      obj = objs.get("village").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
  }

  return Village;

})(THREE.Object3D);

module.exports = Village;



},{"experiment/core/conf":3,"models/objs":11}],9:[function(require,module,exports){
var Loader, Loader3D,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Loader3D = require("loader/Loader3D");

Loader = (function(_super) {
  __extends(Loader, _super);

  function Loader() {
    this._onLoad3DComplete = __bind(this._onLoad3DComplete, this);
    Loader.__super__.constructor.apply(this, arguments);
    this._loader3D = new Loader3D;
    this._loader3D.once("complete", this._onLoad3DComplete);
  }

  Loader.prototype.load = function() {
    return this._loader3D.load();
  };

  Loader.prototype._onLoad3DComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onComplete = function() {
    return this.emit("complete");
  };

  return Loader;

})(Emitter);

module.exports = Loader;



},{"loader/Loader3D":10}],10:[function(require,module,exports){
var Loader, Loader3D, conf, objs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

objs = require("models/objs");

conf = require("experiment/core/conf");

Loader = (function(_super) {
  __extends(Loader, _super);

  function Loader(id, manager) {
    var loader;
    Loader.__super__.constructor.apply(this, arguments);
    loader = new THREE.JSONLoader(true);
    if (!conf.isOBJ) {
      loader.load("obj/" + id + ".js", (function(_this) {
        return function(obj, materials) {
          objs.register(id, obj, materials);
          return _this.emit("complete");
        };
      })(this));
    } else {
      loader = new THREE.OBJMTLLoader(manager);
      loader.load("obj/" + id + ".obj", "obj/" + id + ".mtl", function(obj) {
        return objs.register(id, obj, null);
      });
    }
  }

  return Loader;

})(Emitter);

Loader3D = (function(_super) {
  __extends(Loader3D, _super);

  function Loader3D() {
    this._onLoadingProgress = __bind(this._onLoadingProgress, this);
    Loader3D.__super__.constructor.apply(this, arguments);
    this._manager = new THREE.LoadingManager;
    this._manager.onProgress = this._onLoadingProgress;
    this._ids = ["village", "grass"];
    this._idxLoaded = 0;
  }

  Loader3D.prototype.load = function() {
    var id, loader, _i, _len, _ref;
    _ref = this._ids;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      loader = new Loader(id, this._manager);
      loader.on("complete", this._onLoadingProgress);
    }
  };

  Loader3D.prototype._onLoadingProgress = function(item, loaded, total) {
    if (!conf.isOBJ) {
      this._idxLoaded++;
      if (this._idxLoaded === this._ids.length) {
        return this.emit("complete");
      }
    } else {
      if (loaded === total) {
        return this.emit("complete");
      }
    }
  };

  return Loader3D;

})(Emitter);

module.exports = Loader3D;



},{"experiment/core/conf":3,"models/objs":11}],11:[function(require,module,exports){
var Objs;

Objs = (function() {
  function Objs() {
    this._objsById = {};
  }

  Objs.prototype.register = function(id, geom, materials) {
    return this._objsById[id] = {
      geom: geom,
      materials: materials
    };
  };

  Objs.prototype.get = function(id) {
    return this._objsById[id];
  };

  return Objs;

})();

module.exports = new Objs;



},{}]},{},[1])
