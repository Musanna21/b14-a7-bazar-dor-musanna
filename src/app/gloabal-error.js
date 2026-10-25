
"use client";

import "./globals.css";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Bazar Dor root error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f8faf5] px-5 text-gray-900">
        <main className="max-w-md text-center">
          <h1 className="text-3xl font-black">
            Bazar Dor is having trouble
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            An unexpected error affected the main application.
            Please try loading it again.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
          >
            Retry Application
          </button>
        </main>
      </body>
    </html>
  );
}
