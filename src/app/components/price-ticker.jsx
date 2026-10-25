
"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatPrice, getProducts } from "../lib/bazardor";

function PriceItem({ product }) {
  const trendColor =
    product.trend === "up"
      ? "text-green-700"
      : product.trend === "down"
        ? "text-red-600"
        : "text-gray-500";

  const TrendIcon =
    product.trend === "up"
      ? ArrowUpRight
      : product.trend === "down"
        ? ArrowDownRight
        : Minus;

  const trendLabel =
    product.changePercent == null
      ? "Change unavailable"
      : `${Math.abs(product.changePercent).toFixed(1)}%`;

  return (
    <div className="flex shrink-0 items-center gap-3 px-5 py-3">
      <span className="text-xl" aria-hidden="true">
        {product.emoji}
      </span>

      <span className="max-w-44 truncate text-sm font-semibold text-gray-800">
        {product.name}
      </span>

      <span className="whitespace-nowrap text-sm font-extrabold text-gray-950">
        {formatPrice(product.price)}
        {product.unit ? ` / ${product.unit}` : ""}
      </span>

      <span
        className={`inline-flex items-center gap-0.5 whitespace-nowrap text-xs font-bold ${trendColor}`}
        title="Price change reported by the API"
      >
        <TrendIcon size={15} />
        {trendLabel}
      </span>

      <span className="text-gray-300" aria-hidden="true">
        •
      </span>
    </div>
  );
}

export default function PriceTicker() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const data = await getProducts();

      if (!active) return;

      setProducts(data);
      setStatus(data.length > 0 ? "ready" : "unavailable");
    }

    loadProducts().catch((error) => {
      console.error("Unable to load market ticker:", error);

      if (active) {
        setStatus("unavailable");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        className="border-y border-green-100 bg-green-50"
        role="status"
        aria-live="polite"
      >
        <div className="bazar-container py-3 text-xs font-medium text-gray-600">
          Loading market prices…
        </div>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div
        className="border-y border-green-100 bg-green-50"
        role="status"
        aria-live="polite"
      >
        <div className="bazar-container py-3 text-xs text-gray-600">
          Live market prices are temporarily unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-green-100 bg-green-50">
      <div
        className="bazar-ticker-viewport"
        aria-label="Current market prices"
      >
        <div className="bazar-ticker-track">
          {[...products, ...products].map((product, index) => (
            <PriceItem
              key={`${product.id}-${index}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
