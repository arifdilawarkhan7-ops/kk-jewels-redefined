import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Package, DollarSign, Users, Settings, BarChart3 } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // TODO: Replace with secure backend authentication
  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Dashboard");
    } else {
      toast.error("Invalid password");
    }
  };

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    productType: "local",
    affiliateUrl: "",
    description: ""
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to external backend
    console.log("Product data:", productForm);
    toast.success("Product saved (connect to backend)");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">Enter password to access dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Note: Connect to secure backend authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your jewelry store</p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="ads">
              <DollarSign className="h-4 w-4 mr-2" />
              Ads
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Users className="h-4 w-4 mr-2" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Settings className="h-4 w-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Add/Edit Product</CardTitle>
                <CardDescription>Manage affiliate, dropshipping, or local products</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Product Type</Label>
                    <Select
                      value={productForm.productType}
                      onValueChange={(value) => setProductForm({...productForm, productType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Product</SelectItem>
                        <SelectItem value="affiliate">Affiliate Product</SelectItem>
                        <SelectItem value="dropshipping">Dropshipping Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {productForm.productType === 'affiliate' && (
                    <div>
                      <Label>Affiliate URL</Label>
                      <Input
                        type="url"
                        value={productForm.affiliateUrl}
                        onChange={(e) => setProductForm({...productForm, affiliateUrl: e.target.value})}
                        placeholder="https://amazon.com/..."
                      />
                    </div>
                  )}

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">Save Product</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle>Ad Management</CardTitle>
                <CardDescription>Configure ad placements and scripts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Google AdSense Code</Label>
                  <Textarea placeholder="Paste your AdSense script here" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Ad Positions</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Top Banner</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Sidebar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Inline Content</span>
                    </label>
                  </div>
                </div>
                <Button>Save Ad Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Leads</CardTitle>
                <CardDescription>View and manage jeweler applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Connect to external backend to view leads
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Customization</CardTitle>
                <CardDescription>Adjust colors and animations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Primary Gold Color</Label>
                  <Input type="color" defaultValue="#D4AF37" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked id="animations" />
                  <Label htmlFor="animations">Enable Animations</Label>
                </div>
                <Button>Save Theme</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Site Analytics</CardTitle>
                <CardDescription>Connect Google Analytics for insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Google Analytics Tracking ID</Label>
                    <Input placeholder="G-XXXXXXXXXX" />
                  </div>
                  <Button>Connect Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
