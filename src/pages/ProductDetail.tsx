import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const product = products.find((p) => p.id === id);
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
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

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/shop" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 animate-fade-in">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-elevated hover-glow">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover hover-scale"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>

            <div className="border-t border-b py-6">
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              {product.material && (
                <p className="text-sm text-muted-foreground mt-4">
                  <span className="font-semibold">Material:</span> {product.material}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full shadow-gold hover-glow"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <div className="flex gap-3">
                <Button 
                  variant={inWishlist ? "default" : "outline"} 
                  size="lg" 
                  className={cn("flex-1 hover-glow", inWishlist && "shadow-gold")}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("mr-2 h-5 w-5", inWishlist && "fill-current")} />
                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" size="lg" className="flex-1 hover-glow">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6">
              <h3 className="font-semibold text-lg">Product Features:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Crafted with 18K gold</li>
                <li>• Genuine diamonds and gemstones</li>
                <li>• Comes with authenticity certificate</li>
                <li>• Elegant gift packaging included</li>
                <li>• 1-year warranty coverage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
