
import CategoryPage from "@/components/pages/CategoryPage";

export const metadata = {
  title: "Popular Products | GLOW",
  description: "Browse our most popular items loved by customers.",
};

export default function Page() {
  return <CategoryPage type="popular" />;
}
