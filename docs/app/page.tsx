"use client";

import React from "react";
import DragDrop from "../../src/index.js";

export default function Home() {
    return (
        <main style={{ minHeight: "100vh", padding: "32px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "8px" }}>
                    react-dragd
                </h1>

                <div
                    style={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        minHeight: "600px",
                    }}
                >
                    <DragDrop />
                </div>
            </div>
        </main>
    );
}
