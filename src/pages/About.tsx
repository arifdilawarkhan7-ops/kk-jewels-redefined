import { Award, Heart, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About KK Jewellers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Crafting timeless elegance through exquisite jewelry since generations
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-lg shadow-soft border p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                KK Jewellers was founded with a vision to bring the finest craftsmanship and timeless elegance
                to jewelry lovers across India. Our journey began decades ago with a commitment to quality,
                authenticity, and exceptional customer service.
              </p>
              <p>
                Every piece in our collection is carefully designed and crafted by master artisans who pour
                their heart and soul into creating jewelry that tells a story. We use only the finest materials—
                18K gold, genuine diamonds, and precious gemstones—to ensure each piece is a treasured heirloom
                that can be passed down through generations.
              </p>
              <p>
                Today, KK Jewellers stands as a symbol of trust and elegance, serving thousands of satisfied
                customers who choose us for life's most precious moments. From engagement rings to anniversary
                gifts, we're honored to be part of your special celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Master Craftsmanship",
                description: "Every piece is handcrafted by skilled artisans with decades of experience",
              },
              {
                icon: Shield,
                title: "Certified Authenticity",
                description: "All jewelry comes with authenticity certificates and quality guarantees",
              },
              {
                icon: Heart,
                title: "Customer First",
                description: "Your satisfaction is our priority, with personalized service and care",
              },
              {
                icon: Sparkles,
                title: "Timeless Designs",
                description: "Classic elegance meets contemporary style in our curated collections",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-card border shadow-soft hover:shadow-gold transition-all"
                >
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-maroon text-secondary-foreground rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto text-secondary-foreground/90">
            To create jewelry that celebrates life's most precious moments, combining traditional craftsmanship
            with modern design to bring joy and elegance to every customer we serve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
