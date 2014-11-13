Village = require "experiment/village/Village"

class Scene

    constructor: ( @dom, @_w, @_h ) ->
        @_initEngine()
        @_initLights()

        @_createScene()

    _initEngine: ->
        @scene = new THREE.Scene

        @camera = new THREE.PerspectiveCamera 50, @_w / @_h, 1, 5000
        @camera.position.z = 30

        @renderer = new THREE.WebGLRenderer
        @renderer.setSize @_w, @_h

        @dom.appendChild @renderer.domElement

    _initLights: ->
        @_lightAmbient = new THREE.AmbientLight 0x404040
        @_lightAmbient.intensity = .75
        @scene.add @_lightAmbient

    _createScene: ->
        @_village = new Village
        @scene.add @_village

    update: ->
        @renderer.render @scene, @camera

    resize: ( @_w, @_h ) ->
        @camera.aspect = @_w / @_h
        @camera.updateProjectionMatrix()

        @renderer.setSize @_w, @_h


module.exports = Scene
