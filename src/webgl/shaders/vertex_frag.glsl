// texture vertex position
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
varying vec2 vTextureOffsetVector;
uniform vec2 uTextureOffsetVector;
uniform vec4 uScale;
void main () {
  gl_Position = aVertexPosition * uScale;
  vTextureCoord = aTextureCoord;
  vTextureOffsetVector = uTextureOffsetVector;
}
