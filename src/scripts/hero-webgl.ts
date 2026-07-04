import * as THREE from 'three';

// Initialise every distortion canvas on the page (hero, portrait, ...).
document.querySelectorAll<HTMLCanvasElement>('canvas.gl-distort').forEach(init);

function init(canvas: HTMLCanvasElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const src = canvas.dataset.src!;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTex: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTarget: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImageRes: { value: new THREE.Vector2(1, 1) },
  };

  new THREE.TextureLoader().load(src, (t) => {
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    uniforms.uTex.value = t;
    uniforms.uImageRes.value.set(t.image.width, t.image.height);
  });

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uTex;
      uniform float uTime, uHover;
      uniform vec2 uMouse, uRes, uImageRes;
      varying vec2 vUv;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

      vec2 cover(vec2 uv){
        float r = uRes.x/uRes.y;
        float ir = uImageRes.x/uImageRes.y;
        vec2 s = (r < ir) ? vec2(ir/r, 1.0) : vec2(1.0, r/ir);
        return (uv - 0.5)/s + 0.5;
      }

      void main(){
        vec2 uv = cover(vUv);
        vec2 dir = vUv - uMouse;
        float dist = length(dir);
        float infl = smoothstep(0.45, 0.0, dist) * uHover;
        vec2 ndir = dir / (dist + 1e-4);

        float ripple = sin(dist * 42.0 - uTime * 3.2) * 0.014 * infl;
        uv += ndir * ripple;
        uv.x += sin(uv.y * 7.0 + uTime * 0.5) * 0.0022;
        uv.y += cos(uv.x * 9.0 + uTime * 0.4) * 0.0022;

        float ca = 0.0025 + infl * 0.022;
        vec2 off = ndir * ca;
        float r = texture2D(uTex, uv + off).r;
        float g = texture2D(uTex, uv).g;
        float b = texture2D(uTex, uv - off).b;
        vec3 col = vec3(r, g, b);

        col += (hash(vUv * uRes * 0.6 + fract(uTime)) - 0.5) * 0.07;
        col = (col - 0.5) * 1.1 + 0.5;
        col = mix(col, col * vec3(0.92, 0.97, 1.06), 0.25);
        float vig = smoothstep(1.25, 0.25, length(vUv - 0.5));
        col *= mix(0.45, 1.0, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  let hoverTarget = 0;
  if (!reduce) {
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      uniforms.uTarget.value.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      );
    });
    canvas.addEventListener('pointerenter', () => { hoverTarget = 1; });
    canvas.addEventListener('pointerleave', () => { hoverTarget = 0; });
  }

  const start = performance.now();
  function frame() {
    uniforms.uTime.value = (performance.now() - start) / 1000;
    uniforms.uMouse.value.lerp(uniforms.uTarget.value, 0.08);
    uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.06;
    if (uniforms.uRes.value.x < 2) resize();
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  if (reduce) {
    const tick = setInterval(() => { if (uniforms.uTex.value) { resize(); frame(); clearInterval(tick); } }, 80);
  } else {
    requestAnimationFrame(frame);
  }
}
