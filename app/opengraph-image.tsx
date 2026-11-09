import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Sambhav Jain — Turning meh into memorable through storytelling.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const IDENTITY = ["Builder", "Consultant", "President", "Creator"];

/**
 * The social preview card (LinkedIn, WhatsApp, X, Slack). Generated once at build time
 * in the same monochrome language as the site: headshot, name, the Hero headline.
 */
export default async function OpengraphImage() {
  const headshot = await readFile(
    join(process.cwd(), "public/photos/hero/hero-headshot.jpeg")
  );
  const headshotSrc = `data:image/jpeg;base64,${headshot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 96px",
          background: "#ffffff",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={headshotSrc}
          width={280}
          height={350}
          alt=""
          style={{
            objectFit: "cover",
            borderRadius: 28,
            border: "1px solid #e4e4e7",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#71717a",
            }}
          >
            Sambhav Jain
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Turning meh into memorable through storytelling.
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {IDENTITY.map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 22,
                  color: "#52525b",
                  border: "1px solid #e4e4e7",
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
