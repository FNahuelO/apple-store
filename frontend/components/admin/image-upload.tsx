"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  ImageIcon, 
  GripVertical,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 6 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = maxImages - images.length;
      const arr = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remainingSlots);

      const urls: string[] = [];
      for (const file of arr) {
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
          urls.push(dataUrl);
        } catch {
          /* archivo ilegible */
        }
      }
      if (urls.length > 0) onChange([...images, ...urls]);
    },
    [images, maxImages, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      void handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.unshift(removed);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, removed);
    onChange(newImages);
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
          "flex flex-col items-center justify-center gap-2",
          isDragging 
            ? "border-zinc-900 bg-zinc-50" 
            : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/50",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => void handleFileSelect(e.target.files)}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
          <Upload className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700">
            {isDragging ? "Soltar imagenes aqui" : "Arrastra imagenes o haz clic"}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            PNG, JPG hasta 10MB. Max {maxImages} imagenes ({images.length}/{maxImages})
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={`${image.slice(0, 50)}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleImageDragOver(e, index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 group",
                "transition-all cursor-grab active:cursor-grabbing",
                index === 0 ? "border-zinc-900" : "border-zinc-200",
                draggedIndex === index && "opacity-50"
              )}
            >
              <Image
                src={image}
                alt={`Producto ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 120px"
                className="object-cover"
                unoptimized
              />
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-zinc-900 text-white text-xs font-medium rounded">
                  Principal
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <div className="absolute top-2 left-2">
                  <GripVertical className="w-5 h-5 text-white/70" />
                </div>
                
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAsPrimary(index)}
                    className="h-8 text-xs"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Principal
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add More Placeholder */}
          {images.length < maxImages && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed border-zinc-300",
                "flex flex-col items-center justify-center gap-1 cursor-pointer",
                "hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              )}
            >
              <ImageIcon className="w-6 h-6 text-zinc-400" />
              <span className="text-xs text-zinc-500">Agregar</span>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {images.length > 1 && (
        <p className="text-xs text-zinc-500 text-center">
          Arrastra las imagenes para reordenarlas. La primera sera la imagen principal.
        </p>
      )}
    </div>
  );
}
