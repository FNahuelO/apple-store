"use client";

import { motion } from "framer-motion";
import { Shield, CreditCard, RefreshCw, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantía incluida",
    description: "Todos nuestros equipos tienen garantía de 3 a 12 meses según el producto."
  },
  {
    icon: CreditCard,
    title: "Financiación",
    description: "Pagá en hasta 12 cuotas fijas con todas las tarjetas de crédito."
  },
  {
    icon: RefreshCw,
    title: "Plan Canje",
    description: "Entregá tu equipo usado como parte de pago y accedé a un modelo más nuevo."
  },
  {
    icon: Headphones,
    title: "Atención personalizada",
    description: "Te asesoramos por WhatsApp para encontrar el equipo ideal para vos."
  }
];

export function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-background/70">
            Somos especialistas en Apple. Conocé los beneficios de comprar con nosotros.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center mb-5 group-hover:bg-background/20 transition-colors">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-background/60 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
