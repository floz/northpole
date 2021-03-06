Scene = require "experiment/engine/Scene"

class Experiment

    constructor: ->
        @_hXP = 1450

        @_updateDimensions()
        
        @_domScene = document.getElementById "scene"
        @_scene = new Scene @_domScene, @_w, @_hXP

        @_stats = new Stats()
        # @_stats.setMode 1
        @_stats.domElement.style.position = "absolute"
        @_stats.domElement.style.left = "0px"
        @_stats.domElement.style.top = "0px"
        document.body.appendChild( @_stats.domElement )

        @_resize()

        window.addEventListener "resize", @_resize, false

    _updateDimensions: ->
        @_w = window.innerWidth
        @_h = window.innerHeight

    _resize: =>
        @_updateDimensions()

        h = if @_h < @_hXP then @_hXP else @_h
        @_scene.resize @_w, h

        TweenLite.set @_domScene,
            css:
                y: @_h - h >> 1
                force3D: true

    start: ->
        @_update()

    _update: =>
        @_stats.begin()
        @_scene.update()
        @_stats.end()
        
        requestAnimationFrame @_update
        
module.exports = Experiment
