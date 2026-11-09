"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  ARRIVAL_MOOD,
  computeWorldMood,
  liveMood,
  worldPointer,
  type WorldMood,
} from "@/lib/world";
import { desertFragmentShader, desertVertexShader } from "./desertShader";

/** How quickly the world eases toward the mood scroll asks for (per second). */
const MOOD_EASE = 3.2;
const POINTER_EASE = 2.2;

function DesertPlane({ frozen }: { frozen: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const target = useRef<WorldMood>({ ...ARRIVAL_MOOD });
  const current = useRef<WorldMood>({ ...ARRIVAL_MOOD });
  const bufferSize = useMemo(() => new THREE.Vector2(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 12.0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMaw: { value: 0 },
      uNight: { value: 0 },
      uDusk: { value: 0 },
      uMoons: { value: 0 },
      uFigure: { value: 1 },
      uVeil: { value: 0 },
      uSink: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    computeWorldMood(target.current);
    const k = frozen ? 1 : 1 - Math.exp(-dt * MOOD_EASE);
    const cur = current.current;
    for (const key of Object.keys(cur) as (keyof WorldMood)[]) {
      cur[key] += (target.current[key] - cur[key]) * k;
    }
    Object.assign(liveMood, cur);

    if (!material.current) return;
    const u = material.current.uniforms as typeof uniforms;
    if (!frozen) u.uTime.value += dt;
    state.gl.getDrawingBufferSize(bufferSize);
    u.uRes.value.copy(bufferSize);
    const kp = 1 - Math.exp(-dt * POINTER_EASE);
    u.uMouse.value.x += (worldPointer.x - u.uMouse.value.x) * kp;
    u.uMouse.value.y += (worldPointer.y - u.uMouse.value.y) * kp;
    u.uMaw.value = cur.maw;
    u.uNight.value = cur.night;
    u.uDusk.value = cur.dusk;
    u.uMoons.value = cur.moons;
    u.uFigure.value = cur.figure;
    u.uVeil.value = cur.veil;
    u.uSink.value = cur.sink;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={desertVertexShader}
        fragmentShader={desertFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * The fixed WebGL backdrop. One pointer listener for the whole world (it only steers the
 * wind and a touch of parallax). Rendered `flat` + `linear` so the shader's colours —
 * authored directly in display space — reach the screen untouched by tone mapping.
 */
export default function WorldScene({
  frozen,
  lowPower,
  onReady,
}: {
  frozen: boolean;
  lowPower: boolean;
  onReady: () => void;
}) {
  useEffect(() => {
    if (frozen) return;
    const onMove = (event: PointerEvent) => {
      worldPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      worldPointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [frozen]);

  return (
    <Canvas
      flat
      linear
      dpr={lowPower ? [0.6, 0.85] : [1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      onCreated={onReady}
      style={{ position: "absolute", inset: 0 }}
    >
      <DesertPlane frozen={frozen} />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.25} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
