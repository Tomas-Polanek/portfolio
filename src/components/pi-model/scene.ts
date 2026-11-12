import * as THREE from "three";
import { REDUCED_MOTION_QUERY } from "@/lib/media";
import {
  FAN_AXIS,
  FFC,
  LIFT,
  type LayerId,
  type Palette,
  type PartGeometry,
  buildParts,
  ffcPoints,
  gradientT,
  paintEdges,
} from "./model";

export type PiSceneOptions = {
  host: HTMLElement;
  open: boolean;
  onReady: () => void;
  /** Slow sway and spinning fan, rendered continuously while visible (default true). */
  ambient?: boolean;
  /** Extra yaw (rad) reached at setScroll(…, 1); the scale fits the whole range (default 0). */
  turn?: number;
};

export type PiScene = {
  setOpen: (open: boolean) => void;
  /** Scroll-driven pose: explode amount 0–1 (the hover state wins if larger) and turn fraction 0–1. */
  setScroll: (explode: number, turn?: number) => void;
  dispose: () => void;
};

const PALETTES = {
  dark: { a: "#a050ff", b: "#50b4ff", accent: "#ffffff" },
  light: { a: "#8434f0", b: "#1f86d6", accent: "#09090b" },
} as const;

const DURATION = 600;
const BASE_YAW = 0.12;
const SWAY = 0.2;
const SWAY_PERIOD = 14000;
const CAMERA_DIR = new THREE.Vector3(-0.5, 0.62, 1).normalize();
const PAD = 6;
const FFC_SAMPLES = 40;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function createPiScene({ host, open, onReady, ambient = true, turn = 0 }: PiSceneOptions): PiScene {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 600);
  camera.position.copy(CAMERA_DIR).multiplyScalar(300);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const occluderMat = new THREE.MeshBasicMaterial({
    colorWrite: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true });

  const root = new THREE.Group();
  scene.add(root);

  const painted: { geometry: THREE.BufferGeometry; accent: Uint8Array }[] = [];
  function addPart(parent: THREE.Object3D, part: PartGeometry) {
    const occluder = new THREE.Mesh(part.occluder, occluderMat);
    const edges = new THREE.LineSegments(part.edges, lineMat);
    edges.renderOrder = 1;
    parent.add(occluder, edges);
    painted.push({ geometry: part.edges, accent: part.accent });
  }

  const parts = buildParts();
  const layers = {} as Record<LayerId, THREE.Group>;
  const bounds: { layer: LayerId; box: THREE.Box3 }[] = [];
  for (const id of Object.keys(LIFT) as LayerId[]) {
    const group = new THREE.Group();
    addPart(group, parts[id]);
    root.add(group);
    layers[id] = group;
    bounds.push({ layer: id, box: parts[id].occluder.boundingBox!.clone() });
  }
  const fan = new THREE.Group();
  fan.position.copy(FAN_AXIS);
  addPart(fan, parts.impeller);
  layers.cooler.add(fan);

  // PCIe FFC: a flat strip re-shaped every frame from the Pi to the (lifted) HAT connector.
  const ribbonPos = new Float32Array(FFC_SAMPLES * 2 * 3);
  const ribbonIdx: number[] = [];
  for (let i = 0; i < FFC_SAMPLES - 1; i++) {
    const a = i * 2;
    ribbonIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute("position", new THREE.BufferAttribute(ribbonPos, 3));
  ribbonGeo.setIndex(ribbonIdx);
  // Two rails + 2 end lines + 2 stiffener lines.
  const ribbonSegs = 2 * (FFC_SAMPLES - 1) + 4;
  const ribbonLinePos = new Float32Array(ribbonSegs * 2 * 3);
  const ribbonLineGeo = new THREE.BufferGeometry();
  ribbonLineGeo.setAttribute("position", new THREE.BufferAttribute(ribbonLinePos, 3));
  ribbonLineGeo.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(ribbonLinePos.length), 3),
  );
  const ribbonMesh = new THREE.Mesh(ribbonGeo, occluderMat);
  const ribbonLines = new THREE.LineSegments(ribbonLineGeo, lineMat);
  ribbonLines.renderOrder = 1;
  ribbonMesh.frustumCulled = false;
  ribbonLines.frustumCulled = false;
  root.add(ribbonMesh, ribbonLines);

  const palette: Palette = { a: new THREE.Color(), b: new THREE.Color(), accent: new THREE.Color() };
  const half = FFC.width / 2;

  function updateRibbon(hatLift: number) {
    const curve = new THREE.CatmullRomCurve3(ffcPoints(hatLift), false, "centripetal");
    const pts = curve.getSpacedPoints(FFC_SAMPLES - 1);
    for (let i = 0; i < FFC_SAMPLES; i++) {
      const p = pts[i];
      ribbonPos.set([p.x, p.y, p.z - half, p.x, p.y, p.z + half], i * 6);
    }
    let o = 0;
    const seg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
      ribbonLinePos.set([ax, ay, az, bx, by, bz], o);
      o += 6;
    };
    for (let i = 0; i < FFC_SAMPLES - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      seg(p.x, p.y, p.z - half, q.x, q.y, q.z - half);
      seg(p.x, p.y, p.z + half, q.x, q.y, q.z + half);
    }
    const len = curve.getLength();
    for (const u of [0, 3.5 / len, 1 - 3.5 / len, 1]) {
      const p = curve.getPointAt(u);
      seg(p.x, p.y + 0.02, p.z - half, p.x, p.y + 0.02, p.z + half);
    }
    ribbonGeo.getAttribute("position").needsUpdate = true;
    ribbonLineGeo.getAttribute("position").needsUpdate = true;
    paintRibbon();
  }

  const tmpColor = new THREE.Color();
  function paintRibbon() {
    const col = ribbonLineGeo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < ribbonLinePos.length / 3; i++) {
      const t = gradientT(ribbonLinePos[i * 3], Math.min(ribbonLinePos[i * 3 + 1], 24));
      tmpColor.lerpColors(palette.a, palette.b, t);
      col.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
    }
    col.needsUpdate = true;
  }

  function applyTheme() {
    const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const p = PALETTES[theme];
    palette.a.set(p.a);
    palette.b.set(p.b);
    palette.accent.set(p.accent);
    for (const { geometry, accent } of painted) paintEdges(geometry, accent, palette);
    paintRibbon();
  }

  // --- state ---------------------------------------------------------------------------------
  const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let reduced = reducedQuery.matches;
  let target = open ? 1 : 0;
  let progress = target;
  let tween: { from: number; start: number; duration: number } | null = null;
  let visible = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let ribbonAt = Number.NaN;
  let ready = false;
  let width = 0;
  let height = 0;
  let scrollExplode = 0;
  let turnAt = 0;
  /** Model scale in px per mm: fixed so the build keeps one size whether collapsed or exploded. */
  let scale = 1;
  let yaws: number[] = [];

  const corner = new THREE.Vector3();
  const yawMatrix = new THREE.Matrix4();
  const extent = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  /** Every yaw the build reaches (sway around the base, plus the scroll turn), sampled. */
  function yawSamples() {
    const sway = reduced || !ambient ? 0 : SWAY;
    const from = BASE_YAW - sway;
    const to = BASE_YAW + turn + sway;
    return from === to ? [from] : Array.from({ length: 5 }, (_, i) => from + ((to - from) * i) / 4);
  }

  /** Screen-space bounds of the build at explode amount `e`, over every reachable yaw. */
  function measureExtent(e: number) {
    extent.minX = extent.minY = Infinity;
    extent.maxX = extent.maxY = -Infinity;
    for (const y of yaws) {
      yawMatrix.makeRotationY(y);
      for (const { layer, box } of bounds) {
        const lift = LIFT[layer] * e;
        for (let i = 0; i < 8; i++) {
          corner
            .set(
              i & 1 ? box.max.x : box.min.x,
              (i & 2 ? box.max.y : box.min.y) + lift,
              i & 4 ? box.max.z : box.min.z,
            )
            .applyMatrix4(yawMatrix)
            .applyMatrix4(camera.matrixWorldInverse);
          extent.minX = Math.min(extent.minX, corner.x);
          extent.maxX = Math.max(extent.maxX, corner.x);
          extent.minY = Math.min(extent.minY, corner.y);
          extent.maxY = Math.max(extent.maxY, corner.y);
        }
      }
    }
    return extent;
  }

  function fitScale(e: number) {
    const { minX, maxX, minY, maxY } = measureExtent(e);
    const availW = Math.max(1, width - 2 * PAD);
    const availH = Math.max(1, height - 2 * PAD);
    return Math.min(availW / (maxX - minX), availH / (maxY - minY));
  }

  function measure() {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    yaws = yawSamples();
    // The exploded build is taller, so it sets the scale for both states.
    scale = Math.min(fitScale(0), fitScale(1));
  }

  /** Same scale throughout; only the centre follows the build so it stays centred as it opens. */
  function fitCamera(e: number) {
    const { minX, maxX, minY, maxY } = measureExtent(e);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    camera.left = cx - width / 2 / scale;
    camera.right = cx + width / 2 / scale;
    camera.top = cy + height / 2 / scale;
    camera.bottom = cy - height / 2 / scale;
    camera.updateProjectionMatrix();
  }

  function update(dt: number, now: number) {
    if (tween) {
      const p = Math.min(1, (now - tween.start) / tween.duration);
      progress = tween.from + (target - tween.from) * p;
      if (p >= 1) tween = null;
    }
    // Ease relative to the full 0→1 range so a reversed tween continues smoothly.
    const e = Math.max(easeInOutCubic(progress), scrollExplode);
    const animate = ambient && !reduced;
    if (animate) {
      clock += dt;
      fan.rotation.y -= dt * 0.0035;
    }
    const sway = animate ? SWAY * Math.sin((clock / SWAY_PERIOD) * Math.PI * 2) : 0;
    root.rotation.y = BASE_YAW + turn * turnAt + sway;
    for (const id of Object.keys(LIFT) as LayerId[]) layers[id].position.y = LIFT[id] * e;
    if (e !== ribbonAt) {
      updateRibbon(LIFT.hat * e);
      ribbonAt = e;
    }
    root.updateMatrixWorld(true);
    fitCamera(e);
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(now - last, 50) : 0;
    last = now;
    update(dt, now);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady();
    }
    if (visible && !document.hidden && ((ambient && !reduced) || tween)) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (raf || !visible || document.hidden || width === 0) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  // --- observers -----------------------------------------------------------------------------
  const resizeObserver = new ResizeObserver(() => {
    measure();
    kick();
  });
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    kick();
  });
  intersectionObserver.observe(host);

  const themeObserver = new MutationObserver(() => {
    applyTheme();
    kick();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const onVisibility = () => kick();
  document.addEventListener("visibilitychange", onVisibility);

  const onReducedChange = () => {
    reduced = reducedQuery.matches;
    if (reduced && tween) {
      progress = target;
      tween = null;
    }
    measure();
    kick();
  };
  reducedQuery.addEventListener("change", onReducedChange);

  applyTheme();
  measure();

  return {
    setOpen(next) {
      const to = next ? 1 : 0;
      if (to === target && !tween) return;
      target = to;
      if (reduced) {
        progress = to;
        tween = null;
      } else {
        tween = {
          from: progress,
          start: performance.now(),
          duration: Math.max(1, DURATION * Math.abs(to - progress)),
        };
      }
      kick();
    },
    setScroll(explode, turnFraction = 0) {
      const e = Math.min(1, Math.max(0, explode));
      const t = Math.min(1, Math.max(0, turnFraction));
      if (e === scrollExplode && t === turnAt) return;
      scrollExplode = e;
      turnAt = t;
      kick();
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) obj.geometry.dispose();
      });
      occluderMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
