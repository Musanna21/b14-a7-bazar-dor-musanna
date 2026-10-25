
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search, ShoppingBasket } from "lucide-react";
import ProductCard from "./product-card";
import { getProducts } from "../lib/bazardor";

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
          <Icon size={21} />
        </span>
      )}

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-green-700">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="animate-pulse bg-gray-100 h-40 sm:h-44" />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />

        <div className="flex items-end justify-between border-t border-gray-100 pt-4">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="h-7 w-16 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products, emptyMessage }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
        <ShoppingBasket
          size={30}
          className="mx-auto mb-3 text-gray-400"
        />

        <p className="text-sm font-semibold text-gray-700">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function HomeProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const result = await getProducts();

      if (!active) return;

      setProducts(result);
      setStatus(result.length > 0 ? "ready" : "empty");
    }

    loadProducts().catch((error) => {
      console.error("Failed to load homepage products:", error);

      if (active) {
        setProducts([]);
        setStatus("error");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const risingProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.trend === "up" ||
          (product.changePercent != null && product.changePercent > 0)
      )
      .sort((a, b) => {
        if (a.changePercent == null) return 1;
        if (b.changePercent == null) return -1;

        return b.changePercent - a.changePercent;
      })
      .slice(0, 6);
  }, [products]);

  const fallingProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.trend === "down" ||
          (product.changePercent != null && product.changePercent < 0)
      )
      .sort((a, b) => {
        if (a.changePercent == null) return 1;
        if (b.changePercent == null) return -1;

        return a.changePercent - b.changePercent;
      })
      .slice(0, 6);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const searchable = [
        product.name,
        product.category,
        product.unit,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });

    if (sortBy === "price-asc") {
      filtered.sort((a, b) => {
        if (a.price == null) return 1;
        if (b.price == null) return -1;

        return a.price - b.price;
      });
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => {
        if (a.price == null) return 1;
        if (b.price == null) return -1;

        return b.price - a.price;
      });
    }

    return filtered;
  }, [products, search, sortBy]);

  return (
    <>
      {/* Today's rising prices */}
      <section className="bazar-container py-12 sm:py-16">
        <SectionHeading
          eyebrow="Market movement"
          title="Prices Going Up"
          description="Products with the largest reported price increases."
          icon={ArrowUp}
        />

        {status === "loading" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={risingProducts}
            emptyMessage="No verified price increases are available right now."
          />
        )}
      </section>

      {/* Today's falling prices */}
      <section className="border-y border-green-100 bg-white py-12 sm:py-16">
        <div className="bazar-container">
          <SectionHeading
            eyebrow="Market movement"
            title="Prices Coming Down"
            description="Products with the largest reported price decreases."
            icon={ArrowDown}
          />

          {status === "loading" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <ProductGrid
              products={fallingProducts}
              emptyMessage="No verified price decreases are available right now."
            />
          )}
        </div>
      </section>

      {/* All products */}
      <section
        id="all-products"
        className="section-anchor bazar-container py-12 sm:py-16"
      >
        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Browse the market"
            title="All Products"
            description="Explore essential products and review the latest available market prices."
            icon={ShoppingBasket}
          />

          {status === "ready" && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <Search size={16} className="text-gray-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-48"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <span className="whitespace-nowrap text-xs font-semibold text-gray-500">
                  Sort by
                </span>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products by price"
                  className="min-w-0 bg-transparent text-sm font-semibold text-gray-800 outline-none"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {status === "loading" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : status === "error" || status === "empty" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-10 text-center">
            <h3 className="text-lg font-extrabold text-gray-900">
              Market data is unavailable
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              We could not retrieve the product list from the market API.
              Check your connection and try refreshing the page.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>

            <ProductGrid
              products={filteredProducts}
              emptyMessage="No products match your search."
            />
          </>
        )}
      </section>
    </>
  );
}
