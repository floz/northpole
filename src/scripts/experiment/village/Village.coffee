class Village extends THREE.Object3D

    constructor: ->
        super

        material = new THREE.MeshLambertMaterial
            color: 0xff00ff
        geom = new THREE.PlaneGeometry 5, 5
        mesh = new THREE.Mesh geom, material
        @add mesh

module.exports = Village
