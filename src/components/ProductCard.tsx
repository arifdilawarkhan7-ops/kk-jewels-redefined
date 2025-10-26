import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
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
      <div className="bg-card rounded-lg overflow-hidden product-card-hover border">
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
          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover-glow",
              inWishlist && "opacity-100"
            )}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all",
                inWishlist && "fill-primary text-primary"
              )} 
            />
          </Button>
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
            <Button className="flex-1 hover-glow" size="sm">
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              className="hover:bg-primary hover:text-primary-foreground hover-glow"
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
