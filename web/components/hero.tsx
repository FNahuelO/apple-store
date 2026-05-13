"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Stock disponible
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.1]">
              Tu próximo{" "}
              <span className="relative">
                iPhone
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-foreground/20" />
                </svg>
              </span>{" "}
              está acá
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
              Equipos nuevos, usados seleccionados, accesorios originales y{" "}
              <span className="text-foreground font-medium">financiación en cuotas</span>.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full text-base h-14 px-8">
                <Link href="/catalogo">
                  Ver stock disponible
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="rounded-full text-base h-14 px-8"
              >
                <a href={getWhatsAppLink("Hola! Quiero consultar sobre un iPhone")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-foreground">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-foreground">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Hasta 12 cuotas</span>
              </div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-foreground">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Plan canje</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Floating phones composition */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main iPhone */}
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="relative z-20"
                >
                  <div className="w-64 h-[500px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-[2.5rem] overflow-hidden relative">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-light text-zinc-800">9:41</div>
                          <div className="text-sm text-zinc-500 mt-1">lunes 12 de mayo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary phones */}
                <motion.div
                  initial={{ y: 30 }}
                  animate={{ y: 10 }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -left-8 top-20 z-10"
                >
                  <div className="w-40 h-80 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-[2rem] p-1.5 shadow-xl opacity-60 rotate-[-15deg]">
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200 rounded-[1.75rem]" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 25 }}
                  animate={{ y: 5 }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -right-4 top-32 z-10"
                >
                  <div className="w-36 h-72 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-[1.75rem] p-1.5 shadow-xl opacity-50 rotate-[12deg]">
                    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 rounded-[1.5rem]" />
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl" />
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-foreground/5 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
