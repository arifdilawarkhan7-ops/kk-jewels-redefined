import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Diamond, Sparkles, TrendingUp, Users } from "lucide-react";

const Partner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    location: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect to your external backend API
    console.log("Partner form submitted:", formData);
    
    toast.success("Thank you! We'll contact you soon.");
    setFormData({ name: "", email: "", business: "", location: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Partner with KK Jewellers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Feature your jewelry collection on KK Jewellers and reach luxury-focused buyers globally
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg bg-card border border-border hover-glow">
            <Diamond className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Premium Platform</h3>
            <p className="text-sm text-muted-foreground">Showcase on a luxury jewelry marketplace</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover-glow">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
            <p className="text-sm text-muted-foreground">Access to international jewelry enthusiasts</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover-glow">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Grow Sales</h3>
            <p className="text-sm text-muted-foreground">Increase revenue through our platform</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover-glow">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Brand Visibility</h3>
            <p className="text-sm text-muted-foreground">Enhance your jewelry brand presence</p>
          </div>
        </div>

        {/* Partnership Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Apply for Partnership</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="business">Business Name *</Label>
                <Input
                  id="business"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Tell us about your jewelry collection</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="mt-2"
                  placeholder="Share details about your products, experience, and what makes your jewelry unique..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full shadow-gold">
                Submit Partnership Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
