objs = require "models/objs"
conf = require "experiment/core/conf"

class Loader extends Emitter

    constructor: ( id, manager ) ->
        super
        loader = new THREE.JSONLoader true
        if !conf.isOBJ
            loader.load "obj/#{id}.js", ( obj, materials ) =>
                objs.register id, obj, materials
                @emit "complete"
        else
            loader = new THREE.OBJMTLLoader manager
            loader.load "obj/#{id}.obj", "obj/#{id}.mtl", ( obj ) ->
                objs.register id, obj, null


class Loader3D extends Emitter

    constructor: ->
        super

        @_manager = new THREE.LoadingManager
        @_manager.onProgress = @_onLoadingProgress

        @_ids = [ "village", "grass", "rubans" ]
        @_idxLoaded = 0

    load: ->
        for id in @_ids
            loader = new Loader id, @_manager
            loader.on "complete", @_onLoadingProgress
        return

    _onLoadingProgress: ( item, loaded, total ) =>
        if !conf.isOBJ
            @_idxLoaded++
            @emit "complete" if @_idxLoaded == @_ids.length
        else
            @emit "complete" if loaded == total

module.exports = Loader3D
