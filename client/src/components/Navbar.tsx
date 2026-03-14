"use client";
import React from "react";
import Link from "next/link";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

export default function Navbar() {
  return (
    <HeroNavbar maxWidth="xl" className="bg-content1/80 backdrop-blur-md">
      <NavbarBrand>
        <Link href="/" className="font-bold text-xl">
          TaskFlow
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem className="text-sm text-default-600">
          Task Management Dashboard
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
