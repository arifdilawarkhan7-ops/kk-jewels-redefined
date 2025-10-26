import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange([0, 500000]);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()));
    
    const matchesMaterial = selectedMaterials.length === 0 || 
      selectedMaterials.some(mat => product.material?.toLowerCase().includes(mat.toLowerCase()));
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesMaterial && matchesPrice && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.id.localeCompare(a.id);
      case "best-sellers":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Collection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our exquisite range of handcrafted jewelry pieces
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-lg border shadow-soft">
              <ProductFilters
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <div className="py-6">
                    <ProductFilters
                      selectedCategories={selectedCategories}
                      setSelectedCategories={setSelectedCategories}
                      selectedMaterials={selectedMaterials}
                      setSelectedMaterials={setSelectedMaterials}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      onReset={handleResetFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Results Count & Sort */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                <p className="text-sm text-muted-foreground">
                  {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-xl text-muted-foreground mb-4">
                  No products found matching your criteria.
                </p>
                <Button onClick={handleResetFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
