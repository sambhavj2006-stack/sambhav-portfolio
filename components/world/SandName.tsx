"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { worldPointer } from "@/lib/world";
import { sampleHeroName } from "./sandNameSampler";
import { sandFragmentShader, sandVertexShader } from "./sandNameShader";

const HERO_NAME_ID = "hero-name";

/**
 * The hero name, rebuilt from grains of sand inside the world canvas. Reads the real
 * <h1 id="hero-name"> for layout (so it matches the DOM exactly at every breakpoint),
 * then flags <html data-sand="on"> so CSS hides the DOM glyphs — the h1 stays in the
 * document for screen readers and search. Re-samples on resize without replaying the
 * intro. Never mounted under reduced motion: the plain DOM name shows instead.
 */
export default function SandName({ lowPower }: { lowPower: boolean }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const bornAt = useRef(0);
  const stir = useRef(0);
  const last = useRef({ x: -9999, y: -9999 });
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const uniforms = useMemo(
    () => ({
      uView: { value: new THREE.Vector2(1, 1) },
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uStir: { value: 0 },
      uBlow: { value: 0 },
      uDpr: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const build = async () => {
      await document.fonts.ready;
      const h1 = document.getElementById(HERO_NAME_ID);
      if (!h1 || cancelled) return;
      const targets = sampleHeroName(h1, lowPower ? 2.7 : 2.2);
      if (!targets || cancelled) return;

      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(targets.count * 3), 3));
      g.setAttribute("aTarget", new THREE.BufferAttribute(targets.positions, 2));
      const rand = new Float32Array(targets.count * 4);
      for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
      g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));

      if (!bornAt.current) bornAt.current = performance.now();
      setGeometry((prev) => {
        prev?.dispose();
        return g;
      });
      document.documentElement.dataset.sand = "on";
    };
    void build();
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      delete document.documentElement.dataset.sand;
    };
  }, [lowPower]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  useFrame((_, delta) => {
    const m = material.current;
    if (!m || !geometry) return;
    const u = m.uniforms as typeof uniforms;
    const dt = Math.min(delta, 0.1);
    const vh = size.height;

    u.uView.value.set(size.width, size.height);
    u.uScroll.value = window.scrollY;
    u.uTime.value = (performance.now() - bornAt.current) / 1000;
    u.uDpr.value = dpr;

    // stir: a gentle part just from hovering, more the faster you move; slow to settle
    const p = worldPointer;
    const speed = p.active ? Math.hypot(p.px - last.current.x, p.py - last.current.y) / Math.max(dt, 1 / 120) : 0;
    last.current.x = p.px;
    last.current.y = p.py;
    const want = p.active ? Math.min(0.35 + speed / 1800, 1) : 0;
    const rate = want > stir.current ? 8 : 1.1;
    stir.current += (want - stir.current) * (1 - Math.exp(-dt * rate));
    u.uStir.value = stir.current;
    u.uMouse.value.set(p.active ? p.px : -9999, p.active ? p.py : -9999);

    const blow = Math.min(Math.max((window.scrollY - vh * 0.08) / (vh * 1.0), 0), 1);
    u.uBlow.value = blow;
    if (points.current) points.current.visible = blow < 0.999;
  });

  if (!geometry) return null;
  return (
    <points ref={points} geometry={geometry} frustumCulled={false} renderOrder={1}>
      <shaderMaterial
        ref={material}
        vertexShader={sandVertexShader}
        fragmentShader={sandFragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </points>
  );
}
