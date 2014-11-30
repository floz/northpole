objs = require "models/objs"

class Village extends THREE.Object3D

    constructor: ->
        super

        material = new THREE.MeshLambertMaterial
            color: 0x404040
            # wireframe: true


        data = objs.get "village"
        mat.side = THREE.DoubleSide for mat in data.materials
        obj = new THREE.Mesh data.geom, new THREE.MeshFaceMaterial data.materials
        obj.scale.set .05, .05, .05
        @add obj

module.exports = Village
