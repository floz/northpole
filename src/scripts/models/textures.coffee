class Textures

    constructor: ->
        @_textureByIds = {}

    register: ( id, texture ) ->
        @_textureByIds[ id ] = texture

    get: ( id ) -> @_textureByIds[ id ]

module.exports = new Textures
