import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const prismaDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(prismaDir, "..");

loadEnv({ path: path.join(root, ".env") });
loadEnv({ path: path.join(root, "src", ".env"), override: true });
