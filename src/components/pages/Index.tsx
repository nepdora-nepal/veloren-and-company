import { HeroSection } from "@/components/home/HeroSection";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedBrand } from "@/components/home/FeaturedBrand";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { PromoBanners } from "@/components/home/PromoBanners";
import { BestSellers } from "@/components/home/BestSellers";
import { RoutineBuilder } from "@/components/home/RoutineBuilder";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <CategoryStrip />
        <TrendingProducts />
        <FeaturedBrand />
        <PromoBanners />
        <BestSellers />
        <RoutineBuilder />
      </main>
    </div>
  );
};

export default Index;
