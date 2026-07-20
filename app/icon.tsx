import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E5C6D",
          color: "#A47B45",
          fontSize: 20,
          fontFamily: "Georgia, serif",
          letterSpacing: "0.08em",
        }}
      >
        MR
      </div>
    ),
    size,
  );
}
