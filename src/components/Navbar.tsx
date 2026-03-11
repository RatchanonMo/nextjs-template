"use client";

import { Button, Link } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Agent", href: "/agent" },
  { label: "Blogs", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export default function AppNavbar({ dark = false }: { dark?: boolean }) {
  const linkColor = dark ? "text-white/80 hover:text-white" : "";
  return (
    <header className={`sticky top-0 z-50 border-b ${dark ? "border-white/10 bg-black" : "border-gray-100 bg-white"}`}>
      {/* ── Desktop ── */}
      <div className="mx-auto hidden max-w-7xl items-center px-6 py-3 md:flex">
        {/* Logo */}
        <NextLink href="/" className="shrink-0">
          <Image src="/images/logo.png" alt="Salespoint" width={130} height={32} priority className={dark ? "brightness-0 invert" : ""} />
        </NextLink>

        {/* Nav links — left */}
        <nav className="flex flex-1 items-center justify-start gap-8 ml-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as={NextLink}
              href={link.href}
              color="foreground"
              size="sm"
              className={`font-medium ${linkColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions — right */}
        <div className="flex shrink-0 items-center gap-3">
          <Link as={NextLink} href="#" color="foreground" size="sm" className={`font-medium ${linkColor}`}>
            contact sales
          </Link>
          <Button
            as={NextLink}
            href="#"
            radius="md"
            size="sm"
            className="font-semibold bg-linear-to-r from-primary to-secondary text-white"
          >
            get started
          </Button>
        </div>
      </div>

      {/* ── Mobile (two rows) ── */}
      <div className="md:hidden">
        {/* Row 1: Logo + CTA */}
        <div className="flex items-center justify-between px-4 py-3">
          <NextLink href="/">
            <Image src="/images/logo.png" alt="Salespoint" width={130} height={32} priority className={dark ? "brightness-0 invert" : ""} />
          </NextLink>
          <Button
            as={NextLink}
            href="#"
            color="primary"
            radius="md"
            size="sm"
            className="font-semibold bg-linear-to-r from-primary to-secondary text-white"
          >
            get started
          </Button>
        </div>

        {/* Row 2: Nav links */}
        <nav className={`flex items-center justify-between border-t px-4 py-2.5 ${dark ? "border-white/10" : "border-gray-100"}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as={NextLink}
              href={link.href}
              color="foreground"
              size="sm"
              className={`font-medium ${linkColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
