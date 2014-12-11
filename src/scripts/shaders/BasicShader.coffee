module.exports.vs = [

    "varying vec2 vUv;"

    "void main() {"
        "vUv = uv;"
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );"

    "}"

].join "\n"

module.exports.fs = [

    "varying vec2 vUv;"

    "uniform vec3 hsl;"
    "uniform sampler2D map;"

    "vec3 hsv2rgb( vec3 c ) {"
        "vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );"
        "vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );"
        "return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );"
    "}"

    "void main() {"
        "vec4 color = texture2D( map, vUv );"
        "color.rgb *= hsv2rgb( hsl );"
        "gl_FragColor = color;"
    "}"

].join "\n"
