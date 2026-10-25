
"use client";

import { useState } from "react";

export default function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  const imageUrl =
    typeof src === "string" &&
    /^(https?:\/\/|\/(?!\/))/.test(src.trim());

  // Ignore emoji, empty strings, and invalid image paths.
  if (!imageUrl || failed) {
    return null;
  }

  return (
    <img
      src={src.trim()}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
