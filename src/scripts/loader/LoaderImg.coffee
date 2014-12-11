textures = require "models/textures"

class LoaderImg extends Emitter

    constructor: ->
        super
        
        @_urls = []
        @_urls.push { id: "grassStrength", url: "obj/mapgrassSurface_falloff.jpg" }
        @_urls.push { id: "ruban1", url: "obj/ruban1motionSurface_Color.png" }
        @_urls.push { id: "ruban2", url: "obj/ruban2motionSurface_Color.png" }
        @_urls.push { id: "ruban3", url: "obj/ruban3motionSurface_Color.png" }
        @_urls.push { id: "wind", url: "obj/wind.jpg" }
        @_urls.push { id: "windSlashes", url: "obj/wind-slashes.png" }

        @_idx = 0

    load: ->
        for data in @_urls
            textures.register data.id, THREE.ImageUtils.loadTexture data.url, undefined, @_onTextureLoaded

    _onTextureLoaded: =>
        @_idx++ 
        return if @_idx < @_urls.length
        @_onComplete()

    _onComplete: =>
        @emit "complete"

module.exports = LoaderImg
