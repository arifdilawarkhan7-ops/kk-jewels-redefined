import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-gold transition-all duration-300 border">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-gold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-primary mb-4">
            {formatPrice(product.price)}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
