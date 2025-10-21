import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Gem, Heart } from "lucide-react";

const collections = [
  {
    name: "Necklaces",
    icon: Sparkles,
    description: "Elegant pendants and chains",
    path: "/shop?category=necklaces",
    color: "from-primary to-accent",
  },
  {
    name: "Rings",
    icon: Crown,
    description: "Engagement & wedding bands",
    path: "/shop?category=rings",
    color: "from-secondary to-primary",
  },
  {
    name: "Earrings",
    icon: Gem,
    description: "Studs, hoops & drops",
    path: "/shop?category=earrings",
    color: "from-accent to-primary",
  },
  {
    name: "Bracelets",
    icon: Heart,
    description: "Tennis & charm bracelets",
    path: "/shop?category=bracelets",
    color: "from-primary to-secondary",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted jewelry pieces designed to complement your unique style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <Link
                key={collection.name}
                to={collection.path}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-card border shadow-soft hover:shadow-gold transition-all duration-300 p-8 text-center">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{collection.name}</h3>
                    <p className="text-muted-foreground mb-4">{collection.description}</p>
                    <Button
                      variant="ghost"
                      className="group-hover:text-primary transition-colors"
                    >
                      View Collection →
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
