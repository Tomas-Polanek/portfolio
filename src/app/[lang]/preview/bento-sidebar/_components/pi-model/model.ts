import * as THREE from "three";

/*
 * Procedural wireframe model of the homelab build, 1 unit = 1 mm, Y up.
 *
 * Plan coordinates follow the SVG sketch (`pi5-sketch.tsx`): looking down on the Pi with the
 * GPIO header on the far long edge (y ≈ 0), USB/Ethernet on the right short edge (x ≈ 85),
 * USB-C/micro-HDMI on the near long edge (y ≈ 56). `h` is the height above the Pi's PCB bottom.
 *
 * Sources: Raspberry Pi 5 mechanical drawing (85 × 56 × 1.6, 58 × 49 hole grid inset 3.5);
 * Geekworm wiki X1001 dimension drawing + DXF (87 × 56 L-shaped board, three M2.5 holes on the
 * Pi grid, M.2 strip 30.5 mm from the GPIO-free edge, 3× M2.5 × 17 mm spacers, 30 mm FFC);
 * M.2 2280 spec (80 × 22). Connector heights and the Active Cooler shape are approximations.
 */

const OX = 42.5;
const OZ = 28;

/** Pi PCB top / HAT PCB bottom + top (17 mm spacers from the wiki packing list). */
export const PI_TOP = 1.6;
const SPACER = 17;
const HAT_BOTTOM = PI_TOP + SPACER;
export const HAT_TOP = HAT_BOTTOM + 1.6;
const SSD_BOTTOM = HAT_TOP + 2.2;
const SSD_TOP = SSD_BOTTOM + 0.8;

/** Vertical offsets of each layer in the fully exploded state. */
export const LIFT = { pi: 0, cooler: 9, standoffs: 13, hat: 25, ssd: 36 } as const;
export type LayerId = keyof typeof LIFT;

/** FFC: Pi PCIe connector → X1001 FFC connector, both centred on this plan y. */
export const FFC = { y: 26.5, width: 9 } as const;

const PI_HOLES = [
  [3.5, 3.5],
  [61.5, 3.5],
  [3.5, 52.5],
  [61.5, 52.5],
] as const;
/** The X1001 only uses three of them (no hole near the GPIO end). */
const HAT_HOLES = [PI_HOLES[0], PI_HOLES[2], PI_HOLES[3]] as const;

const v3 = (x: number, y: number, h: number) => new THREE.Vector3(x - OX, h, y - OZ);
const v2 = (x: number, y: number) => new THREE.Vector2(x - OX, OZ - y);

function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 10) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
}

function shapeFrom(points: readonly (readonly [number, number])[]) {
  return new THREE.Shape(points.map(([x, y]) => v2(x, y)));
}

function roundRect(x: number, y: number, w: number, d: number, r: number) {
  const q = Math.PI / 2;
  return shapeFrom([
    ...arc(x + w - r, y + r, r, -q, 0, 4),
    ...arc(x + w - r, y + d - r, r, 0, q, 4),
    ...arc(x + r, y + d - r, r, q, 2 * q, 4),
    ...arc(x + r, y + r, r, 2 * q, 3 * q, 4),
  ]);
}

function circlePath(cx: number, cy: number, r: number, n = 20) {
  return new THREE.Path(arc(cx, cy, r, 0, Math.PI * 2, n).map(([x, y]) => v2(x, y)));
}

/** Collects one rigid part: solids (edges + occluder) and line-only details. */
class Part {
  private solids: THREE.BufferGeometry[] = [];
  private linePos: number[] = [];
  private lineAccent: number[] = [];

  solid(g: THREE.BufferGeometry, accent = false) {
    const edges = new THREE.EdgesGeometry(g, 20);
    this.pushLines(edges.getAttribute("position").array, accent);
    edges.dispose();
    this.solids.push(g);
  }

  box(x: number, y: number, w: number, d: number, h: number, ht: number) {
    const g = new THREE.BoxGeometry(w, ht, d);
    g.translate(x + w / 2 - OX, h + ht / 2, y + d / 2 - OZ);
    this.solid(g);
  }

  cyl(cx: number, cy: number, r: number, h: number, ht: number, seg = 24, open = false) {
    const g = new THREE.CylinderGeometry(r, r, ht, seg, 1, open);
    g.translate(cx - OX, h + ht / 2, cy - OZ);
    this.solid(g);
  }

  slab(shape: THREE.Shape, h: number, ht: number, accent = false) {
    const g = new THREE.ExtrudeGeometry(shape, { depth: ht, bevelEnabled: false, curveSegments: 6 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, h, 0);
    this.solid(g, accent);
  }

  /** Line-only segment pairs in plan coordinates. */
  lines(segments: [number, number, number, number, number, number][], accent = false) {
    const out: number[] = [];
    for (const [x0, y0, h0, x1, y1, h1] of segments) {
      out.push(x0 - OX, h0, y0 - OZ, x1 - OX, h1, y1 - OZ);
    }
    this.pushLines(out, accent);
  }

  rectLines(x: number, y: number, w: number, d: number, h: number, accent = false) {
    this.lines(
      [
        [x, y, h, x + w, y, h],
        [x + w, y, h, x + w, y + d, h],
        [x + w, y + d, h, x, y + d, h],
        [x, y + d, h, x, y, h],
      ],
      accent,
    );
  }

  /** Rectangle drawn on a vertical face facing +x (port openings on the short edge). */
  faceRectX(x: number, y: number, d: number, h: number, ht: number) {
    this.lines([
      [x, y, h, x, y + d, h],
      [x, y + d, h, x, y + d, h + ht],
      [x, y + d, h + ht, x, y, h + ht],
      [x, y, h + ht, x, y, h],
    ]);
  }

  private pushLines(src: ArrayLike<number>, accent: boolean) {
    for (let i = 0; i < src.length; i++) this.linePos.push(src[i]);
    for (let i = 0; i < src.length / 3; i++) this.lineAccent.push(accent ? 1 : 0);
  }

  build(): PartGeometry {
    const parts = this.solids.map((g) => (g.index ? g.toNonIndexed() : g));
    const size = parts.reduce((n, g) => n + g.getAttribute("position").count * 3, 0);
    const occ = new Float32Array(size);
    let offset = 0;
    for (const g of parts) {
      const arr = g.getAttribute("position").array as Float32Array;
      occ.set(arr, offset);
      offset += arr.length;
    }
    for (const g of new Set([...this.solids, ...parts])) g.dispose();

    const occluder = new THREE.BufferGeometry();
    occluder.setAttribute("position", new THREE.BufferAttribute(occ, 3));
    occluder.computeBoundingBox();

    const edges = new THREE.BufferGeometry();
    const pos = new Float32Array(this.linePos);
    edges.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    edges.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pos.length), 3));
    return { occluder, edges, accent: Uint8Array.from(this.lineAccent) };
  }
}

export type PartGeometry = {
  occluder: THREE.BufferGeometry;
  /** Line segments with a `color` attribute painted by `paintEdges`. */
  edges: THREE.BufferGeometry;
  accent: Uint8Array;
};

function piBoard(): PartGeometry {
  const p = new Part();
  const pcb = roundRect(0, 0, 85, 56, 3);
  pcb.holes.push(...PI_HOLES.map(([x, y]) => circlePath(x, y, 1.35)));
  p.slab(pcb, 0, PI_TOP);

  const t = PI_TOP;
  // 40-pin GPIO header (2 × 20, 2.54 mm pitch): plastic shroud + pins.
  p.box(7, 1.2, 50.8, 5.1, t, 2.5);
  const pins: [number, number, number, number, number, number][] = [];
  for (let i = 0; i < 40; i++) {
    const x = 8.27 + Math.floor(i / 2) * 2.54;
    const y = 2.47 + (i % 2) * 2.54;
    pins.push([x, y, t + 2.5, x, y, t + 8.5]);
  }
  p.lines(pins);

  // Fan header, BCM2712 SoC (+ heat spreader), LPDDR4X, RP1.
  p.box(58.6, 7.4, 6, 2.2, t, 2.8);
  p.box(23, 18, 17, 17, t, 1.2);
  p.rectLines(25.2, 20.2, 12.6, 12.6, t + 1.21);
  p.box(43, 19.5, 10, 13.5, t, 1);
  p.box(56, 24, 7.5, 7.5, t, 0.9);

  // 2× stacked USB-A + Gigabit Ethernet, overhanging the short edge by ~2.5 mm.
  for (const y of [2.5, 19]) {
    p.box(66.5, y, 21, 13.2, t, 16);
    p.faceRectX(87.5, y + 1.6, 10, t + 2.2, 5.4);
    p.faceRectX(87.5, y + 1.6, 10, t + 9.4, 5.4);
  }
  p.box(66.5, 36.5, 21, 16, t, 13.5);
  p.faceRectX(87.5, 38.3, 12.4, t + 1.6, 9.6);
  p.faceRectX(87.5, 42.3, 4.4, t + 11.2, 1.6);

  // USB-C power, 2× micro-HDMI, 2× MIPI FPC on the near long edge.
  p.box(6.7, 50.6, 9, 6.4, t, 3.2);
  for (const x of [21.5, 34.5]) p.box(x, 51, 7, 6, t, 3);
  for (const x of [46.5, 52]) p.box(x, 41.5, 3.4, 11, t, 1.6);

  // PCIe FPC connector (16-pin, 0.5 mm pitch) and the power button on the left short edge.
  p.box(0.8, FFC.y - 7, 3.6, 14, t, 1.8);
  p.box(-0.8, 40, 3.6, 3.6, t, 1.8);
  p.cyl(1, 41.8, 1, t + 1.8, 0.6, 12);
  return p.build();
}

/** Official Active Cooler: heatsink plate + fins, blower shroud (the impeller is separate). */
function activeCooler(): PartGeometry {
  const p = new Part();
  const base = PI_TOP + 1.4;
  p.box(17, 12, 46, 34, base, 1.6);
  const top = base + 1.6;
  for (let i = 0; i < 8; i++) p.box(18.4 + i * 2.5, 13, 0.8, 32, top, 6.6);
  const shroud = roundRect(38.5, 13, 24, 32, 2);
  shroud.holes.push(circlePath(50.5, 29, 10, 28));
  p.slab(shroud, top + 6, 1);
  p.cyl(50.5, 29, 10.6, top, 6, 28, true);
  // Spring push-pins.
  for (const [x, y] of [
    [19.5, 14.5],
    [60.5, 43.5],
  ] as const) {
    p.cyl(x, y, 1.6, top, 1.4, 10);
  }
  return p.build();
}

/** Blower impeller, built around its own axis so it can spin. */
export const FAN_AXIS = v3(50.5, 29, 0);
function impeller(): PartGeometry {
  const p = new Part();
  const h = PI_TOP + 3.2;
  const hub = new THREE.CylinderGeometry(3.6, 3.6, 5.6, 18);
  hub.translate(0, h + 2.8, 0);
  p.solid(hub);
  const blades = 11;
  for (let i = 0; i < blades; i++) {
    const g = new THREE.BoxGeometry(5.2, 4.8, 0.5);
    g.translate(6.6, h + 2.6, 0);
    g.rotateY((i / blades) * Math.PI * 2);
    p.solid(g);
  }
  return p.build();
}

function standoffs(): PartGeometry {
  const p = new Part();
  // M2.5 × 17 mm hex F/F spacers (5 mm across flats).
  for (const [x, y] of HAT_HOLES) p.cyl(x, y, 2.88, PI_TOP, SPACER, 6);
  return p.build();
}

function x1001(): PartGeometry {
  const p = new Part();
  const pi = Math.PI;
  // L-shaped outline from the Geekworm drawing: M.2 strip on the HDMI side, ear to the left
  // GPIO corner, notched so the 40-pin header stays free.
  const outline = shapeFrom([
    ...arc(3.5, 3.5, 3.5, pi, 2 * pi, 8),
    [7, 8],
    [28.5, 8],
    [28.5, 25.5],
    [87, 25.5],
    [87, 49],
    [65, 49],
    ...arc(61.5, 52.5, 3.5, 0, pi, 8),
    [58, 49],
    [7, 49],
    ...arc(3.5, 52.5, 3.5, 0, pi, 8),
  ]);
  outline.holes.push(...HAT_HOLES.map(([x, y]) => circlePath(x, y, 1.35, 14)));
  p.slab(outline, HAT_BOTTOM, 1.6);

  const t = HAT_TOP;
  // M.2 M-key socket, SSD standoff (2280 position) + 2260/2242/2230 silkscreen marks.
  p.box(82, 26.25, 5, 22, t, 4.2);
  p.lines([[82, 28, t + 1.4, 82, 46.5, t + 1.4]]);
  p.cyl(3.6, 37.25, 2.4, t, 2.2, 6);
  p.lines([22.7, 40.9, 52.9].map((x) => [x, 26, t + 0.02, x, 47, t + 0.02]));
  for (const x of [22.7, 40.9, 52.9]) p.rectLines(x - 1.4, 39.5, 2.8, 2.8, t + 0.02);

  // FFC connector, buck inductor, XH2.54 2-pin 5 V input, ACT LED.
  p.box(9.5, FFC.y - 6.5, 4, 13, t, 1.9);
  p.box(10, 9, 5.6, 5, t, 2.8);
  p.box(18.5, 8.8, 7.5, 5.8, t, 6);
  p.rectLines(19.4, 9.7, 5.7, 4, t + 6.01);
  p.box(4.2, 14, 1.6, 0.8, t, 0.6);

  // M2.5 screw heads.
  for (const [x, y] of HAT_HOLES) p.cyl(x, y, 2.25, t, 1.5, 14);
  return p.build();
}

/** Samsung 990 PRO 1 TB (M.2 2280, single sided) incl. its M2 fixing screw. */
function ssd(): PartGeometry {
  const p = new Part();
  const y0 = 26.25;
  const y1 = y0 + 22;
  const q = Math.PI / 2;
  const pcb = shapeFrom([
    [3.6, y0],
    [83.6, y0],
    [83.6, 41.9],
    [80.1, 41.9],
    [80.1, 43.1],
    [83.6, 43.1],
    [83.6, y1],
    [3.6, y1],
    ...arc(3.6, 37.25, 1.75, q, -q, 8),
  ]);
  p.slab(pcb, SSD_BOTTOM, 0.8);
  const t = SSD_TOP;
  // Controller, LPDDR4 cache, 2× V-NAND packages.
  p.box(65, 31.25, 12, 12, t, 1.2);
  p.box(55.5, 31.75, 7, 11, t, 1);
  p.box(37, 29.75, 15, 15, t, 1.3);
  p.box(19, 29.75, 15, 15, t, 1.3);
  // Gold fingers.
  const fingers: [number, number, number, number, number, number][] = [];
  for (let y = y0 + 0.9; y < y1 - 0.5; y += 1.1) {
    if (y > 41.4 && y < 43.6) continue;
    fingers.push([80.6, y, t + 0.01, 83.3, y, t + 0.01]);
  }
  p.lines(fingers);
  // Label area (subtle accent): outline + a few "text" strokes.
  p.rectLines(6.6, 28, 10.4, 18.5, t + 0.01, true);
  p.lines(
    [
      [8.2, 31, t + 0.01, 15.4, 31, t + 0.01],
      [8.2, 33.4, t + 0.01, 13.6, 33.4, t + 0.01],
      [8.2, 40.6, t + 0.01, 15.4, 40.6, t + 0.01],
      [8.2, 43, t + 0.01, 12, 43, t + 0.01],
    ],
    true,
  );
  p.cyl(3.6, 37.25, 2, t, 1.3, 12);
  return p.build();
}

export function buildParts() {
  return {
    pi: piBoard(),
    cooler: activeCooler(),
    impeller: impeller(),
    standoffs: standoffs(),
    hat: x1001(),
    ssd: ssd(),
  };
}

/** Label anchors (layer-local, collapsed). */
export const ANCHORS: Record<Exclude<LayerId, "standoffs">, THREE.Vector3> = {
  pi: v3(0, 47, PI_TOP),
  cooler: v3(17, 40, PI_TOP + 3),
  hat: v3(0, 44, HAT_TOP),
  ssd: v3(3.6, 46, SSD_TOP),
};

/**
 * FFC path at a given HAT lift (root coordinates): leaves the Pi connector outwards, loops
 * round the board edge and enters the X1001 connector from the left.
 */
export function ffcPoints(hatLift: number): THREE.Vector3[] {
  const c = PI_TOP + 1;
  const top = HAT_TOP + hatLift + 1.1;
  const mid = (c + top) / 2;
  const span = top - c;
  const pts: [number, number][] = [
    [3.6, c],
    [0.6, c],
    [-3.4, c + Math.min(2.4, span * 0.12)],
    [-5.4, mid],
    [-3.4, top - Math.min(2.6, span * 0.12)],
    [-0.4, top],
    [4, top - 0.1],
    [11.2, top - 0.3],
  ];
  return pts.map(([x, h]) => v3(x, FFC.y, h));
}

const tmp = new THREE.Color();
/** Gradient factor along the build: left/bottom → right/top. */
export function gradientT(x: number, y: number) {
  return Math.min(1, Math.max(0, ((x + 46) / 92) * 0.75 + (y / 26) * 0.25));
}

export type Palette = { a: THREE.Color; b: THREE.Color; accent: THREE.Color };

export function paintEdges(g: THREE.BufferGeometry, accent: Uint8Array | null, pal: Palette) {
  const pos = g.getAttribute("position");
  const col = g.getAttribute("color") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    tmp.lerpColors(pal.a, pal.b, gradientT(pos.getX(i), pos.getY(i)));
    if (accent?.[i]) tmp.lerp(pal.accent, 0.55);
    col.setXYZ(i, tmp.r, tmp.g, tmp.b);
  }
  col.needsUpdate = true;
}
