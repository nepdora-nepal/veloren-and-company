import CategoryPage from "@/components/pages/CategoryPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  await params;
  
  return <CategoryPage />;
}
