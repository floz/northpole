objs = require "models/objs"

class Village extends THREE.Object3D

    constructor: ->
        super

        material = new THREE.MeshLambertMaterial
            color: 0x404040

        obj = objs.get "village"
        obj.scale.set .05, .05, .05
        obj.traverse ( child ) ->
            if child instanceof THREE.Mesh
                child.material = material
                child.material.side = THREE.DoubleSide
        @add obj

module.exports = Village
