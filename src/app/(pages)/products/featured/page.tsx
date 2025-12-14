
import CategoryPage from "@/components/pages/CategoryPage";

export const metadata = {
  title: "Featured Products | GLOW",
  description: "Check out our featured beauty products.",
};

export default function Page() {
  return <CategoryPage type="featured" />;
}
