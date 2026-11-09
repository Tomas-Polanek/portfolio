"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { TP_LIGATURE } from "@/components/tp-mark";
import { pragueOutline } from "../../bento-sidebar/_components/prague-outline";
import type { Palette } from "./palettes";

// liquid-glass-react measures the DOM and builds SVG filters on mount: client only.
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

/**
 * Tailwind classes used inside liquid-glass-react. Tailwind does not scan node_modules, so they are
 * listed here to be generated: bg-black opacity-0 opacity-20 opacity-100 mix-blend-overlay
 * transition-all duration-150 ease-in-out pointer-events-none text-white
 */

export type MockupCopy = {
  name: string;
  role: string;
  line: string;
  nav: string[];
  cta: string;
  aboutTitle: string;
  about: string;
  skills: string[];
  basedIn: string;
  city: string;
  project: { title: string; description: string; image: string; wip: string };
  homelab: { title: string; prompt: string; services: string[] };
};

const W = 1040;
const H = 600;

function Glass({
  x,
  y,
  w,
  h,
  radius = 26,
  light,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  light: boolean;
  children: ReactNode;
}) {
  return (
    <LiquidGlass
      // The library centres itself on top/left (translate -50%), so pass the centre point.
      style={{ position: "absolute", left: `${x + w / 2}px`, top: `${y + h / 2}px` }}
      cornerRadius={radius}
      // overLight adds a black under-layer that shows as dark corners; light palettes instead get a
      // milky tint on the content below.
      overLight={false}
      displacementScale={light ? 55 : 70}
      blurAmount={0.08}
      saturation={150}
      aberrationIntensity={2}
      elasticity={0.06}
      padding="0px"
    >
      <div
        className="relative overflow-hidden text-left"
        style={{
          width: w,
          height: h,
          color: "var(--m-fg)",
          font: "400 13px/1.45 var(--font-geist-sans), system-ui, sans-serif",
          textShadow: "none",
          background: light ? "rgb(255 255 255 / 0.5)" : "rgb(255 255 255 / 0.04)",
          borderRadius: radius,
        }}
      >
        {children}
      </div>
    </LiquidGlass>
  );
}

const eyebrow = "font-mono text-[10px] tracking-[0.14em] uppercase";

export function GlassMockup({ p, copy }: { p: Palette; copy: MockupCopy }) {
  const [a, b] = p.accent;
  const grad = `linear-gradient(135deg, ${a}, ${b})`;
  const gradId = `m-grad-${p.id}`;
  const vars = {
    "--m-fg": p.fg,
    "--m-muted": p.muted,
    width: W,
    height: H,
    background: p.bg,
  } as CSSProperties;

  return (
    <div className="lgm-frame relative isolate overflow-hidden rounded-[28px]" style={vars}>
      {/* Colour fields behind the glass */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <span className="absolute rounded-full blur-[70px]" style={{ left: 160, top: -60, width: 420, height: 320, background: p.blobs[0], opacity: p.light ? 0.6 : 0.55 }} />
        <span className="absolute rounded-full blur-[80px]" style={{ left: 640, top: 180, width: 460, height: 360, background: p.blobs[1], opacity: p.light ? 0.55 : 0.5 }} />
        <span className="absolute rounded-full blur-[60px]" style={{ left: -40, top: 360, width: 360, height: 300, background: p.blobs[2], opacity: p.light ? 0.55 : 0.45 }} />
        {/* Thin grid gives the refraction something sharp to bend */}
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${p.light ? "rgb(0 0 0 / 0.06)" : "rgb(255 255 255 / 0.06)"} 1px, transparent 1px), linear-gradient(90deg, ${p.light ? "rgb(0 0 0 / 0.06)" : "rgb(255 255 255 / 0.06)"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Left panel */}
      <Glass x={16} y={16} w={260} h={568} light={p.light}>
        <div className="flex h-full flex-col p-6">
          <svg width="44" height="44" viewBox="0 0 32 32" aria-hidden="true">
            <defs>
              <linearGradient id={`${gradId}-logo`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={a} />
                <stop offset="1" stopColor={b} />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="30" height="30" rx="8" fill={`url(#${gradId}-logo)`} />
            <path d={TP_LIGATURE} fill="none" stroke={p.light ? "#fff" : p.bg} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-6 text-[26px] leading-tight font-semibold tracking-tight">{copy.name}</p>
          <p className="mt-1 font-medium" style={{ backgroundImage: grad, WebkitBackgroundClip: "text", color: "transparent" }}>
            {copy.role}
          </p>
          <p className="mt-3 text-[12.5px]" style={{ color: "var(--m-muted)" }}>
            {copy.line}
          </p>
          <ul className="mt-8 grid gap-2.5 font-mono text-[11px] tracking-[0.12em] uppercase">
            {copy.nav.map((item, i) => (
              <li key={item} className="flex items-center gap-3" style={{ color: i === 0 ? "var(--m-fg)" : "var(--m-muted)" }}>
                <span className="h-px" style={{ width: i === 0 ? 40 : 18, background: i === 0 ? grad : "currentColor" }} />
                {item}
              </li>
            ))}
          </ul>
          <span
            className="mt-auto inline-flex w-fit items-center rounded-full px-4 py-2 text-[13px] font-semibold"
            style={{ background: grad, color: p.light ? "#fff" : p.bg }}
          >
            {copy.cta}
          </span>
        </div>
      </Glass>

      {/* About */}
      <Glass x={292} y={16} w={420} h={236} light={p.light}>
        <div className="flex h-full flex-col p-6">
          <p className={eyebrow} style={{ color: "var(--m-muted)" }}>
            {copy.aboutTitle}
          </p>
          <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed">{copy.about}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5">
            {copy.skills.map((s) => (
              <li
                key={s}
                className="rounded-full px-2.5 py-0.5 font-mono text-[10.5px]"
                style={{ border: `1px solid ${p.light ? "rgb(0 0 0 / 0.1)" : "rgb(255 255 255 / 0.12)"}`, color: "var(--m-muted)" }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Glass>

      {/* Location */}
      <Glass x={728} y={16} w={296} h={236} light={p.light}>
        <div className="relative flex h-full flex-col p-6">
          <svg viewBox={pragueOutline.viewBox} className="absolute top-1/2 left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <defs>
              <linearGradient id={`${gradId}-map`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={a} />
                <stop offset="1" stopColor={b} />
              </linearGradient>
            </defs>
            <path d={pragueOutline.d} fill={`${a}14`} stroke={`url(#${gradId}-map)`} strokeWidth="2.2" strokeLinejoin="round" />
            <path d={pragueOutline.river} fill="none" stroke={`url(#${gradId}-map)`} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className={`${eyebrow} relative`} style={{ color: "var(--m-muted)" }}>
            {copy.basedIn}
          </p>
          <p className="relative mt-auto text-[32px] font-semibold tracking-tight">{copy.city}</p>
        </div>
      </Glass>

      {/* Project */}
      <Glass x={292} y={268} w={420} h={316} light={p.light}>
        <div className="flex h-full flex-col p-2">
          <div className="relative h-[176px] overflow-hidden rounded-[20px]">
            <Image src={copy.project.image} alt="" fill sizes="404px" className="object-cover object-top" />
            <span
              className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px]"
              style={{ background: p.light ? "rgb(255 255 255 / 0.9)" : "rgb(0 0 0 / 0.65)", color: "var(--m-fg)" }}
            >
              <span className="size-1.5 rounded-full" style={{ background: a }} />
              {copy.project.wip}
            </span>
          </div>
          <div className="px-4 pt-3">
            <p className="text-[17px] font-semibold tracking-tight">{copy.project.title}</p>
            <p className="mt-1 line-clamp-3 text-[12.5px]" style={{ color: "var(--m-muted)" }}>
              {copy.project.description}
            </p>
          </div>
        </div>
      </Glass>

      {/* Homelab */}
      <Glass x={728} y={268} w={296} h={316} light={p.light}>
        <div className="flex h-full flex-col p-6">
          <p className={eyebrow} style={{ color: "var(--m-muted)" }}>
            {copy.homelab.title}
          </p>
          <p className="mt-4 font-mono text-[11.5px]">
            <span style={{ color: a }}>{copy.homelab.prompt}</span>
            <span style={{ color: "var(--m-muted)" }}>$ docker ps</span>
          </p>
          <ul className="mt-3 grid gap-2 font-mono text-[12px]">
            {copy.homelab.services.map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="size-2 rounded-full" style={{ background: grad }} />
                {s}
                <span className="ml-auto text-[10.5px]" style={{ color: "var(--m-muted)" }}>
                  up
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Glass>
    </div>
  );
}
