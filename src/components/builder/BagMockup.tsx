"use client";

import { motion } from "framer-motion";

interface BagMockupProps {
  bagStyle: "flat-bottom-pouch" | "stand-up-pouch" | "kraft-bag" | null;
  bagColour: string;
  labelFileURL: string | null;
  size?: "small" | "medium" | "large";
}

export function BagMockup({
  bagStyle,
  bagColour,
  labelFileURL,
  size = "medium",
}: BagMockupProps) {
  const sizeClasses = {
    small: "w-32 h-44",
    medium: "w-48 h-64",
    large: "w-64 h-80",
  };

  const labelSizes = {
    small: { width: 60, height: 40, top: 40 },
    medium: { width: 90, height: 60, top: 60 },
    large: { width: 120, height: 80, top: 80 },
  };

  const labelDimensions = labelSizes[size];

  // Render different bag shapes based on style
  const renderBagShape = () => {
    switch (bagStyle) {
      case "flat-bottom-pouch":
        return (
          <svg
            viewBox="0 0 120 160"
            className={sizeClasses[size]}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bag body */}
            <path
              d="M10 20 L10 140 Q10 150 20 150 L100 150 Q110 150 110 140 L110 20 Q110 10 100 10 L20 10 Q10 10 10 20"
              fill={bagColour}
              stroke="#333"
              strokeWidth="1"
            />
            {/* Top seal */}
            <rect x="10" y="5" width="100" height="12" fill="#222" rx="2" />
            {/* Fold lines */}
            <line x1="20" y1="140" x2="100" y2="140" stroke="#00000030" strokeWidth="0.5" />
            <line x1="20" y1="145" x2="100" y2="145" stroke="#00000020" strokeWidth="0.5" />
            {/* Highlight */}
            <rect x="15" y="25" width="8" height="100" fill="#ffffff10" rx="4" />
          </svg>
        );

      case "stand-up-pouch":
        return (
          <svg
            viewBox="0 0 120 160"
            className={sizeClasses[size]}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bag body - more rounded */}
            <path
              d="M15 25 Q10 25 10 35 L10 130 Q10 145 25 150 L95 150 Q110 145 110 130 L110 35 Q110 25 105 25 L15 25"
              fill={bagColour}
              stroke="#333"
              strokeWidth="1"
            />
            {/* Top seal - ziplock style */}
            <rect x="15" y="15" width="90" height="15" fill="#222" rx="3" />
            <line x1="20" y1="22" x2="100" y2="22" stroke="#444" strokeWidth="2" />
            {/* Highlight */}
            <rect x="15" y="35" width="6" height="90" fill="#ffffff10" rx="3" />
          </svg>
        );

      case "kraft-bag":
        return (
          <svg
            viewBox="0 0 120 160"
            className={sizeClasses[size]}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Kraft texture overlay effect via pattern */}
            <defs>
              <pattern id="kraftTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                <rect width="4" height="4" fill={bagColour} />
                <rect x="0" y="0" width="1" height="1" fill="#00000008" />
                <rect x="2" y="2" width="1" height="1" fill="#ffffff08" />
              </pattern>
            </defs>
            {/* Bag body - straight sides */}
            <rect
              x="12"
              y="20"
              width="96"
              height="125"
              fill="url(#kraftTexture)"
              stroke="#333"
              strokeWidth="1"
              rx="3"
            />
            {/* Fold top */}
            <path
              d="M12 20 L60 8 L108 20"
              stroke="#333"
              strokeWidth="1"
              fill="#222"
            />
            {/* Fold lines */}
            <line x1="12" y1="135" x2="108" y2="135" stroke="#00000020" strokeWidth="0.5" />
            {/* Highlight */}
            <rect x="16" y="25" width="5" height="100" fill="#ffffff08" rx="2" />
          </svg>
        );

      default:
        // Placeholder bag
        return (
          <svg
            viewBox="0 0 120 160"
            className={sizeClasses[size]}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="10"
              width="100"
              height="140"
              fill="#333"
              stroke="#555"
              strokeWidth="1"
              strokeDasharray="4 4"
              rx="8"
            />
            <text
              x="60"
              y="85"
              textAnchor="middle"
              fill="#666"
              fontSize="10"
            >
              Select a bag
            </text>
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bag SVG */}
      {renderBagShape()}

      {/* Label overlay */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: labelDimensions.width,
          height: labelDimensions.height,
          top: labelDimensions.top,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {labelFileURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={labelFileURL}
            alt="Your label"
            className="w-full h-full object-contain rounded"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          <div className="w-full h-full border-2 border-dashed border-neutral-600 rounded flex items-center justify-center bg-neutral-800/50">
            <span className="text-neutral-500 text-xs text-center px-2">
              Your label here
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
