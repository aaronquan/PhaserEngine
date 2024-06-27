const hueFragShader = `
#define SHADER_NAME HUE_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    float c = cos(uTime * uSpeed * outTexCoord.x / outTexCoord.y);
    float s = sin(uTime * uSpeed + outTexCoord.y * outTexCoord.y * outTexCoord.x + gl_FragColor.b);

    mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0,  0.0, 0.0, 1.0);
    mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
    mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

    mat4 hueRotation = r / c + g * c + b * s * c;
    gl_FragColor = texture * hueRotation;
    //float angle = atan(outTexCoord.y, outTexCoord.x) + uTime;
    //gl_FragColor.rgb = vec3(abs(gl_FragColor.r*sin(angle)), abs(gl_FragColor.g*cos(angle)), abs(gl_FragColor.b*sin(angle)));
}
`;

export class HueFragShader extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
  #hueSpeed: number;
  constructor (game: Phaser.Game)
  {
      super({
          game,
          name: 'ColorPostFX',
          fragShader: hueFragShader
      });

      this.#hueSpeed = 0.001;
  }

  onPreRender ()
  {
      this.set1f('uTime', this.game.loop.time);
      this.set1f('uSpeed', this.#hueSpeed);
  }

  get hueSpeed (): any
  {
      return this.#hueSpeed;
  }

  set hueSpeed (value)
  {
    this.#hueSpeed = value;
    console.log(this.#hueSpeed);
  }
}

const frag = `#ifdef GL_ES
precision mediump float;
#endif

//uniform float u_time;

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform float n;

void main() {
  gl_FragColor = texture2D(uMainSampler, outTexCoord);
  //mix(gl_FragColor.rgb, vec3(0, 0, 0));
  //gl_FragColor = 
	gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.21 * gl_FragColor.r + 0.7 * gl_FragColor.g + gl_FragColor.b * 0.1), n);
}`;

const frag2 = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}`
export class RefFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline{
  #p: number;
  constructor(game: Phaser.Game){
    super({
      game,
      fragShader: frag
    });
    this.p = 0;
  }
  get p():number{
    return this.#p;
  }
  set p(n: number){
    this.#p = n;
  }
  onPreRender(){
    //console.log(this.#p);
    this.set1f('n', this.#p);
  }
}