import * as THREE from 'three';

const root = document.querySelector<HTMLElement>('#work-webgl');
if (root) init(root);

function init(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const items = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-work-item]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const loader = new THREE.TextureLoader();
  const textures = items.map((el) => {
    const t = loader.load(el.dataset.src!);
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  });

  const uniforms = {
    uTexA: { value: textures[0] },
    uTexB: { value: textures[0] },
    uProgress: { value: 1 },
    uTime: { value: 0 },
    uActive: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTarget: { value: new THREE.Vector2(0.5, 0.5) },
    uRes: { value: new THREE.Vector2(1, 1) },
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uTexA, uTexB;
      uniform float uProgress, uTime, uActive;
      uniform vec2 uMouse, uRes;
      varying vec2 vUv;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f);
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }

      void main(){
        vec2 uv = vUv;
        vec2 dir = vUv - uMouse;
        float dist = length(dir);
        vec2 ndir = dir / (dist + 1e-4);

        // gentle parallax toward the cursor
        uv += ndir * 0.025 * smoothstep(0.8, 0.0, dist) * uActive;

        // noise-driven displacement wipe between the two images
        float n = noise(vUv * 3.0 + uTime * 0.05);
        float p = smoothstep(0.0, 1.0, uProgress);
        float mixv = smoothstep(p - 0.35, p + 0.05, n + 0.5 * p);

        // chromatic aberration peaks mid-transition + near cursor
        float trans = 1.0 - abs(uProgress * 2.0 - 1.0);
        float ca = 0.004 + trans * 0.03 + smoothstep(0.5, 0.0, dist) * 0.01 * uActive;
        vec2 off = ndir * ca;

        vec3 a = vec3(texture2D(uTexA, uv + off).r, texture2D(uTexA, uv).g, texture2D(uTexA, uv - off).b);
        vec3 b = vec3(texture2D(uTexB, uv + off).r, texture2D(uTexB, uv).g, texture2D(uTexB, uv - off).b);
        vec3 col = mix(a, b, mixv);

        // grain + cinematic grade
        col += (hash(vUv * uRes * 0.6 + fract(uTime)) - 0.5) * 0.07;
        col = (col - 0.5) * 1.1 + 0.5;
        col = mix(col, col * vec3(0.92, 0.97, 1.06), 0.25);

        gl_FragColor = vec4(col, uActive);
      }
    `,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  let current = 0;
  function show(i: number) {
    if (i === current) return;
    uniforms.uTexA.value = textures[current];
    uniforms.uTexB.value = textures[i];
    uniforms.uProgress.value = 0;
    current = i;
  }

  let activeTarget = 0;
  items.forEach((el, i) => {
    if (reduce) return;
    el.addEventListener('pointerenter', () => { show(i); activeTarget = 1; });
  });
  root.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    uniforms.uTarget.value.set(
      (e.clientX - r.left) / r.width,
      1 - (e.clientY - r.top) / r.height,
    );
  });
  root.addEventListener('pointerenter', () => { if (!reduce) activeTarget = 1; });
  root.addEventListener('pointerleave', () => { activeTarget = 0; });

  const start = performance.now();
  function frame() {
    uniforms.uTime.value = (performance.now() - start) / 1000;
    uniforms.uProgress.value += (1 - uniforms.uProgress.value) * 0.09;
    uniforms.uActive.value += (activeTarget - uniforms.uActive.value) * 0.07;
    uniforms.uMouse.value.lerp(uniforms.uTarget.value, 0.08);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
