import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Prefixo exigido pelo multi-zone: evita conflito dos assets desta zona
  // com os assets das outras zonas servidas no mesmo domínio
  assetPrefix: "/dashboard-static",
  transpilePackages: ["@vault/ui", "@vault/shared"],
};

export default withNextIntl(nextConfig);
