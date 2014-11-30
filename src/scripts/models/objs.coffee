class Objs

    constructor: ->
        @_objsById = {}

    register: ( id, geom, materials ) ->
        @_objsById[ id ] = { geom: geom, materials: materials }

    get: ( id ) -> @_objsById[ id ]

module.exports = new Objs
