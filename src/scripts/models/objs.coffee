class Objs

    constructor: ->
        @_objsById = {}

    register: ( id, obj ) ->
        @_objsById[ id ] = obj

    get: ( id ) -> @_objsById[ id ]

module.exports = new Objs
