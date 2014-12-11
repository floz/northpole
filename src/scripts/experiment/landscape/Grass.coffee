objs = require "models/objs"
textures = require "models/textures"
conf = require "experiment/core/conf"
gui = require "experiment/core/gui"

shader = require "shaders/Grass"

class Grass extends THREE.Object3D

    constructor: ->
        super

        @_time = 0

        @_hsl = new THREE.Vector3( 1, 0, 1 )

        @_materialShader = new THREE.ShaderMaterial
            uniforms: 
                "map": { type: "t", value: null }
                "mapStrength": { type: "t", value: textures.get( "grassStrength" ) }
                "mapWind": { type: "t", value: textures.get( "wind" ) }
                "mapWindSlashes": { type: "t", value: textures.get( "windSlashes" ) }
                "uTime": { type: "f", value: null }
                "hsl": { type: "v3", value: @_hsl }
            attributes: null
            vertexShader: shader.vs
            fragmentShader: shader.fs
        @_materialShader.minFilter = THREE.LinearFilter
        @_materialShader.magFilter = THREE.LinearFilter

        if !conf.isOBJ
            data = objs.get "grass"
            @_materialShader.uniforms.map.value = data.materials[ 0 ].map;
            obj = new THREE.Mesh data.geom, @_materialShader
        else
            obj = objs.get( "grass" ).geom
            obj.traverse ( child ) ->
                if child instanceof THREE.Mesh
                    child.material.side = THREE.DoubleSide
        obj.scale.set .05, .05, .05
        @add obj


        f = gui.addFolder "main grass"
        f.add @_hsl, "x", 0, 1
        f.add @_hsl, "y", 0, 1
        f.add @_hsl, "z", 0, 1
        # f.open()

    update: ->
        @_time++
        @_materialShader.uniforms.uTime.value = @_time
        @_materialShader.uniforms.hsl.value = @_hsl

module.exports = Grass
