import { formatArs, buildWhatsAppUrl } from "@/lib/format";

type Product = {
  name: string;
  model: string;
  color: string;
  storage: number;
  condition: string;
  priceArs: { toString(): string } | number | string;
  stock: number;
  images: { url: string }[];
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491112345678";

export function ProductCard({ product }: { product: Product }) {
  const message = `Hola Apple La Union, quiero consultar por ${product.name} ${product.storage}GB (${product.color}).`;
  const imageUrl = product.images[0]?.url;

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={product.name} className="h-52 w-full rounded-xl object-cover" />
      ) : (
        <div className="h-52 w-full rounded-xl bg-zinc-800" />
      )}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-zinc-300">
          {product.model} - {product.storage}GB - {product.color}
        </p>
        <p className="text-sm text-zinc-400">Estado: {product.condition}</p>
        <p className="text-xl font-bold">{formatArs(product.priceArs.toString())}</p>
        <p className="text-xs text-zinc-400">Stock disponible: {product.stock}</p>
      </div>
      <a
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
        href={buildWhatsAppUrl(WHATSAPP_NUMBER, message)}
        target="_blank"
        rel="noreferrer"
      >
        Consultar por WhatsApp
      </a>
    </article>
  );
}
