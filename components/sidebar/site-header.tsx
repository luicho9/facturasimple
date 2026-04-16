"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pages = {
  "/create": "Crear factura",
  "/invoices": "Facturas",
  "/settings": "Configuración",
  "/clients": "Clientes",
} as const;

type PagePath = keyof typeof pages;

export function SiteHeader() {
  const pathname = usePathname();
  const page = pages[pathname as PagePath];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
        <h1 className="text-base font-medium">{page}</h1>
        {/* Portal target: pages mount page-specific actions (e.g. Download on */}
        {/* /create) into this slot via createPortal. Keeps the header shared */}
        {/* and avoids lifting per-page state up or prop-drilling through the layout. */}
        <div
          id="site-header-actions"
          className="ml-auto flex items-center gap-2"
        />
      </div>
    </header>
  );
}
