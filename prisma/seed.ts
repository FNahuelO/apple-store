import "./load-env";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { getDefaultSiteSettings } from "../src/lib/site-settings";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no configurado");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const productsSeed = [
  {
    sku: "IP15P-256-NT-BLK",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    model: "iPhone 15 Pro",
    color: "Titanio negro",
    storage: 256,
    batteryHealth: 100,
    condition: "Nuevo sellado",
    priceArs: "2299000.00",
    stock: 3,
    featured: true,
    description:
      "iPhone 15 Pro con chip A17 Pro, cámara profesional de 48MP y acabado en titanio.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 15 Pro titanio negro frente",
        order: 0,
      },
    ],
  },
  {
    sku: "IP14-128-RFB-BLU",
    name: "iPhone 14 128GB",
    brand: "Apple",
    model: "iPhone 14",
    color: "Azul",
    storage: 128,
    batteryHealth: 94,
    condition: "Reacondicionado premium",
    priceArs: "1249000.00",
    stock: 5,
    featured: true,
    description:
      "Equipo reacondicionado con batería en excelente estado y garantía local.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1663761876504-5f2e2a8f9664?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 14 azul vista trasera",
        order: 0,
      },
    ],
  },
  {
    sku: "IP13-128-USD-MDN",
    name: "iPhone 13 128GB",
    brand: "Apple",
    model: "iPhone 13",
    color: "Medianoche",
    storage: 128,
    batteryHealth: 88,
    condition: "Usado excelente",
    priceArs: "999000.00",
    stock: 4,
    featured: false,
    description:
      "iPhone 13 usado en excelente estado estético, sin bloqueos y listo para usar.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1632661674596-618e6f8a7f8a?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 13 color medianoche",
        order: 0,
      },
    ],
  },
  {
    sku: "IP12-64-USD-WHT",
    name: "iPhone 12 64GB",
    brand: "Apple",
    model: "iPhone 12",
    color: "Blanco",
    storage: 64,
    batteryHealth: 85,
    condition: "Usado muy bueno",
    priceArs: "799000.00",
    stock: 6,
    featured: false,
    description:
      "iPhone 12 liberado, ideal para primer iPhone o renovación con presupuesto cuidado.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 12 blanco",
        order: 0,
      },
    ],
  },
  {
    sku: "IPSE3-64-USD-RED",
    name: "iPhone SE 3ra Gen 64GB",
    brand: "Apple",
    model: "iPhone SE (3ra gen)",
    color: "Rojo",
    storage: 64,
    batteryHealth: 90,
    condition: "Usado excelente",
    priceArs: "649000.00",
    stock: 2,
    featured: false,
    description:
      "Compacto y potente con chip A15 Bionic, Touch ID y gran rendimiento diario.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone SE rojo",
        order: 0,
      },
    ],
  },
  {
    sku: "IP15-128-NT-PNK",
    name: "iPhone 15 128GB",
    brand: "Apple",
    model: "iPhone 15",
    color: "Rosa",
    storage: 128,
    batteryHealth: 100,
    condition: "Nuevo sellado",
    priceArs: "1799000.00",
    stock: 3,
    featured: true,
    description:
      "Pantalla Super Retina XDR, Dynamic Island y cámara principal de 48MP.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1696253671478-8f95d6b11d0f?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 15 rosa",
        order: 0,
      },
    ],
  },
  {
    sku: "IP14PM-256-USD-PRP",
    name: "iPhone 14 Pro Max 256GB",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    color: "Morado oscuro",
    storage: 256,
    batteryHealth: 92,
    condition: "Usado excelente",
    priceArs: "1699000.00",
    stock: 1,
    featured: true,
    description:
      "Pantalla grande, autonomía destacada y sistema de cámaras profesional.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1664478546384-5163f744f2c8?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 14 Pro Max morado",
        order: 0,
      },
    ],
  },
  {
    sku: "IP11-128-USD-BLK",
    name: "iPhone 11 128GB",
    brand: "Apple",
    model: "iPhone 11",
    color: "Negro",
    storage: 128,
    batteryHealth: 82,
    condition: "Usado bueno",
    priceArs: "559000.00",
    stock: 7,
    featured: false,
    description:
      "Excelente opción calidad-precio con cámara dual y rendimiento sólido.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1200&q=80",
        alt: "iPhone 11 negro",
        order: 0,
      },
    ],
  },
];

/** Teléfonos fijos de demo: al re-ejecutar el seed se borran y recrean estas filas. */
const DEMO_TRADE_IN_PHONES = ["5493516001001", "5493516001002", "5493516001003"] as const;

/** Valores de `condition` alineados con el formulario público `/canje` (Select). */
const tradeInsSeed = [
  {
    fullName: "María González",
    phone: DEMO_TRADE_IN_PHONES[0],
    email: "maria.demo@ejemplo.com",
    city: "La Unión",
    brand: "Apple",
    model: "iPhone 13",
    storage: "128GB",
    condition: "excelente",
    batteryHealth: 88,
    details: "Caja original, sin reparaciones. Pantalla impecable.",
    desiredModel: "iPhone 15 128GB",
    status: "PENDING" as const,
  },
  {
    fullName: "Lucas Fernández",
    phone: DEMO_TRADE_IN_PHONES[1],
    email: "lucas.demo@ejemplo.com",
    city: "Córdoba",
    brand: "Apple",
    model: "iPhone 12",
    storage: "64GB",
    condition: "muy-bueno",
    batteryHealth: 85,
    details: "Pequeñas marcas en marco. Batería original.",
    desiredModel: "iPhone 14",
    status: "REVIEWED" as const,
  },
  {
    fullName: "Ana Ruiz",
    phone: DEMO_TRADE_IN_PHONES[2],
    email: null,
    city: "La Unión",
    brand: "Apple",
    model: "iPhone 11",
    storage: "128GB",
    condition: "bueno",
    batteryHealth: 82,
    details: "Interesada en canje por modelo más nuevo.",
    desiredModel: "iPhone 13 Pro",
    status: "PENDING" as const,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Administrador";

  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.adminUser.upsert({
      where: { email: email.toLowerCase() },
      create: {
        email: email.toLowerCase(),
        name,
        passwordHash,
      },
      update: {
        name,
        passwordHash,
      },
    });
  } else {
    console.warn(
      "ADMIN_EMAIL o ADMIN_PASSWORD no configurados. Se omite el seeding de admin."
    );
  }

  const siteRow = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!siteRow) {
    await prisma.siteSettings.create({
      id: 1,
      data: getDefaultSiteSettings(),
    });
  }

  for (const product of productsSeed) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      create: {
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        model: product.model,
        color: product.color,
        storage: product.storage,
        batteryHealth: product.batteryHealth,
        condition: product.condition,
        priceArs: product.priceArs,
        stock: product.stock,
        featured: product.featured,
        description: product.description,
        images: {
          create: product.images,
        },
      },
      update: {
        name: product.name,
        brand: product.brand,
        model: product.model,
        color: product.color,
        storage: product.storage,
        batteryHealth: product.batteryHealth,
        condition: product.condition,
        priceArs: product.priceArs,
        stock: product.stock,
        featured: product.featured,
        description: product.description,
        images: {
          deleteMany: {},
          create: product.images,
        },
      },
    });
  }

  await prisma.tradeInRequest.deleteMany({
    where: { phone: { in: [...DEMO_TRADE_IN_PHONES] } },
  });
  await prisma.tradeInRequest.createMany({ data: tradeInsSeed });

  console.log(
    `Seed listo: ${productsSeed.length} productos, ${tradeInsSeed.length} solicitudes de canje demo, admin ${
      email ? "actualizado" : "omitido"
    }.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
