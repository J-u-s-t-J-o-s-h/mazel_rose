import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = `${siteConfig.brandName} wedding invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E5C6D",
          color: "#F5EEE6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            border: "1px solid #A47B45",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#A47B45",
            fontSize: 28,
            letterSpacing: "0.12em",
          }}
        >
          M · R
        </div>
        <div
          style={{
            marginTop: 28,
            display: "flex",
            fontSize: 64,
            letterSpacing: "0.18em",
            textTransform: "lowercase",
          }}
        >
          {siteConfig.brandName}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#D8C3A5",
          }}
        >
          {siteConfig.coupleNames.display}
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            fontSize: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,238,230,0.75)",
          }}
        >
          {siteConfig.weddingDateDisplay} · {siteConfig.location.display}
        </div>
      </div>
    ),
    size,
  );
}
