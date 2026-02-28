"use client";

import { Button, Link } from "@heroui/react";
import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      {/* ── Desktop (single row) ── */}
      <div className="mx-auto hidden max-w-7xl items-center px-6 py-3 md:flex">
        {/* Logo */}
        <NextLink href="/" className="shrink-0">
          <Image src="/images/logo.png" alt="Salespoint" width={130} height={32} priority />
        </NextLink>

        {/* Nav links — center */}
        <nav className="flex flex-1 items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as={NextLink}
              href={link.href}
              color="foreground"
              size="sm"
              className="font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions — right */}
        <div className="flex shrink-0 items-center gap-2">
          <Link as={NextLink} href="#" color="foreground" size="sm" className="font-medium px-2">
            Log In
          </Link>
          <Button
            variant="light"
            size="sm"
            startContent={<Globe size={14} />}
            endContent={<ChevronDown size={14} />}
            className="font-medium text-gray-700"
          >
            EN
          </Button>
          <Button
            as={NextLink}
            href="#"
            color="default"
            radius="full"
            size="sm"
            className="bg-gray-900 font-semibold text-white hover:bg-gray-700"
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* ── Mobile (two rows) ── */}
      <div className="md:hidden">
        {/* Row 1: Logo + actions */}
        <div className="flex items-center justify-between px-4 py-3">
          <NextLink href="/">
            <Image src="/images/logo.png" alt="Salespoint" width={130} height={32} priority />
          </NextLink>

          <div className="flex items-center gap-1">
            <Link as={NextLink} href="#" color="foreground" size="sm" className="font-medium px-2">
              Log In
            </Link>
            <Button
              variant="light"
              size="sm"
              startContent={<Globe size={14} />}
              endContent={<ChevronDown size={14} />}
              className="font-medium text-gray-700 px-1"
            >
              EN
            </Button>
            <Button
              as={NextLink}
              href="#"
              color="default"
              radius="full"
              size="sm"
              className="bg-gray-900 font-semibold text-white"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Row 2: Nav links */}
        <nav className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as={NextLink}
              href={link.href}
              color="foreground"
              size="sm"
              className="font-bold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

