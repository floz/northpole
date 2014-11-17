Loader3D = require "loader/Loader3D"

class Loader extends Emitter

    constructor: ->
        super

        @_loader3D = new Loader3D
        @_loader3D.once "complete", @_onLoad3DComplete

    load: ->
        @_loader3D.load()

    _onLoad3DComplete: =>
        @_onComplete()

    _onComplete: ->
        @emit "complete"

module.exports = Loader
