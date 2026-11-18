import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { cs } from "@/content/cs";
import { en } from "@/content/en";


const size = { width: 1200, height: 630 };
const contentType = "image/png";

export function generateImageMetadata() {
  return [{ id: "og", alt: site.name, size, contentType }];
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = lang === "cs" ? cs : en;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "#fff",
          background: "linear-gradient(135deg, #050506 0%, #1b1446 60%, #1e3a8a 100%)",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>{site.name}</div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.85, maxWidth: 900 }}>
          {t.meta.description}
        </div>
        <div style={{ fontSize: 28, marginTop: 48, opacity: 0.6 }}>tomaspolanek.dev</div>
      </div>
    ),
    size,
  );
}
