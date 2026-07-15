import path from "node:path";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Zona default do multi-zone: roteia os paths do dashboard para a outra zona.
// A barra final é removida para o destino dos rewrites não virar "//dashboard".
const DASHBOARD_URL = (
  process.env.DASHBOARD_URL ?? "http://localhost:3001"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@vault/ui", "@vault/shared"],
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: `${DASHBOARD_URL}/dashboard`,
      },
      {
        source: "/dashboard/:path+",
        destination: `${DASHBOARD_URL}/dashboard/:path+`,
      },
      {
        source: "/en/dashboard",
        destination: `${DASHBOARD_URL}/en/dashboard`,
      },
      {
        source: "/en/dashboard/:path+",
        destination: `${DASHBOARD_URL}/en/dashboard/:path+`,
      },
      {
        source: "/dashboard-static/:path+",
        destination: `${DASHBOARD_URL}/dashboard-static/:path+`,
      },
      {
        source: "/api/transactions",
        destination: `${DASHBOARD_URL}/api/transactions`,
      },
      {
        source: "/api/transactions/:path+",
        destination: `${DASHBOARD_URL}/api/transactions/:path+`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
