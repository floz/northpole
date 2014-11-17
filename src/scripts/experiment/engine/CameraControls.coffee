interactions = require "experiment/core/interactions"

class CameraControls

    constructor: ( @camera ) ->
        @_vCenter = new THREE.Vector3 0, 10, 0
        @_a = 0
        @_toA = 0

        @_updatePosition()

        interactions.on window, "down", @_onDown

    _onDown: ( e ) =>
        @_lx = e.x
        @_ly = e.y

        interactions.on window, "move", @_onMove
        interactions.on window, "up", @_onUp

    _onMove: ( e ) =>
        dx = e.x - @_lx
        @_lx = e.x

        @_toA -= dx * .005

    _onUp: ( e ) =>
        interactions.off window, "move", @_onMove
        interactions.off window, "up", @_onUp

    _updatePosition: ->
        @camera.position.x = Math.sin( @_a ) * 90
        @camera.position.z = Math.cos( @_a ) * 90
        @camera.lookAt @_vCenter

    update: ->
        a = @_a
        @_a += ( @_toA - @_a ) * .25
        return if @_a - a == 0
        @_updatePosition()

module.exports = CameraControls
