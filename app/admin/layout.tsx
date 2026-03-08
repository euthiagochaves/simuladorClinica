"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  HelpCircle,
  Stethoscope,
  Users,
  Upload,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Casos", icon: FileText },
  { href: "/admin/perguntas", label: "Perguntas", icon: HelpCircle },
  { href: "/admin/achados", label: "Achados", icon: Stethoscope },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/importacao", label: "Importacao", icon: Upload },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie casos clinicos, perguntas e configuracoes do sistema
        </p>
      </div>

      {/* Navigation */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
