import { createCoreGeometry, createParticles, createRings } from '@/app/(home)/_components/hero/hero-geometry';
import { getMeteorProgress } from '@/app/(home)/_components/hero/hero-meteor';

export interface HeroRenderer {
  resize(width: number, height: number, pixelRatio: number, fullHeight?: number): void;
  render(timeSeconds: number, theme: 'light' | 'dark'): void;
  dispose(): void;
}

const VERTEX_SHADER = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform float uTime;
uniform float uMode;
uniform vec3 uProjection;
uniform float uPixelRatio;
uniform float uMeteorProgress;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vFade;
mat3 rotation(float x, float y, float z) {
  float cx=cos(x), sx=sin(x), cy=cos(y), sy=sin(y), cz=cos(z), sz=sin(z);
  return mat3(cz,sz,0., -sz,cz,0., 0.,0.,1.) *
    mat3(cy,0.,-sy, 0.,1.,0., sy,0.,cy) *
    mat3(1.,0.,0., 0.,cx,sx, 0.,-sx,cx);
}
void main() {
  vec3 p=aPosition;
  if (uMode > 5.5) {
    float cycle=mod(floor(uTime/24.),3.);
    float direction=cycle < 1.5 ? -1. : 1.;
    vec2 start=vec2(cycle < .5 ? .9 : (cycle < 1.5 ? .2 : -.8), .62+cycle*.06);
    vec2 travel=vec2(direction*.65,-.38);
    vec2 along=normalize(vec2(travel.x*uProjection.y,travel.y));
    vec2 across=vec2(-along.y,along.x);
    vec2 head=start+travel*uMeteorProgress;
    vec2 tail=along*(aPosition.x-1.)*.17+across*aPosition.y*.0025;
    tail.x/=uProjection.y;
    gl_Position=vec4(head+tail,0.,1.);
    vUv=aPosition.xy;
    vFade=smoothstep(0.,.12,uMeteorProgress)*(1.-smoothstep(.6,1.,uMeteorProgress));
    vNormal=vec3(0.);
    vPosition=vec3(0.);
    return;
  }
  mat3 model=mat3(1.);
  if (uMode < .5 || uMode > 4.5) model=rotation(sin(uTime*.035)*.07,uTime*.012,sin(uTime*.025)*.035);
  else if (uMode < 1.5) model=rotation(0.,0.,uTime*.1);
  else if (uMode < 2.5) model=rotation(uTime*.4,uTime*.2,0.);
  if (uMode > 4.5) p=normalize(p)*85.;
  p=model*p;
  if (uMode < .5 || uMode > 4.5) {
    // The viewer drifts inside a spherical field; near points gain more parallax.
    p-=vec3(sin(uTime*.09)*1.8,cos(uTime*.065)*1.3,sin(uTime*.055)*2.);
    p.z+=15.;
  }
  if (uMode > 1.5 && uMode < 4.5) p.y+=sin(uTime)*.15;
  vNormal=model*aNormal;
  vPosition=p;
  vUv=aPosition.xy/2.5;
  float distance=15.-p.z;
  gl_Position=vec4(p.x*uProjection.x/uProjection.y, p.y*uProjection.x, distance*1.001-0.2001, distance);
  float seed=fract(dot(aPosition,vec3(.137,.219,.173)));
  float worldSize=mix(.035,.12,seed*seed);
  float pointSize=worldSize*uProjection.z/max(distance,1.);
  if (uMode > 4.5) pointSize=1.8+seed*.4;
  gl_PointSize=clamp(pointSize,1.8,4.8)*uPixelRatio;
  float nearFade=smoothstep(3.,9.,distance);
  float depthFade=1.-smoothstep(25.,65.,distance);
  float shimmer=.9+.1*sin(uTime*.45+seed*18.);
  vFade=nearFade*mix(.1,.28,depthFade)*shimmer;
  if (uMode > 4.5) vFade=.12+seed*.07;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform float uMode;
uniform float uDark;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vFade;
void main() {
  vec3 color=vec3(uDark);
  float alpha=.15;
  if (uMode > 5.5) {
    float crossSection=1.-smoothstep(.2,1.,abs(vUv.y));
    float tail=pow(clamp(vUv.x,0.,1.),2.5);
    alpha=crossSection*tail*vFade*mix(.2,.32,uDark);
  } else if (uMode < .5 || uMode > 4.5) {
    // Square silhouettes; only the outermost edge is softened, never rounded.
    float edge=max(abs(gl_PointCoord.x-.5),abs(gl_PointCoord.y-.5));
    // Invert a restrained gray around the scene midpoint to keep similar contrast on both themes.
    color=vec3(mix(.42,.58,uDark));
    alpha=(1.-smoothstep(.43,.5,edge))*vFade;
  } else if (uMode > 1.5 && uMode < 2.5) {
    vec3 n=normalize(vNormal);
    vec3 view=normalize(vec3(0.,0.,15.)-vPosition);
    vec3 key=normalize(vec3(-3.2,3.4,8.)-vPosition);
    vec3 side=normalize(vec3(7.9,2.8,3.5)-vPosition);
    vec3 glint=normalize(vec3(sin(uTime*1.35)*5.2,.25+sin(uTime*2.7+.35)*.75,1.65)-vPosition);
    float diffuse=max(dot(n,key),0.)*.18+max(dot(n,side),0.)*.1;
    float specular=pow(max(dot(n,normalize(key+view)),0.),72.)*.85;
    specular+=pow(max(dot(n,normalize(side+view)),0.),96.)*.65;
    specular+=pow(max(dot(n,normalize(glint+view)),0.),110.)*.9;
    float fresnel=pow(1.-max(dot(n,view),0.),4.)*.14;
    color=vec3(mix(.018+diffuse*.28+specular+fresnel,.86+diffuse*.4+specular*.1,uDark));
    alpha=1.;
  } else if (uMode > 3.5 && uMode < 4.5) {
    float radius=length(vUv);
    alpha=(1.-smoothstep(.45,1.,radius))*mix(.045,.12,uDark);
  }
  gl_FragColor=vec4(color,alpha);
}
`;

/** Small fixed-scene renderer: immutable geometry, GPU animation, no scene graph. */
export function createHeroRenderer(canvas: HTMLCanvasElement, layer: 'background' | 'core'): HeroRenderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    depth: layer === 'core',
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const program = gl.createProgram();
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
  };

  try {
    if (!program) throw new Error('Cannot allocate WebGL program');
    const highPrecision = (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ?? 0) > 0;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX_SHADER],
      [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Cannot allocate WebGL shader');
      shaders.push(shader);
      gl.shaderSource(
        shader,
        highPrecision ? source.replace('precision mediump float;', 'precision highp float;') : source
      );
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Cannot compile hero shader');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Cannot link hero shader');
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'aPosition');
    const normal = gl.getAttribLocation(program, 'aNormal');
    const time = gl.getUniformLocation(program, 'uTime');
    const mode = gl.getUniformLocation(program, 'uMode');
    const dark = gl.getUniformLocation(program, 'uDark');
    const projection = gl.getUniformLocation(program, 'uProjection');
    const pixelRatio = gl.getUniformLocation(program, 'uPixelRatio');
    const meteorProgress = gl.getUniformLocation(program, 'uMeteorProgress');
    function buffer(data: Float32Array): WebGLBuffer {
      const result = gl!.createBuffer();
      if (!result) throw new Error('Cannot allocate hero buffer');
      buffers.push(result);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, result);
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
      return result;
    }
    const core = layer === 'core' ? createCoreGeometry() : null;
    const points = layer === 'background' ? buffer(createParticles(3200)) : null;
    const rings = layer === 'background' ? buffer(createRings()) : null;
    const meteor =
      layer === 'background'
        ? buffer(new Float32Array([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, -1, 0, 1, 1, 0, 0, 1, 0]))
        : null;
    const surface = core ? buffer(core.positions) : null;
    const normals = core ? buffer(core.normals) : null;
    const glow = core
      ? buffer(new Float32Array([-2.5, -2.5, 0, 2.5, -2.5, 0, 2.5, 2.5, 0, -2.5, -2.5, 0, 2.5, 2.5, 0, -2.5, 2.5, 0]))
      : null;

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.enableVertexAttribArray(position);

    const draw = (source: WebGLBuffer, primitive: number, count: number, kind: number, offset = 0) => {
      gl.uniform1f(mode, kind);
      gl.bindBuffer(gl.ARRAY_BUFFER, source);
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(primitive, offset, count);
    };

    return {
      resize(width, height, ratio, fullHeight = height) {
        if (disposed) return;
        const w = Math.max(1, width);
        const h = Math.max(1, height);
        const dpr = Math.max(1, Math.min(2, ratio));
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.uniform3f(projection, fullHeight / h / Math.tan((75 * Math.PI) / 360), w / h, fullHeight / 2);
        gl.uniform1f(pixelRatio, dpr);
      },
      render(seconds, theme) {
        if (disposed || gl.isContextLost()) return;
        gl.useProgram(program);
        gl.uniform1f(time, seconds);
        gl.uniform1f(dark, theme === 'dark' ? 1 : 0);
        gl.depthMask(true);
        gl.clear(gl.COLOR_BUFFER_BIT | (core ? gl.DEPTH_BUFFER_BIT : 0));
        gl.disableVertexAttribArray(normal);
        gl.vertexAttrib3f(normal, 0, 0, 1);
        if (points && rings) {
          draw(points, gl.POINTS, 2400, 0);
          draw(points, gl.POINTS, 800, 5, 2400);
          draw(rings, gl.TRIANGLES, 3 * 128 * 6, 1);
          const progress = getMeteorProgress(seconds);
          if (meteor && progress !== null) {
            gl.uniform1f(meteorProgress, progress);
            draw(meteor, gl.TRIANGLES, 6, 6);
          }
        }
        if (surface && normals && glow) {
          gl.disable(gl.DEPTH_TEST);
          gl.depthMask(false);
          draw(glow, gl.TRIANGLES, 6, 4);
          gl.enable(gl.DEPTH_TEST);
          gl.depthMask(true);
          gl.bindBuffer(gl.ARRAY_BUFFER, normals);
          gl.enableVertexAttribArray(normal);
          gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);
          draw(surface, gl.TRIANGLES, 60, 2);
        }
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
