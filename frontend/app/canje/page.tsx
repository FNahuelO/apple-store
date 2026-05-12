"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Upload,
  Smartphone,
  Package,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  X,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getWhatsAppLink } from "@/lib/constants";

const deviceModels = [
  "iPhone 7",
  "iPhone 7 Plus",
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12 mini",
  "iPhone 12",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13 mini",
  "iPhone 13",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
];

const storageOptions = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const conditionOptions = [
  { value: "excelente", label: "Excelente - Sin marcas de uso" },
  { value: "muy-bueno", label: "Muy bueno - Pequeñas marcas" },
  { value: "bueno", label: "Bueno - Marcas visibles pero funcional" },
  { value: "regular", label: "Regular - Rayones o golpes" },
];
const batteryOptions = [
  { value: "90-100", label: "90% - 100% (Excelente)" },
  { value: "80-89", label: "80% - 89% (Buena)" },
  { value: "70-79", label: "70% - 79% (Regular)" },
  { value: "menos-70", label: "Menos de 70% (Degradada)" },
  { value: "no-se", label: "No sé" },
];

export default function CanjePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    model: "",
    storage: "",
    condition: "",
    batteryHealth: "",
    hasBox: false,
    hasAccessories: false,
    comments: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagesPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagesPreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagesPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);
    const detailsParts = [
      formData.comments.trim(),
      formData.hasBox ? "Incluye caja original" : "Sin caja original",
      formData.hasAccessories ? "Incluye accesorios originales" : "Sin accesorios originales",
      formData.batteryHealth ? `Autoevaluación de batería: ${formData.batteryHealth}` : "",
    ].filter(Boolean);

    const res = await fetch("/api/trade-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.name.trim(),
        phone: formData.whatsapp.trim(),
        brand: "Apple",
        model: formData.model.trim(),
        storage: formData.storage.trim(),
        condition: formData.condition.trim(),
        details: detailsParts.join("\n") || undefined,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(true);
    }
  };

  const getWhatsAppMessage = () => {
    return `Hola! Acabo de completar el formulario de canje en la web.

📱 Mi equipo:
- Modelo: ${formData.model}
- Capacidad: ${formData.storage}
- Estado: ${formData.condition}
- Batería: ${formData.batteryHealth}
- Caja: ${formData.hasBox ? "Sí" : "No"}
- Accesorios: ${formData.hasAccessories ? "Sí" : "No"}

Quisiera saber qué valor pueden ofrecerme.`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20 lg:py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">¡Solicitud enviada!</h1>
              <p className="text-muted-foreground mb-8">
                Recibimos los datos de tu equipo. Te vamos a contactar pronto con una propuesta.
                También podés escribirnos directamente por WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <a href={getWhatsAppLink(getWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      whatsapp: "",
                      model: "",
                      storage: "",
                      condition: "",
                      batteryHealth: "",
                      hasBox: false,
                      hasAccessories: false,
                      comments: "",
                    });
                    setImages([]);
                    setImagesPreviews([]);
                  }}
                >
                  Enviar otro equipo
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm mb-6">
                <Smartphone className="w-4 h-4" />
                Plan Canje
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Entregá tu equipo usado
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Completá el formulario con los datos de tu iPhone y te hacemos una oferta. 
                Podés usarlo como parte de pago para un equipo nuevo.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-3xl border border-border p-6 sm:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    Tus datos
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        placeholder="Ej: 351 123 4567"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Device Info */}
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    Datos del equipo
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Modelo *</Label>
                      <Select 
                        value={formData.model} 
                        onValueChange={(v) => setFormData({ ...formData, model: v })}
                        required
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Seleccioná el modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Capacidad *</Label>
                      <Select 
                        value={formData.storage} 
                        onValueChange={(v) => setFormData({ ...formData, storage: v })}
                        required
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Seleccioná la capacidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {storageOptions.map((storage) => (
                            <SelectItem key={storage} value={storage}>
                              {storage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estado general *</Label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(v) => setFormData({ ...formData, condition: v })}
                        required
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="¿En qué estado está?" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Estado de batería
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </Label>
                      <Select 
                        value={formData.batteryHealth} 
                        onValueChange={(v) => setFormData({ ...formData, batteryHealth: v })}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="% de batería" />
                        </SelectTrigger>
                        <SelectContent>
                          {batteryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="hasBox"
                        checked={formData.hasBox}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, hasBox: checked as boolean })
                        }
                      />
                      <Label htmlFor="hasBox" className="flex items-center gap-2 cursor-pointer">
                        <Package className="w-4 h-4" />
                        Tiene caja original
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="hasAccessories"
                        checked={formData.hasAccessories}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, hasAccessories: checked as boolean })
                        }
                      />
                      <Label htmlFor="hasAccessories" className="cursor-pointer">
                        Incluye accesorios originales
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    Fotos del equipo
                    <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
                  </h2>

                  <div className="space-y-4">
                    {/* Upload area */}
                    <label className="block">
                      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors">
                        <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                        <p className="font-medium mb-1">Subí fotos de tu equipo</p>
                        <p className="text-sm text-muted-foreground">
                          Arrastrá o hacé click para seleccionar (máx. 5 fotos)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Image previews */}
                    {imagesPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {imagesPreviews.map((preview, index) => (
                          <div key={index} className="relative h-24 w-24 overflow-hidden rounded-xl group">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              sizes="96px"
                              className="object-cover"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-6 h-6 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label htmlFor="comments">Comentarios adicionales</Label>
                  <Textarea
                    id="comments"
                    placeholder="¿Algo más que quieras contarnos sobre tu equipo?"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="mt-2 rounded-xl min-h-[100px]"
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="rounded-full h-14 px-8 flex-1"
                    disabled={
                      submitting ||
                      !formData.name ||
                      !formData.whatsapp ||
                      !formData.model ||
                      !formData.storage ||
                      !formData.condition
                    }
                  >
                    {submitting ? "Enviando..." : "Enviar solicitud"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="lg" 
                    className="rounded-full h-14 px-8"
                    asChild
                  >
                    <a href={getWhatsAppLink("Hola! Quiero consultar sobre el plan de canje")} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Consultar por WhatsApp
                    </a>
                  </Button>
                </div>
                {submitError && (
                  <p className="text-center text-sm text-destructive">
                    No se pudo enviar la solicitud. Probá de nuevo o contactanos por WhatsApp.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
