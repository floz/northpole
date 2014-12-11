objs = require "models/objs"
conf = require "experiment/core/conf"
gui = require "experiment/core/gui"

shader = require "shaders/BasicShader"

class Village extends THREE.Object3D

    constructor: ->
        super

        @_materials = []

        if !conf.isOBJ
            @_hsls = []
            data = objs.get "village"
            for baseMaterial, i in data.materials
                hsl = new THREE.Vector3 1, 0, 1
                @_hsls.push hsl

                material = new THREE.ShaderMaterial
                    uniforms:
                        map: { type: "t", value: baseMaterial.map }
                        hsl: { type: "v3", value: hsl }
                    attributes: null
                    vertexShader: shader.vs
                    fragmentShader: shader.fs

                f = gui.addFolder baseMaterial.name
                f.add hsl, "x", 0, 1
                f.add hsl, "y", 0, 1
                f.add hsl, "z", 0, 1

                data.materials[ i ] = material

            obj = new THREE.Mesh data.geom, new THREE.MeshFaceMaterial data.materials
            @_materials = data.materials
        else
            obj = objs.get( "village" ).geom
            obj.traverse ( child ) ->
                if child instanceof THREE.Mesh
                    child.material.side = THREE.DoubleSide
        obj.scale.set .05, .05, .05
        @add obj

    update: ->
        for material, i in @_materials
            material.uniforms.hsl.value = @_hsls[ i ]

module.exports = Village
