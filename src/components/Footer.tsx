import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Resources", href: "#" },
  { label: "About", href: "#" },
];

function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Salesp<span className="text-primary">o</span>int
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              SalePoint AI is your sales intelligence partner, helping teams
              discover real decision-makers, gain contact insights, and sell
              more effectively with AI.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Empty spacer on desktop */}
          <div className="hidden md:block" />

          {/* Contact & socials */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-900">Contact Us</p>
            <a
              href="tel:+6612345678"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              +6612345678
            </a>
            <a
              href="mailto:email@gmail.com"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              email@gmail.com
            </a>

            {/* Social icons */}
            <div className="mt-1 flex items-center gap-4 text-gray-600">
              <a href="#" aria-label="Facebook" className="hover:text-gray-900 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-900 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-gray-900 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-gray-900 transition-colors">
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <p className="mt-10 text-right text-xs text-gray-400">
          © 2026 Salespoint
        </p>
      </div>
    </footer>
  );
}
