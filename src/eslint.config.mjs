import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
    "components/ui/carousel.tsx",
    "components/ui/sidebar.tsx",
    "components/ui/use-mobile.tsx",
    "hooks/use-mobile.ts",
  ]),
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
