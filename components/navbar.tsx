"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ClinicaSim</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant={!isAdmin ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Casos</span>
            </Link>
          </Button>
          <Button
            variant={isAdmin ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
