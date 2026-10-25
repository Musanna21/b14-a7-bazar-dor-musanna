
import Image from "next/image";
import Link from "next/link";
var dateNow = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t border-green-100 bg-white">
      <div className="bazar-container flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          aria-label="Bazar Dor homepage"
          className="flex items-center gap-3"
        >
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={38}
            height={38}
            className="h-9 w-9 object-contain"
          />

          <div>
            <p className="font-black tracking-tight text-gray-900">
              Bazar <span className="text-green-700">Dor</span>
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Essential market prices at a glance.
            </p>
          </div>
        </Link>

        <p className="max-w-lg text-xs leading-6 text-gray-500 sm:text-right">
          Market prices are indicative and may change according to local
          market conditions.
        </p>
      </div>

      <div className="border-t border-gray-100">
        <div className="bazar-container flex flex-col gap-2 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {dateNow} Bazar Dor. All rights reserved.</p>

          <p>Built to make market prices easier to compare.</p>
        </div>
      </div>
    </footer>
  );
}
