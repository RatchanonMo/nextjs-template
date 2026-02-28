import { SOCIAL_LINKS } from "@/constants/about";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  tiktok: TikTokIcon,
};

export default function StayConnectedSection() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 text-center">
      {/* Social icons */}
      <div className="mb-6 flex items-center justify-center gap-3">
        {SOCIAL_LINKS.map((link) => {
          const Icon = ICON_MAP[link.type];
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-label={link.label}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-700"
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>

      <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
        Stay Connected with Us
      </h2>
      <p className="leading-relaxed text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </section>
  );
}
