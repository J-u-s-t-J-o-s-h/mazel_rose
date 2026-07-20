import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            display: "flex",
            fontSize: 48,
            color: "#A47B45",
            letterSpacing: "0.1em",
          }}
        >
          MR
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "lowercase",
          }}
        >
          mazel.rose
        </div>
      </div>
    ),
    size,
  );
}
