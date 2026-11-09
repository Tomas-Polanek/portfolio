import { bs } from "@/components/classes";

/*
 * Blueprint-style top view of a Raspberry Pi 5 (85 × 56 mm, 1 unit = 1 mm). Positions are
 * approximate: GPIO along the top long edge, USB 2 / USB 3 / Ethernet on the right short edge,
 * USB-C + 2× micro-HDMI + 2× MIPI on the bottom long edge, PCIe FPC and power button on the left.
 */
const viewBox = "-2 -2 92 62";
const board =
  "M3 0H82A3 3 0 0 1 85 3V53A3 3 0 0 1 82 56H3A3 3 0 0 1 0 53V3A3 3 0 0 1 3 0Z";
const holes = [
  [3.5, 3.5],
  [61.5, 3.5],
  [3.5, 52.5],
  [61.5, 52.5],
] as const;
const gpioPins = Array.from({ length: 40 }, (_, i) => ({
  x: 8.27 + Math.floor(i / 2) * 2.54,
  y: 2.47 + (i % 2) * 2.54,
}));

function Label({
  x,
  y,
  children,
  rotate,
}: {
  x: number;
  y: number;
  children: string;
  rotate?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      className={bs.piLabel}
      transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
    >
      {children}
    </text>
  );
}

export function Pi5Sketch() {
  return (
    <div className={bs.pi} aria-hidden="true">
      <div className={bs.piStage}>
        <span className={bs.piShadow} />
        {/* Board edge, offset below the top layer for thickness */}
        <svg viewBox={viewBox} className={bs.piBase}>
          <path d={board} />
        </svg>
        <svg viewBox={viewBox} className={bs.piTop}>
          <defs>
            <linearGradient id="bs-pi-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a050ff" />
              <stop offset="1" stopColor="#50b4ff" />
            </linearGradient>
          </defs>
          <path d={board} className={bs.piBoard} />

          {holes.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r={2.8} className={bs.piFaint} />
              <circle cx={cx} cy={cy} r={1.35} />
            </g>
          ))}

          {/* 40-pin GPIO header */}
          <rect x={7} y={1.2} width={50.8} height={5.1} rx={0.4} />
          {gpioPins.map((pin) => (
            <rect
              key={`${pin.x}-${pin.y}`}
              x={pin.x - 0.45}
              y={pin.y - 0.45}
              width={0.9}
              height={0.9}
              className={bs.piFill}
            />
          ))}
          <Label x={7} y={9.6}>
            GPIO
          </Label>

          {/* Fan header */}
          <rect x={58.6} y={7.4} width={6} height={2.2} rx={0.3} />
          <Label x={58.6} y={12}>
            FAN
          </Label>

          {/* BCM2712 SoC with heat spreader */}
          <rect x={23} y={18} width={17} height={17} rx={1} />
          <rect
            x={25.2}
            y={20.2}
            width={12.6}
            height={12.6}
            rx={0.8}
            className={bs.piAccent}
          />
          <Label x={26} y={27.4}>
            BCM2712
          </Label>

          {/* LPDDR4X RAM */}
          <rect x={43} y={19.5} width={10} height={13.5} rx={0.6} />
          <Label x={44.6} y={27}>
            RAM
          </Label>

          {/* RP1 southbridge */}
          <rect x={56} y={24} width={7.5} height={7.5} rx={0.5} />
          <Label x={57.3} y={28.5}>
            RP1
          </Label>

          {/* USB 2, USB 3, Gigabit Ethernet (overhanging the short edge) */}
          {[
            { y: 2.5, h: 13.2, label: "USB 2" },
            { y: 19, h: 13.2, label: "USB 3" },
          ].map(({ y, h, label }) => (
            <g key={label}>
              <rect x={66.5} y={y} width={21} height={h} rx={0.6} />
              <rect
                x={70}
                y={y + 2}
                width={16}
                height={3.6}
                rx={0.3}
                className={bs.piFaint}
              />
              <rect
                x={70}
                y={y + 7.6}
                width={16}
                height={3.6}
                rx={0.3}
                className={bs.piFaint}
              />
              <Label x={67.4} y={y + h - 0.6}>
                {label}
              </Label>
            </g>
          ))}
          <rect x={66.5} y={36.5} width={21} height={16} rx={0.6} />
          <rect
            x={70}
            y={39.5}
            width={16}
            height={10}
            rx={0.4}
            className={bs.piFaint}
          />
          <path d="M86 42.5h-2.5v4H86" className={bs.piFaint} />
          <Label x={71} y={45.6}>
            ETH
          </Label>

          {/* USB-C power + 2× micro-HDMI on the long edge */}
          <rect x={6.7} y={50.6} width={9} height={6.4} rx={1.5} />
          <Label x={7.4} y={49}>
            USB-C
          </Label>
          {[21.5, 34.5].map((x, i) => (
            <g key={x}>
              <rect x={x} y={51} width={7} height={6} rx={0.6} />
              <Label x={x} y={49.4}>
                {`HDMI${i}`}
              </Label>
            </g>
          ))}

          {/* 2× MIPI camera/display FPC connectors */}
          {[46.5, 52].map((x) => (
            <g key={x}>
              <rect x={x} y={41.5} width={3.4} height={11} rx={0.3} />
              <line
                x1={x + 1.1}
                y1={42.5}
                x2={x + 1.1}
                y2={51.5}
                className={bs.piFaint}
              />
            </g>
          ))}
          <Label x={45.6} y={39.6}>
            MIPI
          </Label>

          {/* PCIe FPC connector + power button on the left short edge */}
          <rect
            x={0.8}
            y={17}
            width={3.4}
            height={17}
            rx={0.3}
            className={bs.piAccent}
          />
          <line x1={2.9} y1={18.2} x2={2.9} y2={32.8} className={bs.piFaint} />
          <Label x={7.6} y={31.5} rotate>
            PCIe
          </Label>
          <rect x={-0.8} y={40} width={3.6} height={3.6} rx={0.5} />
          <circle cx={1} cy={41.8} r={1} />
          <Label x={4.4} y={42.6}>
            PWR
          </Label>
        </svg>
      </div>
    </div>
  );
}
