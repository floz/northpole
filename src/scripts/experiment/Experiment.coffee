Scene = require "experiment/scene/Scene"

class Experiment

    constructor: ->
        @_domScene = document.getElementById "scene"
        @_updateDimensions()

        @_scene = new Scene @_domScene, @_w, @_h

        window.addEventListener "resize", @_resize, false

    _updateDimensions: ->
        @_w = window.innerWidth
        @_h = window.innerHeight
        console.log @_w, @_h

    _resize: =>
        @_updateDimensions()
        @_scene.resize @_w, @_h

    start: ->
        @_update()

    _update: =>
        @_scene.update()
        
        requestAnimationFrame @_update
        
module.exports = Experiment
