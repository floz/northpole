CameraControls = require "experiment/engine/CameraControls"
Village = require "experiment/village/Village"
Floor = require "experiment/landscape/Floor"

class Scene

    constructor: ( @dom, @_w, @_h ) ->
        @_initEngine()
        @_initPostProcessing()
        @_initLights()

        @_createScene()

    _initEngine: ->
        @scene = new THREE.Scene

        @camera = new THREE.PerspectiveCamera 50, @_w / @_h, 1, 5000
        @camera.position.y = 12

        @_cameraControls = new CameraControls @camera

        @renderer = new THREE.WebGLRenderer
        @renderer.setSize @_w, @_h
        @renderer.setClearColor 0x1b8fbb

        @dom.appendChild @renderer.domElement

    _initPostProcessing: ->
        @_renderTarget = new THREE.WebGLRenderTarget @_w * window.devicePixelRatio, @_h * window.devicePixelRatio,
            minFilter: THREE.LinearFilter
            magFilter: THREE.LinearFilter
            format: THREE.RGBAFormat
            stencilBuffer: false

        @_composer = new THREE.EffectComposer @renderer, @_renderTarget

        pass = new THREE.RenderPass @scene, @camera
        @_composer.addPass pass

        @_passFXAA = new THREE.ShaderPass THREE.FXAAShader
        @_passFXAA.uniforms.resolution.value.x = 1 / @_w / window.devicePixelRatio
        @_passFXAA.uniforms.resolution.value.y = 1 / @_h / window.devicePixelRatio
        @_passFXAA.renderToScreen = true
        @_composer.addPass @_passFXAA

    _initLights: ->
        @_lightAmbient = new THREE.AmbientLight 0xffffff
        @scene.add @_lightAmbient

    _createScene: ->
        @_floor = new Floor
        @scene.add @_floor

        @_village = new Village
        @_village.position.x = 7
        @scene.add @_village

    update: ->
        @_cameraControls.update()
        @renderer.render @scene, @camera
        # @_composer.render()

    resize: ( @_w, @_h ) ->
        @renderer.setSize @_w, @_h
        @_composer.setSize @_w * window.devicePixelRatio, @_h * window.devicePixelRatio

        @camera.aspect = @_w / @_h
        @camera.updateProjectionMatrix()

        @_passFXAA.uniforms.resolution.value.x = 1 / @_w / window.devicePixelRatio
        @_passFXAA.uniforms.resolution.value.y = 1 / @_h / window.devicePixelRatio




module.exports = Scene
