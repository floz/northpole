class Floor extends THREE.Object3D

    constructor: ->
        super

        material = new THREE.MeshBasicMaterial
            color: 0x7daa4d
        geom = new THREE.PlaneBufferGeometry 1000, 400
        mesh = new THREE.Mesh geom, material
        @add mesh

        mesh.rotation.x = -Math.PI * .5
        # mesh.position.y = -5

module.exports = Floor
