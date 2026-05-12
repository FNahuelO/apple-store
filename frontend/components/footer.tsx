"use client";

import Link from "next/link";
import { Instagram, MessageCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  STORE_NAME, 
  STORE_ADDRESS, 
  STORE_HOURS, 
  INSTAGRAM_URL, 
  getWhatsAppLink,
  getGoogleMapsLink,
} from "@/lib/constants";

const footerLinks = [
  {
    title: "Navegación",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
      { label: "Plan Canje", href: "/canje" },
    ]
  },
  {
    title: "Productos",
    links: [
      { label: "iPhone Nuevos", href: "/catalogo?condition=nuevo" },
      { label: "iPhone Usados", href: "/catalogo?condition=usado" },
      { label: "Reacondicionados", href: "/catalogo?condition=reacondicionado" },
      { label: "Accesorios", href: "/catalogo" },
    ]
  }
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-foreground">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div>
                <span className="font-semibold text-lg">{STORE_NAME}</span>
                <p className="text-xs text-background/60">Premium Reseller</p>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Tu tienda de confianza para comprar iPhones nuevos, usados y accesorios originales Apple.
            </p>
            <div className="flex items-center gap-3">
              <Button
                asChild
                size="icon"
                variant="outline"
                className="rounded-full border-background/20 bg-transparent hover:bg-background/10 text-background"
              >
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="icon"
                variant="outline"
                className="rounded-full border-background/20 bg-transparent hover:bg-background/10 text-background"
              >
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-background/70 hover:text-background transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-background/70 shrink-0 mt-0.5" />
                <a
                  href={getGoogleMapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background underline-offset-2 hover:underline transition-colors"
                >
                  {STORE_ADDRESS}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-background/70 shrink-0 mt-0.5" />
                <div className="text-background/70">
                  <p>Lun a Vie: {STORE_HOURS.weekdays}</p>
                  <p>Sábado: {STORE_HOURS.saturday}</p>
                </div>
              </li>
              <li>
                <Button
                  asChild
                  className="w-full rounded-full bg-background text-foreground hover:bg-background/90"
                >
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Escribinos
                  </a>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.</p>
            <p>Desarrollado con ❤️ para Apple Reseller</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
