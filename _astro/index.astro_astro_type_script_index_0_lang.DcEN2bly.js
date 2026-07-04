import{W as A,S as P,O as b,T as M,L,a as S,V as c,M as y,P as R}from"./three.module.BqRMDIAm.js";const h=document.querySelector("#work-webgl");h&&B(h);function B(a){const i=a.querySelector("canvas"),v=Array.from(a.querySelectorAll("[data-work-item]")),l=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=new A({canvas:i,antialias:!0,alpha:!0});n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.setClearColor(0,0);const d=new P,p=new b(-1,1,1,-1,0,1),x=new M,o=v.map(t=>{const r=x.load(t.dataset.src);return r.minFilter=L,r.generateMipmaps=!1,r}),e={uTexA:{value:o[0]},uTexB:{value:o[0]},uProgress:{value:1},uTime:{value:0},uActive:{value:0},uMouse:{value:new c(.5,.5)},uTarget:{value:new c(.5,.5)},uRes:{value:new c(1,1)}},g=new S({transparent:!0,uniforms:e,vertexShader:`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,fragmentShader:`
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
    `});d.add(new y(new R(2,2),g));function m(){const t=i.clientWidth,r=i.clientHeight;n.setSize(t,r,!1),e.uRes.value.set(t,r)}m(),window.addEventListener("resize",m);let s=0;function w(t){t!==s&&(e.uTexA.value=o[s],e.uTexB.value=o[t],e.uProgress.value=0,s=t)}let u=0;v.forEach((t,r)=>{l||t.addEventListener("pointerenter",()=>{w(r),u=1})}),a.addEventListener("pointermove",t=>{const r=i.getBoundingClientRect();e.uTarget.value.set((t.clientX-r.left)/r.width,1-(t.clientY-r.top)/r.height)}),a.addEventListener("pointerenter",()=>{l||(u=1)}),a.addEventListener("pointerleave",()=>{u=0});const T=performance.now();function f(){e.uTime.value=(performance.now()-T)/1e3,e.uProgress.value+=(1-e.uProgress.value)*.09,e.uActive.value+=(u-e.uActive.value)*.07,e.uMouse.value.lerp(e.uTarget.value,.08),n.render(d,p),requestAnimationFrame(f)}requestAnimationFrame(f)}
