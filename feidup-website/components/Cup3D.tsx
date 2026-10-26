"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { MotionValue } from "framer-motion";

/* ────────────────────────────────────────────────────────────────
   Cup3D — procedural 3D co-branded takeaway cup in the approved
   "Puzzle Coffee" mockup style: charcoal wall with the cafe lockup
   printed in cream Fredoka, red puzzle-piece mark, and the local
   partner as a red gradient panel with QR. Black stepped lid.
   Starts as a red blueprint wireframe and materialises on scroll.
   ──────────────────────────────────────────────────────────────── */

const ACCENT = "#ef4444";
const ACCENT_DEEP = "#b91c1c";
const CHAR = "#191919";
const CREAM = "#f4f1e9";
const LID = "#1b1b1e";

function cupFonts() {
  if (typeof window === "undefined") return { display: "sans-serif", sans: "sans-serif" };
  const css = getComputedStyle(document.documentElement);
  const display = css.getPropertyValue("--font-fredoka").trim() || "'Arial Rounded MT Bold', sans-serif";
  const sans = css.getPropertyValue("--font-inter").trim() || "'Helvetica Neue', sans-serif";
  return { display, sans };
}

/* plausible QR on a white rounded plate (not a real code) */
function drawQR(ctx: CanvasRenderingContext2D, qx: number, qy: number, s: number, seed: number) {
  const n = 25;
  const pad = s * 0.09;
  const cell = (s - pad * 2) / n;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(qx, qy, s, s, s * 0.1);
  ctx.fill();
  let sd = seed;
  const rnd = () => {
    sd = (sd * 9301 + 49297) % 233280;
    return sd / 233280;
  };
  const ox = qx + pad;
  const oy = qy + pad;
  const finder = (fx: number, fy: number) => {
    ctx.fillStyle = "#111";
    ctx.fillRect(fx, fy, cell * 7, cell * 7);
    ctx.fillStyle = "#fff";
    ctx.fillRect(fx + cell, fy + cell, cell * 5, cell * 5);
    ctx.fillStyle = "#111";
    ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3);
  };
  ctx.fillStyle = "#111";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const inF = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
      if (inF) continue;
      if (rnd() > 0.52) ctx.fillRect(ox + i * cell, oy + j * cell, cell * 0.94, cell * 0.94);
    }
  }
  finder(ox, oy);
  finder(ox + cell * (n - 7), oy);
  finder(ox, oy + cell * (n - 7));
}

/* puzzle-piece brand mark (tab on top, blank on right) */
function drawPuzzle(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const r = s * 0.22;
  const b = s * 0.5;
  ctx.beginPath();
  ctx.moveTo(-b + r, -b);
  ctx.lineTo(-s * 0.14, -b);
  ctx.arc(0, -b, s * 0.14, Math.PI, 0, false);
  ctx.lineTo(b - r, -b);
  ctx.arcTo(b, -b, b, -b + r, r);
  ctx.lineTo(b, -s * 0.14);
  ctx.arc(b, 0, s * 0.14, -Math.PI / 2, Math.PI / 2, true);
  ctx.lineTo(b, b - r);
  ctx.arcTo(b, b, b - r, b, r);
  ctx.lineTo(-b + r, b);
  ctx.arcTo(-b, b, -b, b - r, r);
  ctx.lineTo(-b, -b + r);
  ctx.arcTo(-b, -b, -b + r, -b, r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* Charcoal cup wall: cafe lockup up top, red local-partner panel below */
function makeBodyTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  const { display, sans } = cupFonts();
  const cx = 1024;

  ctx.fillStyle = CHAR;
  ctx.fillRect(0, 0, 2048, 1024);
  const shade = ctx.createLinearGradient(0, 0, 2048, 0);
  shade.addColorStop(0, "rgba(0,0,0,0.16)");
  shade.addColorStop(0.5, "rgba(255,255,255,0.025)");
  shade.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 2048, 1024);

  // faint watermark puzzle pieces on the sides (seen during the intro spin)
  ctx.globalAlpha = 0.05;
  drawPuzzle(ctx, 300, 470, 430, CREAM);
  drawPuzzle(ctx, 1780, 470, 430, CREAM);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(244,241,233,0.35)";
  ctx.font = `600 30px ${sans}`;
  ctx.textAlign = "center";
  ctx.fillText("B R E W E D   I N   B R I S B A N E", 300, 200);
  ctx.fillText("F E I D U P   P A R T N E R   C U P", 1780, 200);

  // cafe lockup
  drawPuzzle(ctx, cx, 148, 118, ACCENT);
  ctx.fillStyle = CREAM;
  ctx.font = `700 118px ${display}`;
  ctx.fillText("PUZZLE", cx, 330);
  ctx.fillText("COFFEE", cx, 442);
  ctx.fillStyle = "rgba(244,241,233,0.62)";
  ctx.font = `600 32px ${sans}`;
  ctx.fillText("P R O U D L Y   L O C A L", cx, 502);

  // local partner panel — red gradient plate
  const pw = 620;
  const ph = 350;
  const py = 552;
  const grad = ctx.createLinearGradient(0, py, 0, py + ph);
  grad.addColorStop(0, ACCENT);
  grad.addColorStop(1, ACCENT_DEEP);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, py, pw, ph, 30);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `600 26px ${sans}`;
  ctx.fillText("L O C A L   P A R T N E R", cx, py + 58);
  ctx.fillStyle = "#fff";
  ctx.font = `700 74px ${display}`;
  ctx.fillText("BAYSIDE DENTAL", cx, py + 142);
  ctx.font = `400 30px ${sans}`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText("New patients welcome", cx, py + 188);
  drawQR(ctx, cx - 200, py + 212, 118, 4242);
  ctx.fillStyle = "#fff";
  ctx.font = `700 32px ${sans}`;
  ctx.textAlign = "left";
  ctx.fillText("BOOK ONLINE  →", cx - 58, py + 282);
  ctx.textAlign = "center";

  // glue seam hint
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(0, 0, 4, 1024);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(4, 0, 2, 1024);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Soft radial contact shadow */
function makeShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 125);
  g.addColorStop(0, "rgba(0,0,0,0.42)");
  g.addColorStop(0.55, "rgba(0,0,0,0.16)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* Studio reflections without drei */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Classic black stepped lid: skirt → flat brim ring → raised plateau */
function lidProfile(): THREE.Vector2[] {
  const pts: [number, number][] = [
    [0.87, -0.10],
    [0.965, -0.10],
    [0.99, -0.03],
    [0.985, 0.03],
    [0.94, 0.055],
    [0.72, 0.06],
    [0.70, 0.075],
    [0.675, 0.20],
    [0.60, 0.235],
    [0.34, 0.25],
    [0.14, 0.255],
    [0.0, 0.26],
  ];
  return pts.map(([x, y]) => new THREE.Vector2(x, y));
}

function Cup({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const solidMats = useRef<(THREE.Material | null)[]>([]);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const wireLidMat = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);

  const bodyTexture = useMemo(makeBodyTexture, []);
  const shadowTexture = useMemo(makeShadowTexture, []);
  const lidPoints = useMemo(lidProfile, []);

  const setMat = (i: number) => (m: THREE.Material | null) => {
    solidMats.current[i] = m;
  };

  // rebake the wall print once webfonts are ready (Fredoka arrives late)
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      const wall = solidMats.current[0] as THREE.MeshStandardMaterial | null;
      if (!wall) return;
      const fresh = makeBodyTexture();
      const old = wall.map;
      wall.map = fresh;
      wall.needsUpdate = true;
      if (old && old !== fresh) old.dispose();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useFrame((state) => {
    const p = progress.get();
    const t = state.clock.elapsedTime;

    if (group.current) {
      // π offset puts the texture front (u=0.5) toward the camera.
      const spin = p < 0.16 ? (1 - p / 0.16) * Math.PI * 2 : 0;
      group.current.rotation.y = Math.PI + spin + Math.sin(t * 0.55) * 0.16;
      group.current.rotation.x = -0.03 + Math.sin(t * 0.4) * 0.02;
      group.current.position.y = Math.sin(t * 0.8) * 0.035;
    }

    const solid = THREE.MathUtils.clamp((p - 0.03) / 0.12, 0, 1);
    for (const m of solidMats.current) {
      if (m) (m as THREE.MeshStandardMaterial).opacity = solid;
    }
    if (wireMat.current) wireMat.current.opacity = Math.max(0, 0.9 - solid * 0.9);
    if (wireLidMat.current) wireLidMat.current.opacity = Math.max(0, 0.5 - solid * 0.5);
    if (shadowMat.current) shadowMat.current.opacity = solid * 0.85;
  });

  return (
    <>
      <group ref={group}>
        {/* cup wall — 12oz taper, charcoal print */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.62, 2.2, 64, 1, true]} />
          <meshStandardMaterial
            ref={setMat(0)}
            map={bodyTexture}
            roughness={0.62}
            envMapIntensity={0.45}
            transparent
          />
        </mesh>
        {/* rolled lip (rotated flat — torus default plane is vertical) */}
        <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.88, 0.03, 20, 64]} />
          <meshStandardMaterial
            ref={setMat(1)}
            color={CREAM}
            roughness={0.45}
            envMapIntensity={0.5}
            transparent
          />
        </mesh>
        {/* base */}
        <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.62, 48]} />
          <meshStandardMaterial ref={setMat(2)} color="#e9e5db" roughness={0.7} transparent side={THREE.DoubleSide} />
        </mesh>

        {/* black stepped lid */}
        <mesh position={[0, 1.12, 0]}>
          <latheGeometry args={[lidPoints, 64]} />
          <meshPhysicalMaterial
            ref={setMat(3)}
            color={LID}
            roughness={0.34}
            clearcoat={0.45}
            clearcoatRoughness={0.28}
            envMapIntensity={1.05}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* sip lug on the plateau — local -z so the π rotation faces it forward */}
        <mesh position={[0, 1.38, -0.44]} scale={[1.5, 0.55, 1]}>
          <sphereGeometry args={[0.12, 32, 24]} />
          <meshPhysicalMaterial
            ref={setMat(4)}
            color="#242428"
            roughness={0.38}
            clearcoat={0.35}
            clearcoatRoughness={0.3}
            envMapIntensity={0.9}
            transparent
          />
        </mesh>

        {/* blueprint wireframe shells */}
        <mesh>
          <cylinderGeometry args={[0.93, 0.65, 2.26, 14, 4, true]} />
          <meshBasicMaterial ref={wireMat} color={ACCENT} wireframe transparent depthWrite={false} />
        </mesh>
        <mesh position={[0, 1.28, 0]}>
          <cylinderGeometry args={[1.0, 0.96, 0.34, 14, 1, true]} />
          <meshBasicMaterial ref={wireLidMat} color={ACCENT} wireframe transparent opacity={0.5} depthWrite={false} />
        </mesh>
      </group>

      {/* contact shadow */}
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial ref={shadowMat} map={shadowTexture} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

export default function Cup3D({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <Env />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3.5, 4, 4.5]} intensity={1.7} color="#fff4e6" />
      <directionalLight position={[-4, 2, -2]} intensity={0.55} color="#dfe8ff" />
      <directionalLight position={[0, 3, -5]} intensity={0.85} />
      <Cup progress={progress} />
    </Canvas>
  );
}
