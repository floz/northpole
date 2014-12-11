objs = require "models/objs"
textures = require "models/textures"
conf = require "experiment/core/conf"

shader = require "shaders/Ruban"

class Rubans extends THREE.Object3D

    constructor: ->
        super

        @_time = 0

        @_materials = []

        if !conf.isOBJ
            data = objs.get "rubans"
            console.log data.materials

            material = @_getMaterial data.materials[ 0 ].map, textures.get( "ruban2" )
            data.materials[ 0 ] = material
            @_materials.push material

            material = @_getMaterial data.materials[ 1 ].map, textures.get( "ruban1" )
            data.materials[ 1 ] = material
            @_materials.push material

            material = @_getMaterial data.materials[ 2 ].map, textures.get( "ruban3" )
            data.materials[ 2 ] = material
            @_materials.push material

            mat.side = THREE.DoubleSide for mat in data.materials
            obj = new THREE.Mesh data.geom, new THREE.MeshFaceMaterial data.materials
        else
            obj = objs.get( "rubans" ).geom
            obj.traverse ( child ) ->
                if child instanceof THREE.Mesh
                    child.material.side = THREE.DoubleSide
        obj.scale.set .05, .05, .05
        @add obj

    _getMaterial: ( map, mapStrength ) ->
        material = new THREE.ShaderMaterial
            uniforms: 
                "map": { type: "t", value: map }
                "mapStrength": { type: "t", value: mapStrength }
                "uTime": { type: "f", value: null }
            attributes: null
            vertexShader: shader.vs
            fragmentShader: shader.fs

    update: ->
        @_time++
        for material in @_materials
            material.uniforms.uTime.value = @_time
        return

module.exports = Rubans
