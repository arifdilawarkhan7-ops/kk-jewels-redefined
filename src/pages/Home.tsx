import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import AdPlaceholder from "@/components/AdPlaceholder";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";

const Home = () => {
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Jewelry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces that exemplify our commitment to quality and elegance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg" className="shadow-gold">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Trusted by thousands of jewelry lovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                text: "The most beautiful engagement ring! The craftsmanship is exceptional and the service was outstanding.",
                rating: 5,
              },
              {
                name: "Rajesh Kumar",
                text: "Bought a necklace for my wife's anniversary. She was absolutely delighted. Highly recommended!",
                rating: 5,
              },
              {
                name: "Anita Desai",
                text: "KK Jewellers has become my go-to for all special occasions. Quality and elegance combined perfectly.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-lg shadow-soft border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-primary">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-maroon text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience Luxury Like Never Before
          </h2>
          <p className="text-xl mb-8 text-secondary-foreground/90 max-w-2xl mx-auto">
            Visit our showroom or explore our collection online. Your perfect piece awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold">
                Shop Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10">
                Book an Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
