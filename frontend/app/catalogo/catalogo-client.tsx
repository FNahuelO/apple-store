"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductCard } from "@/components/featured-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice, type ProductCondition } from "@/lib/constants";
import type { StoreProduct } from "@/lib/store-product";

const conditions: { value: ProductCondition | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "reacondicionado", label: "Reacondicionado" },
];

const defaultStorageBadges = ["64GB", "128GB", "256GB", "512GB", "1TB"];

function computePriceCeiling(products: StoreProduct[]) {
  return Math.max(3_000_000, ...products.map((p) => p.price), 50_000);
}

type CatalogFilterPanelProps = {
  priceCeiling: number;
  storageOptions: string[];
  modelOptions: string[];
  selectedCondition: ProductCondition | "todos";
  setSelectedCondition: (v: ProductCondition | "todos") => void;
  selectedStorages: string[];
  toggleStorage: (s: string) => void;
  selectedModels: string[];
  toggleModel: (m: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
};

function CatalogFilterPanel({
  priceCeiling,
  storageOptions,
  modelOptions,
  selectedCondition,
  setSelectedCondition,
  selectedStorages,
  toggleStorage,
  selectedModels,
  toggleModel,
  priceRange,
  setPriceRange,
  activeFiltersCount,
  clearFilters,
}: CatalogFilterPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold">Estado</h3>
        <div className="space-y-3">
          {conditions.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-3">
              <Checkbox
                id={`condition-${condition.value}`}
                checked={selectedCondition === condition.value}
                onCheckedChange={() => setSelectedCondition(condition.value)}
              />
              <Label htmlFor={`condition-${condition.value}`} className="cursor-pointer">
                {condition.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Capacidad</h3>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((storage) => (
            <Badge
              key={storage}
              variant={selectedStorages.includes(storage) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleStorage(storage)}
            >
              {storage}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Precio</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            min={0}
            max={priceCeiling}
            step={Math.max(50_000, Math.round(priceCeiling / 60))}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Modelo</h3>
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {modelOptions.map((model) => (
            <div key={model} className="flex items-center space-x-3">
              <Checkbox
                id={`model-${model}`}
                checked={selectedModels.includes(model)}
                onCheckedChange={() => toggleModel(model)}
              />
              <Label htmlFor={`model-${model}`} className="cursor-pointer text-sm">
                {model}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Limpiar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}

export function CatalogoClient({ initialProducts }: { initialProducts: StoreProduct[] }) {
  const priceCeiling = useMemo(() => computePriceCeiling(initialProducts), [initialProducts]);

  const storageOptions = useMemo(() => {
    const fromDb = [...new Set(initialProducts.map((p) => p.storage))];
    return [...new Set([...defaultStorageBadges, ...fromDb])].sort();
  }, [initialProducts]);

  const modelOptions = useMemo(() => {
    const unique = [...new Set(initialProducts.map((p) => p.model))];
    return unique.sort((a, b) => a.localeCompare(b, "es"));
  }, [initialProducts]);

  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | "todos">("todos");
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    0,
    computePriceCeiling(initialProducts),
  ]);
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let products = initialProducts.filter((p) => p.isActive);

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.model.toLowerCase().includes(searchLower) ||
          p.color.toLowerCase().includes(searchLower),
      );
    }

    if (selectedCondition !== "todos") {
      products = products.filter((p) => p.condition === selectedCondition);
    }

    if (selectedStorages.length > 0) {
      products = products.filter((p) => selectedStorages.includes(p.storage));
    }

    if (selectedModels.length > 0) {
      products = products.filter((p) =>
        selectedModels.some((m) => p.model.toLowerCase().includes(m.toLowerCase())),
      );
    }

    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price-asc":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "featured":
        products = [...products].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      default:
        break;
    }

    return products;
  }, [search, selectedCondition, selectedStorages, selectedModels, priceRange, sortBy, initialProducts]);

  const defaultRange = useMemo(() => [0, priceCeiling] as [number, number], [priceCeiling]);

  const activeFiltersCount =
    (selectedCondition !== "todos" ? 1 : 0) +
    selectedStorages.length +
    selectedModels.length +
    (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1] ? 1 : 0);

  const clearFilters = useCallback(() => {
    setSelectedCondition("todos");
    setSelectedStorages([]);
    setSelectedModels([]);
    setPriceRange([0, priceCeiling]);
  }, [priceCeiling]);

  const toggleStorage = useCallback((storage: string) => {
    setSelectedStorages((prev) =>
      prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage],
    );
  }, []);

  const toggleModel = useCallback((model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model],
    );
  }, []);

  const filterPanelProps: CatalogFilterPanelProps = {
    priceCeiling,
    storageOptions,
    modelOptions,
    selectedCondition,
    setSelectedCondition,
    selectedStorages,
    toggleStorage,
    selectedModels,
    toggleModel,
    priceRange,
    setPriceRange,
    activeFiltersCount,
    clearFilters,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 lg:py-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Catálogo</h1>
            <p className="text-muted-foreground">Explorá todos nuestros productos disponibles</p>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold">Filtros</h2>
                <CatalogFilterPanel {...filterPanelProps} />
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 rounded-xl pl-12"
                  />
                </div>

                <div className="flex gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="h-12 rounded-xl lg:hidden">
                        <SlidersHorizontal className="mr-2 h-5 w-5" />
                        Filtros
                        {activeFiltersCount > 0 && <Badge className="ml-2">{activeFiltersCount}</Badge>}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <CatalogFilterPanel {...filterPanelProps} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 w-[180px] rounded-xl">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="price-asc">Menor precio</SelectItem>
                      <SelectItem value="price-desc">Mayor precio</SelectItem>
                      <SelectItem value="newest">Más recientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtros activos:</span>
                  {selectedCondition !== "todos" && (
                    <Badge variant="secondary" className="gap-1">
                      {conditions.find((c) => c.value === selectedCondition)?.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCondition("todos")} />
                    </Badge>
                  )}
                  {selectedStorages.map((storage) => (
                    <Badge key={storage} variant="secondary" className="gap-1">
                      {storage}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleStorage(storage)} />
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
                    Limpiar todo
                  </Button>
                </div>
              )}

              <p className="mb-6 text-sm text-muted-foreground">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
                {filteredProducts.length !== 1 ? "s" : ""}
              </p>

              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} showFullDescription />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No encontramos productos</h3>
                  <p className="mb-6 text-muted-foreground">Probá ajustando los filtros o buscando otra cosa</p>
                  <Button onClick={clearFilters}>Limpiar filtros</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
