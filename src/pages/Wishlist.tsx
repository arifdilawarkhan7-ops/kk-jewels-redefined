import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground/30" />
          <h1 className="text-4xl font-bold">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Save your favorite jewelry pieces to your wishlist and shop them later.
          </p>
          <Link to="/shop">
            <Button size="lg" className="shadow-gold">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
