import {
  Briefcase,
  Building,
  ShoppingCart,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";

export const getIcon = (name: string) => {
  const props = { className: "w-5 h-5 text-muted" };

  switch (name) {
    case "shopping":
      return <ShoppingCart {...props} />;
    case "briefcase":
      return <Briefcase {...props} className="text-brand h-5 w-5" />;
    case "utensils":
      return <Utensils {...props} />;
    case "building":
      return <Building {...props} />;
    case "trending":
      return <TrendingUp {...props} className="text-brand h-5 w-5" />;
    default:
      return <Zap {...props} />;
  }
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
