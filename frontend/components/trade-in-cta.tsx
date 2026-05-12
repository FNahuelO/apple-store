"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RefreshCw, Smartphone, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Smartphone,
    title: "Contanos qué equipo tenés",
    description: "Completá el formulario con los datos de tu iPhone actual"
  },
  {
    icon: DollarSign,
    title: "Te hacemos una oferta",
    description: "Te contactamos con una tasación justa para tu equipo"
  },
  {
    icon: CheckCircle2,
    title: "Elegí tu nuevo iPhone",
    description: "Usá el valor de tu equipo como parte de pago"
  }
];

export function TradeInCTA() {
  return (
    <section className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm mb-6">
              <RefreshCw className="w-4 h-4" />
              Plan Canje
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              Entregá tu iPhone usado y llevate uno nuevo
            </h2>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              ¿Tu celular quedó atrás en rendimiento, batería y capacidad? Con nuestro Plan Canje, 
              podés entregar tu equipo actual y acceder a un modelo más nuevo y funcional, a un 
              precio exclusivo y accesible.
            </p>

            <div className="mt-10 space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Button asChild size="lg" className="rounded-full h-14 px-8">
                <Link href="/canje">
                  Quiero canjear mi equipo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Trade animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Old phone */}
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-10"
                >
                  <div className="w-36 h-72 bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-[2rem] p-1 shadow-lg opacity-60">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-[1.75rem] flex items-center justify-center">
                      <span className="text-xs text-zinc-400 font-medium">Tu equipo</span>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow */}
                <div className="relative z-10 w-16 h-16 bg-foreground rounded-full flex items-center justify-center shadow-2xl">
                  <RefreshCw className="w-7 h-7 text-background" />
                </div>

                {/* New phone */}
                <motion.div
                  animate={{ x: [20, -20, 20] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-10"
                >
                  <div className="w-40 h-80 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[2.5rem] p-1.5 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-white to-zinc-100 rounded-[2rem] relative overflow-hidden">
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-zinc-800">iPhone nuevo</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-radial from-foreground/5 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
