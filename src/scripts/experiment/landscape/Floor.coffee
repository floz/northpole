class Floor extends THREE.Object3D

    constructor: ->
        super

        material = new THREE.MeshLambertMaterial
            color: 0xff0000
        geom = new THREE.PlaneBufferGeometry 50, 50
        mesh = new THREE.Mesh geom, material
        @add mesh

        mesh.rotation.x = -Math.PI * .5

module.exports = Floor
