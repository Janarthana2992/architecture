"use client";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body
                style={{
                    margin: 0,
                    background: "#0A0A0A",
                    color: "#F5F0E8",
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    textAlign: "center",
                    padding: "2rem",
                }}
            >
                <p
                    style={{
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "#C9A96E",
                        marginBottom: "1.5rem",
                    }}
                >
                    Critical Error
                </p>
                <h1
                    style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "clamp(2rem, 5vw, 4rem)",
                        fontWeight: 400,
                        marginBottom: "1rem",
                    }}
                >
                    Application Error
                </h1>
                <p style={{ color: "#9A9080", maxWidth: "28rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                    A critical error occurred. Please refresh the page.
                </p>
                <button
                    onClick={reset}
                    style={{
                        padding: "0.75rem 2rem",
                        background: "#C9A96E",
                        color: "#0A0A0A",
                        border: "none",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                    }}
                >
                    Refresh
                </button>
            </body>
        </html>
    );
}
