"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Martín G.",
    content: "Excelente atención. Compré un iPhone 13 usado y vino impecable, tal cual las fotos. La garantía me da mucha tranquilidad.",
    rating: 5,
    product: "iPhone 13 128GB"
  },
  {
    name: "Luciana R.",
    content: "Hice el canje de mi iPhone 11 por un 14 Pro. El proceso fue super simple y me dieron un muy buen precio por mi equipo.",
    rating: 5,
    product: "iPhone 14 Pro 256GB"
  },
  {
    name: "Federico M.",
    content: "Segunda vez que compro acá. Siempre muy profesionales y los precios son muy competitivos. 100% recomendado.",
    rating: 5,
    product: "AirPods Pro 2"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            +500 clientes felices nos eligen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-muted-foreground/30 mb-3" />
              
              <p className="text-foreground leading-relaxed mb-4">
                {testimonial.content}
              </p>
              
              <div className="pt-4 border-t border-border">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
