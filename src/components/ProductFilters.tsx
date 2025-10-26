import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface ProductFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onReset: () => void;
}

const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Sets"];
const materials = ["Gold", "Silver", "Diamond", "Platinum", "Rose Gold"];

const ProductFilters = ({
  selectedCategories,
  setSelectedCategories,
  selectedMaterials,
  setSelectedMaterials,
  priceRange,
  setPriceRange,
  onReset,
}: ProductFiltersProps) => {
  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(material)
        ? selectedMaterials.filter((m) => m !== material)
        : [...selectedMaterials, material]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Category</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label
                htmlFor={category}
                className="text-sm cursor-pointer hover:text-primary transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Material</Label>
        <div className="space-y-3">
          {materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <label
                htmlFor={material}
                className="text-sm cursor-pointer hover:text-primary transition-colors"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Price Range</Label>
        <div className="space-y-4 pt-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={500000}
            step={5000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
