// texture vertex position
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
varying vec2 vTextureOffsetVector;
uniform vec2 uTextureOffsetVector;
void main () {
  gl_Position = aVertexPosition;
  vTextureCoord = aTextureCoord;
  vTextureOffsetVector = uTextureOffsetVector;
}
