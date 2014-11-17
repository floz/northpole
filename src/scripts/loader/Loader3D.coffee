objs = require "models/objs"

class Loader 

    constructor: ( id, manager ) ->
        loader = new THREE.OBJLoader manager
        loader.load "obj/#{id}.obj", ( obj ) ->
            objs.register id, obj

class Loader3D extends Emitter

    constructor: ->
        super

        @_manager = new THREE.LoadingManager
        @_manager.onProgress = @_onLoadingProgress

        @_ids = [ "village" ]
        @_idxLoaded = 0

    load: ->
        for id in @_ids
            new Loader id, @_manager
        return

    _onLoadingProgress: ( item, loaded, total ) =>
        @emit "complete" if loaded == total

module.exports = Loader3D
