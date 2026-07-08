import path from "node:path";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Prefixo exigido pelo multi-zone: evita conflito dos assets desta zona
  // com os assets das outras zonas servidas no mesmo domínio
  assetPrefix: "/dashboard-static",
  transpilePackages: ["@vault/ui", "@vault/shared"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // O mock de dados é lido/escrito via fs em runtime; garante que ele
  // seja copiado para o build standalone
  outputFileTracingIncludes: {
    "/api/*": ["app/utils/transactions.json"],
  },
};

export default withNextIntl(nextConfig);
