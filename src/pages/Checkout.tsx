import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  phone: z.string()
    .trim()
    .regex(/^[\+]?[1-9]\d{9,14}$/, "Invalid phone number (e.g., +919876543210)"),
  address: z.string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long"),
  city: z.string()
    .trim()
    .min(2, "City name is too short")
    .max(100, "City name is too long"),
  pincode: z.string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  paymentMethod: z.enum(["card", "netbanking", "upi", "wallet", "emi", "cod", "paypal", "giftcard"]),
});

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: "card" | "netbanking" | "upi" | "wallet" | "emi" | "cod" | "paypal" | "giftcard";
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "card",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (field: string, value: any) => {
    try {
      checkoutSchema.shape[field as keyof typeof checkoutSchema.shape].parse(value);
      setErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    try {
      const validated = checkoutSchema.parse(formData);
      setErrors({});
      setIsProcessing(true);

      // Simulate order processing with payment verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save order to localStorage (in real app, send to backend with payment gateway)
      const order = {
        id: `ORD-${Date.now()}`,
        orderNumber: `KKJ${Date.now().toString().slice(-8)}`,
        customer: validated,
        items: cart,
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
        status: "pending",
        paymentStatus: validated.paymentMethod === "cod" ? "pending" : "paid",
        date: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem("kkj-orders") || "[]");
      orders.push(order);
      localStorage.setItem("kkj-orders", JSON.stringify(orders));

      clearCart();
      setIsProcessing(false);

      toast.success("Order placed successfully!", {
        description: `Order ${order.orderNumber} confirmed. Check your email for details.`,
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        
        toast.error("Please fix the errors in the form", {
          description: error.errors[0].message,
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-soft border p-8">
              <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>

              <div className="space-y-6">
                {/* Payment Method Selection - Amazon Style */}
                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                  <Label className="text-lg font-semibold mb-4 block">Choose Payment Method *</Label>
                  <div className="space-y-3">
                    {/* Credit/Debit Cards */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "card" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "card"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            Credit or Debit Card
                            <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded">Recommended</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Visa, Mastercard, Amex, Rupay, Diners Club
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-8 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                          <div className="w-8 h-6 bg-gradient-to-br from-red-600 to-orange-600 rounded flex items-center justify-center">
                            <div className="flex gap-0.5">
                              <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
                              <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Net Banking */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "netbanking" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "netbanking"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Net Banking</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        All major banks - HDFC, ICICI, SBI, Axis & more
                      </div>
                    </button>

                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "upi" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "upi"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">UPI</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Google Pay, PhonePe, Paytm & more
                          </div>
                        </div>
                        <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-semibold">
                          INSTANT
                        </div>
                      </div>
                    </button>

                    {/* Wallets */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "wallet" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "wallet"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Wallets</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Amazon Pay, Paytm Wallet, PhonePe Wallet
                      </div>
                    </button>

                    {/* EMI */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "emi" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "emi"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-2">
                        EMI (Easy Installments)
                        <span className="text-xs text-primary">Starting ₹2,000/month</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Credit Card EMI, Debit Card EMI & Cardless EMI
                      </div>
                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cod" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "cod"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Cash on Delivery (COD)</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Pay when you receive • Cash, UPI or Card accepted
                      </div>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "paypal" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "paypal"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-2">
                        PayPal
                        <span className="text-xs text-muted-foreground">International</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Fast & secure international payments
                      </div>
                    </button>

                    {/* Gift Card */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "giftcard" }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === "giftcard"
                          ? "border-primary bg-primary/5 shadow-gold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Gift Card or Promotional Code</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Redeem your gift card or enter promotional code
                      </div>
                    </button>
                  </div>

                  {/* Payment Security Notice */}
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your payment information is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => validateField("name", formData.name)}
                    className={errors.name ? "border-destructive" : ""}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => validateField("email", formData.email)}
                      className={errors.email ? "border-destructive" : ""}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => validateField("phone", formData.phone)}
                      className={errors.phone ? "border-destructive" : ""}
                      placeholder="+919876543210"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="flex justify-between">
                    <span>Address *</span>
                    <span className="text-xs text-muted-foreground">{formData.address.length}/500</span>
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={() => validateField("address", formData.address)}
                    className={errors.address ? "border-destructive" : ""}
                    placeholder="Street address, apartment, suite, etc."
                    maxLength={500}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => validateField("city", formData.city)}
                      className={errors.city ? "border-destructive" : ""}
                      placeholder="Mumbai"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onBlur={() => validateField("pincode", formData.pincode)}
                      className={errors.pincode ? "border-destructive" : ""}
                      placeholder="400001"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-gold"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-elevated border p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground/80">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-semibold">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
