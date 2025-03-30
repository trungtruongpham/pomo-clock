import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PomoClock - Pomodoro Timer for Productive Study Sessions";
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: "linear-gradient(to bottom, #DB524D, #C9413C)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              marginRight: 20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
              color: "#DB524D",
              fontWeight: "bold",
            }}
          >
            25
          </div>
          <h1
            style={{
              fontSize: 60,
              margin: 0,
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            PomoClock
          </h1>
        </div>
        <h2
          style={{
            fontSize: 30,
            margin: "10px 0 20px",
            fontWeight: "normal",
          }}
        >
          Pomodoro Timer for Productive Study Sessions
        </h2>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            gap: 15,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              fontSize: 25,
            }}
          >
            #pomodoro
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              fontSize: 25,
            }}
          >
            #productivity
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              fontSize: 25,
            }}
          >
            #study
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      alt,
    }
  );
}
