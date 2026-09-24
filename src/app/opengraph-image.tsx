import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/content";

export const alt = `${PROFILE.name} — IMSA student, developer, and researcher`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public", PROFILE.photo));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "linear-gradient(135deg, #070B18 0%, #10214A 100%)",
          color: "#E8EDF7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={260}
          height={260}
          style={{ borderRadius: 9999, border: "6px solid #7BA4E8" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              color: "#7BA4E8",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>
            {PROFILE.name}
          </div>
          <div style={{ fontSize: 34, color: "#A7B4CE", marginTop: 24, maxWidth: 640 }}>
            IMSA sophomore · Developer · STEM researcher
          </div>
          <div style={{ fontSize: 30, color: "#7BA4E8", marginTop: 36 }}>
            alejandrovaladez.me
          </div>
        </div>
      </div>
    ),
    size
  );
}
