// texture fragment
precision lowp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vTextureOffsetVector;
void main () {
  gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb, texture2D(uSampler, vTextureCoord+vTextureOffsetVector).r); // rgb + alpha变化
}
