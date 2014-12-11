Loader3D = require "loader/Loader3D"
LoaderImg = require "loader/LoaderImg"

class Loader extends Emitter

    constructor: ->
        super

        @_loader3D = new Loader3D
        @_loader3D.once "complete", @_onLoad3DComplete

        @_loaderImg = new LoaderImg
        @_loaderImg.once "complete", @_onLoadImgComplete

        @_idx = 0

    load: ->
        @_loader3D.load()
        @_loaderImg.load()

    _onLoad3DComplete: =>
        @_onComplete()

    _onLoadImgComplete: =>
        @_onComplete()

    _onComplete: ->
        @_idx++
        return if @_idx < 2
        @emit "complete"

module.exports = Loader
