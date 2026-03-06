"use client";

import { useEffect, useRef, useState } from "react";

interface StorefrontEmbedProps {
  roaster: string;
  type?: string;
  baseUrl?: string;
}

export function StorefrontEmbed({ roaster, type = "shop", baseUrl = "http://localhost:3001" }: StorefrontEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState(400);

  const path = type === "wholesale-apply"
    ? `/s/${encodeURIComponent(roaster)}/embed/wholesale-apply`
    : `/s/${encodeURIComponent(roaster)}/embed/shop`;

  const iframeSrc = `${baseUrl}${path}`;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "gr-embed-resize") {
        setIframeHeight(event.data.height);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
      <iframe
        src={iframeSrc}
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          minHeight: "400px",
          height: `${iframeHeight}px`,
          backgroundColor: "transparent",
        }}
        scrolling="no"
        allowTransparency
        allow="payment"
      />
    </div>
  );
}
