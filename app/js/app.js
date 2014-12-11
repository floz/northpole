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



},{"experiment/Experiment":2,"loader/Loader":11}],2:[function(require,module,exports){
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



},{"experiment/engine/Scene":7}],3:[function(require,module,exports){
module.exports = {
  isOBJ: false
};



},{}],4:[function(require,module,exports){
module.exports = new dat.GUI();



},{}],5:[function(require,module,exports){
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



},{}],6:[function(require,module,exports){
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



},{"experiment/core/interactions":5}],7:[function(require,module,exports){
var CameraControls, Grass, Rubans, Scene, Village;

CameraControls = require("experiment/engine/CameraControls");

Village = require("experiment/village/Village");

Rubans = require("experiment/village/Rubans");

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
    this._rubans = new Rubans;
    this._rubans.position.x = 7;
    this.scene.add(this._rubans);
    this._village = new Village;
    this._village.position.x = 7;
    return this.scene.add(this._village);
  };

  Scene.prototype.update = function() {
    this._cameraControls.update();
    this._grass.update();
    this._rubans.update();
    this._village.update();
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



},{"experiment/engine/CameraControls":6,"experiment/landscape/Grass":8,"experiment/village/Rubans":9,"experiment/village/Village":10}],8:[function(require,module,exports){
var Grass, conf, gui, objs, shader, textures,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

gui = require("experiment/core/gui");

shader = require("shaders/Grass");

Grass = (function(_super) {
  __extends(Grass, _super);

  function Grass() {
    var data, f, obj;
    Grass.__super__.constructor.apply(this, arguments);
    this._time = 0;
    this._hsl = new THREE.Vector3(1, 0, 1);
    this._materialShader = new THREE.ShaderMaterial({
      uniforms: {
        "map": {
          type: "t",
          value: null
        },
        "mapStrength": {
          type: "t",
          value: textures.get("grassStrength")
        },
        "mapWind": {
          type: "t",
          value: textures.get("wind")
        },
        "mapWindSlashes": {
          type: "t",
          value: textures.get("windSlashes")
        },
        "uTime": {
          type: "f",
          value: null
        },
        "hsl": {
          type: "v3",
          value: this._hsl
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs
    });
    this._materialShader.minFilter = THREE.LinearFilter;
    this._materialShader.magFilter = THREE.LinearFilter;
    if (!conf.isOBJ) {
      data = objs.get("grass");
      this._materialShader.uniforms.map.value = data.materials[0].map;
      obj = new THREE.Mesh(data.geom, this._materialShader);
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
    f = gui.addFolder("main grass");
    f.add(this._hsl, "x", 0, 1);
    f.add(this._hsl, "y", 0, 1);
    f.add(this._hsl, "z", 0, 1);
  }

  Grass.prototype.update = function() {
    this._time++;
    this._materialShader.uniforms.uTime.value = this._time;
    return this._materialShader.uniforms.hsl.value = this._hsl;
  };

  return Grass;

})(THREE.Object3D);

module.exports = Grass;



},{"experiment/core/conf":3,"experiment/core/gui":4,"models/objs":14,"models/textures":15,"shaders/Grass":17}],9:[function(require,module,exports){
var Rubans, conf, objs, shader, textures,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

shader = require("shaders/Ruban");

Rubans = (function(_super) {
  __extends(Rubans, _super);

  function Rubans() {
    var data, mat, material, obj, _i, _len, _ref;
    Rubans.__super__.constructor.apply(this, arguments);
    this._time = 0;
    this._materials = [];
    if (!conf.isOBJ) {
      data = objs.get("rubans");
      console.log(data.materials);
      material = this._getMaterial(data.materials[0].map, textures.get("ruban2"));
      data.materials[0] = material;
      this._materials.push(material);
      material = this._getMaterial(data.materials[1].map, textures.get("ruban1"));
      data.materials[1] = material;
      this._materials.push(material);
      material = this._getMaterial(data.materials[2].map, textures.get("ruban3"));
      data.materials[2] = material;
      this._materials.push(material);
      _ref = data.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mat = _ref[_i];
        mat.side = THREE.DoubleSide;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
    } else {
      obj = objs.get("rubans").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
  }

  Rubans.prototype._getMaterial = function(map, mapStrength) {
    var material;
    return material = new THREE.ShaderMaterial({
      uniforms: {
        "map": {
          type: "t",
          value: map
        },
        "mapStrength": {
          type: "t",
          value: mapStrength
        },
        "uTime": {
          type: "f",
          value: null
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs
    });
  };

  Rubans.prototype.update = function() {
    var material, _i, _len, _ref;
    this._time++;
    _ref = this._materials;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      material = _ref[_i];
      material.uniforms.uTime.value = this._time;
    }
  };

  return Rubans;

})(THREE.Object3D);

module.exports = Rubans;



},{"experiment/core/conf":3,"models/objs":14,"models/textures":15,"shaders/Ruban":18}],10:[function(require,module,exports){
var Village, conf, gui, objs, shader,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

conf = require("experiment/core/conf");

gui = require("experiment/core/gui");

shader = require("shaders/BasicShader");

Village = (function(_super) {
  __extends(Village, _super);

  function Village() {
    var baseMaterial, data, f, hsl, i, material, obj, _i, _len, _ref;
    Village.__super__.constructor.apply(this, arguments);
    this._materials = [];
    if (!conf.isOBJ) {
      this._hsls = [];
      data = objs.get("village");
      _ref = data.materials;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        baseMaterial = _ref[i];
        hsl = new THREE.Vector3(1, 0, 1);
        this._hsls.push(hsl);
        material = new THREE.ShaderMaterial({
          uniforms: {
            map: {
              type: "t",
              value: baseMaterial.map
            },
            hsl: {
              type: "v3",
              value: hsl
            }
          },
          attributes: null,
          vertexShader: shader.vs,
          fragmentShader: shader.fs
        });
        f = gui.addFolder(baseMaterial.name);
        f.add(hsl, "x", 0, 1);
        f.add(hsl, "y", 0, 1);
        f.add(hsl, "z", 0, 1);
        data.materials[i] = material;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
      this._materials = data.materials;
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

  Village.prototype.update = function() {
    var i, material, _i, _len, _ref, _results;
    _ref = this._materials;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      material = _ref[i];
      _results.push(material.uniforms.hsl.value = this._hsls[i]);
    }
    return _results;
  };

  return Village;

})(THREE.Object3D);

module.exports = Village;



},{"experiment/core/conf":3,"experiment/core/gui":4,"models/objs":14,"shaders/BasicShader":16}],11:[function(require,module,exports){
var Loader, Loader3D, LoaderImg,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Loader3D = require("loader/Loader3D");

LoaderImg = require("loader/LoaderImg");

Loader = (function(_super) {
  __extends(Loader, _super);

  function Loader() {
    this._onLoadImgComplete = __bind(this._onLoadImgComplete, this);
    this._onLoad3DComplete = __bind(this._onLoad3DComplete, this);
    Loader.__super__.constructor.apply(this, arguments);
    this._loader3D = new Loader3D;
    this._loader3D.once("complete", this._onLoad3DComplete);
    this._loaderImg = new LoaderImg;
    this._loaderImg.once("complete", this._onLoadImgComplete);
    this._idx = 0;
  }

  Loader.prototype.load = function() {
    this._loader3D.load();
    return this._loaderImg.load();
  };

  Loader.prototype._onLoad3DComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onLoadImgComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onComplete = function() {
    this._idx++;
    if (this._idx < 2) {
      return;
    }
    return this.emit("complete");
  };

  return Loader;

})(Emitter);

module.exports = Loader;



},{"loader/Loader3D":12,"loader/LoaderImg":13}],12:[function(require,module,exports){
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
    this._ids = ["village", "grass", "rubans"];
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



},{"experiment/core/conf":3,"models/objs":14}],13:[function(require,module,exports){
var LoaderImg, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

textures = require("models/textures");

LoaderImg = (function(_super) {
  __extends(LoaderImg, _super);

  function LoaderImg() {
    this._onComplete = __bind(this._onComplete, this);
    this._onTextureLoaded = __bind(this._onTextureLoaded, this);
    LoaderImg.__super__.constructor.apply(this, arguments);
    this._urls = [];
    this._urls.push({
      id: "grassStrength",
      url: "obj/mapgrassSurface_falloff.jpg"
    });
    this._urls.push({
      id: "ruban1",
      url: "obj/ruban1motionSurface_Color.png"
    });
    this._urls.push({
      id: "ruban2",
      url: "obj/ruban2motionSurface_Color.png"
    });
    this._urls.push({
      id: "ruban3",
      url: "obj/ruban3motionSurface_Color.png"
    });
    this._urls.push({
      id: "wind",
      url: "obj/wind.jpg"
    });
    this._urls.push({
      id: "windSlashes",
      url: "obj/wind-slashes.png"
    });
    this._idx = 0;
  }

  LoaderImg.prototype.load = function() {
    var data, _i, _len, _ref, _results;
    _ref = this._urls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      data = _ref[_i];
      _results.push(textures.register(data.id, THREE.ImageUtils.loadTexture(data.url, void 0, this._onTextureLoaded)));
    }
    return _results;
  };

  LoaderImg.prototype._onTextureLoaded = function() {
    this._idx++;
    if (this._idx < this._urls.length) {
      return;
    }
    return this._onComplete();
  };

  LoaderImg.prototype._onComplete = function() {
    return this.emit("complete");
  };

  return LoaderImg;

})(Emitter);

module.exports = LoaderImg;



},{"models/textures":15}],14:[function(require,module,exports){
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



},{}],15:[function(require,module,exports){
var Textures;

Textures = (function() {
  function Textures() {
    this._textureByIds = {};
  }

  Textures.prototype.register = function(id, texture) {
    return this._textureByIds[id] = texture;
  };

  Textures.prototype.get = function(id) {
    return this._textureByIds[id];
  };

  return Textures;

})();

module.exports = new Textures;



},{}],16:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform vec3 hsl;", "uniform sampler2D map;", "vec3 hsv2rgb( vec3 c ) {", "vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );", "vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );", "return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );", "}", "void main() {", "vec4 color = texture2D( map, vUv );", "color.rgb *= hsv2rgb( hsl );", "gl_FragColor = color;", "}"].join("\n");



},{}],17:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "uniform sampler2D mapStrength;", "uniform sampler2D mapWind;", "uniform float uTime;", "vec3 mod289(vec3 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 mod289(vec4 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 permute(vec4 x)", "{", "return mod289(((x*34.0)+1.0)*x);", "}", "vec4 taylorInvSqrt(vec4 r)", "{", "return 1.79284291400159 - 0.85373472095314 * r;", "}", "vec3 fade(vec3 t) {", "return t*t*t*(t*(t*6.0-15.0)+10.0);", "}", "float cnoise(vec3 P)", "{", "vec3 Pi0 = floor(P); // Integer part for indexing", "vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float pnoise(vec3 P, vec3 rep)", "{", "vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period", "vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float turbulence( vec3 p ) {", "float w = 200.0;", "float t = -.5;", "for (float f = 1.0 ; f <= 10.0 ; f++ ){", "float power = pow( 2.0, f );", "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );", "}", "return t;", "}", "varying vec2 vUvDisplacement;", "void main() {", "vUv = uv;", "float strength = texture2D( mapStrength, uv ).r;", "float time = uTime * 0.005;", "float noise = cnoise( vec3( 1.0 ) * time ) * 6.0 * -.10;", "float b = 2.0 * cnoise( normal + vec3( 4.0 * time ) );", "float result = -noise + b;", "time = uTime * 5.0;", "float displacement = -0.5 + time / 2048.0 - floor( time / 2048.0 );", "vUvDisplacement = vec2( vUv.x + displacement, vUv.y - displacement );", "float wind = texture2D( mapWind, vUvDisplacement ).r;", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "mvPosition.x += result * strength * .2 + wind * .1 * strength;", "mvPosition.y += result * strength * .025 - wind * .1 * strength;", "gl_Position = projectionMatrix * mvPosition;", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "varying vec2 vUvDisplacement;", "uniform sampler2D map;", "uniform sampler2D mapWind;", "uniform sampler2D mapWindSlashes;", "uniform float uTime;", "uniform vec3 hsl;", "vec3 hsv2rgb( vec3 c ) {", "vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );", "vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );", "return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );", "}", "void main() {", "vec4 colorWind = texture2D( mapWind, vUvDisplacement );", "vec4 colorWindSlashes = texture2D( mapWindSlashes, vec2( vUv.x - cos( uTime * .1) * .0009, vUv.y + cos( uTime * .1 ) * .001 ) );", "vec4 colorMap = texture2D( map, vUv );", "vec4 color = colorMap + colorWindSlashes * colorWind * .5 + colorWind * 0.00505;", "color.rgb *= hsv2rgb( hsl );", "gl_FragColor = color;", "}"].join("\n");



},{}],18:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "uniform sampler2D mapStrength;", "uniform float uTime;", "vec3 mod289(vec3 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 mod289(vec4 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 permute(vec4 x)", "{", "return mod289(((x*34.0)+1.0)*x);", "}", "vec4 taylorInvSqrt(vec4 r)", "{", "return 1.79284291400159 - 0.85373472095314 * r;", "}", "vec3 fade(vec3 t) {", "return t*t*t*(t*(t*6.0-15.0)+10.0);", "}", "float cnoise(vec3 P)", "{", "vec3 Pi0 = floor(P); // Integer part for indexing", "vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float pnoise(vec3 P, vec3 rep)", "{", "vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period", "vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float turbulence( vec3 p ) {", "float w = 200.0;", "float t = -.5;", "for (float f = 1.0 ; f <= 10.0 ; f++ ){", "float power = pow( 2.0, f );", "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );", "}", "return t;", "}", "void main() {", "vUv = uv;", "float strength = texture2D( mapStrength, uv ).r;", "float time = uTime * 0.005;", "float noise = cnoise( vec3( 1.0 ) * time ) * 6.0 * -.10;", "float b = 2.0 * cnoise( normal + vec3( 4.0 * time ) );", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "mvPosition.y += ( -noise + b ) * strength * .2;", "mvPosition.z += ( -noise + b ) * strength * .2;", "gl_Position = projectionMatrix * mvPosition;", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D map;", "void main() {", "gl_FragColor = texture2D( map, vUv );", "}"].join("\n");



},{}]},{},[1])