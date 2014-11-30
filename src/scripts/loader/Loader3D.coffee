objs = require "models/objs"

class Loader extends Emitter

    constructor: ( id, manager ) ->
        super
        loader = new THREE.JSONLoader true
        loader.load "obj/#{id}.js", ( obj, materials ) =>
            objs.register id, obj, materials
            console.log id, obj, materials
            @emit "complete"


        # loader = new THREE.OBJMTLLoader manager
        # loader.load "obj/#{id}.obj", "obj/#{id}.mtl", ( obj ) ->
        #     objs.register id, obj

class Loader3D extends Emitter

    constructor: ->
        super

        @_manager = new THREE.LoadingManager
        @_manager.onProgress = @_onLoadingProgress

        @_ids = [ "village" ]
        @_idxLoaded = 0

    load: ->
        for id in @_ids
            loader = new Loader id, @_manager
            loader.on "complete", @_onLoadingProgress
        return

    _onLoadingProgress: ( item, loaded, total ) =>
        # @emit "complete" if loaded == total
        @_idxLoaded++
        @emit "complete" if @_idxLoaded == @_ids.length

module.exports = Loader3D
