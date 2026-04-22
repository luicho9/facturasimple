"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pages = {
  "/create": "Crear factura",
  "/invoices": "Facturas",
  "/clients": "Clientes",
  "/company": "Empresa",
} as const;

type PagePath = keyof typeof pages;

const HeaderActionsContext = createContext<HTMLElement | null>(null);

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return (
    <HeaderActionsContext.Provider value={slot}>
      <SiteHeader slotRef={setSlot} />
      {children}
    </HeaderActionsContext.Provider>
  );
}

export function HeaderActions({ children }: { children: ReactNode }) {
  const slot = useContext(HeaderActionsContext);
  if (!slot) {
    return null;
  }
  return createPortal(children, slot);
}

function SiteHeader({
  slotRef,
}: {
  slotRef: (el: HTMLElement | null) => void;
}) {
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
        <div ref={slotRef} className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  );
}
