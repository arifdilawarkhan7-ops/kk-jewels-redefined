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
  // Payment-specific fields (conditionally validated)
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  bankName: z.string().optional(),
  upiId: z.string().optional(),
  walletProvider: z.string().optional(),
  emiBank: z.string().optional(),
  emiTenure: z.string().optional(),
  paypalEmail: z.string().optional(),
  giftCardCode: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validate card details if payment method is card
  if (data.paymentMethod === "card") {
    if (!data.cardNumber || !/^[0-9]{16}$/.test(data.cardNumber.replace(/\s/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card number must be 16 digits",
        path: ["cardNumber"],
      });
    }
    if (!data.cardName || data.cardName.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cardholder name is required",
        path: ["cardName"],
      });
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiry must be in MM/YY format",
        path: ["cardExpiry"],
      });
    }
    if (!data.cardCvv || !/^[0-9]{3,4}$/.test(data.cardCvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVV must be 3 or 4 digits",
        path: ["cardCvv"],
      });
    }
  }
  
  // Validate net banking
  if (data.paymentMethod === "netbanking" && !data.bankName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a bank",
      path: ["bankName"],
    });
  }
  
  // Validate UPI
  if (data.paymentMethod === "upi") {
    if (!data.upiId || !/^[\w.-]+@[\w.-]+$/.test(data.upiId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid UPI ID (e.g., name@upi)",
        path: ["upiId"],
      });
    }
  }
  
  // Validate wallet
  if (data.paymentMethod === "wallet" && !data.walletProvider) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a wallet provider",
      path: ["walletProvider"],
    });
  }
  
  // Validate EMI
  if (data.paymentMethod === "emi") {
    if (!data.emiBank) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a bank for EMI",
        path: ["emiBank"],
      });
    }
    if (!data.emiTenure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select EMI tenure",
        path: ["emiTenure"],
      });
    }
  }
  
  // Validate PayPal
  if (data.paymentMethod === "paypal") {
    if (!data.paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.paypalEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid PayPal email",
        path: ["paypalEmail"],
      });
    }
  }
  
  // Validate gift card
  if (data.paymentMethod === "giftcard") {
    if (!data.giftCardCode || data.giftCardCode.trim().length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid gift card code",
        path: ["giftCardCode"],
      });
    }
  }
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
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    cardCvv?: string;
    bankName?: string;
    upiId?: string;
    walletProvider?: string;
    emiBank?: string;
    emiTenure?: string;
    paypalEmail?: string;
    giftCardCode?: string;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const validateField = (field: string, value: any) => {
    try {
      // Validate the entire form data to trigger superRefine checks
      checkoutSchema.parse(formData);
      setErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only show error for the current field
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [field]: fieldError.message }));
          return false;
        }
      }
      return true;
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

                {/* Payment-specific Details */}
                {formData.paymentMethod === "card" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">Card Details</h3>
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber || ""}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16));
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                          if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: "" }));
                        }}
                        className={errors.cardNumber ? "border-destructive" : ""}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName || ""}
                        onChange={handleInputChange}
                        className={errors.cardName ? "border-destructive" : ""}
                        placeholder="Name on card"
                      />
                      {errors.cardName && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.cardName}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date *</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry || ""}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setFormData(prev => ({ ...prev, cardExpiry: value }));
                            if (errors.cardExpiry) setErrors(prev => ({ ...prev, cardExpiry: "" }));
                          }}
                          className={errors.cardExpiry ? "border-destructive" : ""}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.cardExpiry && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.cardExpiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV *</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          type="password"
                          value={formData.cardCvv || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setFormData(prev => ({ ...prev, cardCvv: value }));
                            if (errors.cardCvv) setErrors(prev => ({ ...prev, cardCvv: "" }));
                          }}
                          className={errors.cardCvv ? "border-destructive" : ""}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cardCvv && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.cardCvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "netbanking" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">Select Your Bank</h3>
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <select
                        id="bankName"
                        name="bankName"
                        value={formData.bankName || ""}
                        onChange={handleInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.bankName ? "border-destructive" : ""}`}
                      >
                        <option value="">Select a bank</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="other">Other Banks</option>
                      </select>
                      {errors.bankName && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.bankName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "upi" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">Enter UPI Details</h3>
                    <div>
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        name="upiId"
                        value={formData.upiId || ""}
                        onChange={handleInputChange}
                        className={errors.upiId ? "border-destructive" : ""}
                        placeholder="yourname@paytm / yourname@okicici"
                      />
                      {errors.upiId && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.upiId}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "wallet" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">Select Wallet</h3>
                    <div>
                      <Label htmlFor="walletProvider">Wallet Provider *</Label>
                      <select
                        id="walletProvider"
                        name="walletProvider"
                        value={formData.walletProvider || ""}
                        onChange={handleInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.walletProvider ? "border-destructive" : ""}`}
                      >
                        <option value="">Select a wallet</option>
                        <option value="amazonpay">Amazon Pay</option>
                        <option value="paytm">Paytm Wallet</option>
                        <option value="phonepe">PhonePe Wallet</option>
                        <option value="mobikwik">MobiKwik</option>
                        <option value="freecharge">Freecharge</option>
                      </select>
                      {errors.walletProvider && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.walletProvider}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "emi" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">EMI Options</h3>
                    <div>
                      <Label htmlFor="emiBank">Select Bank *</Label>
                      <select
                        id="emiBank"
                        name="emiBank"
                        value={formData.emiBank || ""}
                        onChange={handleInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.emiBank ? "border-destructive" : ""}`}
                      >
                        <option value="">Select bank for EMI</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="sbi">SBI Cards</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                      {errors.emiBank && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.emiBank}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="emiTenure">EMI Tenure *</Label>
                      <select
                        id="emiTenure"
                        name="emiTenure"
                        value={formData.emiTenure || ""}
                        onChange={handleInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.emiTenure ? "border-destructive" : ""}`}
                      >
                        <option value="">Select tenure</option>
                        <option value="3">3 Months (No Cost EMI)</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="12">12 Months</option>
                        <option value="18">18 Months</option>
                        <option value="24">24 Months</option>
                      </select>
                      {errors.emiTenure && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.emiTenure}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "paypal" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">PayPal Details</h3>
                    <div>
                      <Label htmlFor="paypalEmail">PayPal Email *</Label>
                      <Input
                        id="paypalEmail"
                        name="paypalEmail"
                        type="email"
                        value={formData.paypalEmail || ""}
                        onChange={handleInputChange}
                        className={errors.paypalEmail ? "border-destructive" : ""}
                        placeholder="your@paypal.com"
                      />
                      {errors.paypalEmail && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.paypalEmail}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        You'll be redirected to PayPal to complete your payment
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "giftcard" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg mb-4">Gift Card / Promo Code</h3>
                    <div>
                      <Label htmlFor="giftCardCode">Card Code *</Label>
                      <Input
                        id="giftCardCode"
                        name="giftCardCode"
                        value={formData.giftCardCode || ""}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setFormData(prev => ({ ...prev, giftCardCode: value }));
                          if (errors.giftCardCode) setErrors(prev => ({ ...prev, giftCardCode: "" }));
                        }}
                        className={errors.giftCardCode ? "border-destructive" : ""}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                      />
                      {errors.giftCardCode && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.giftCardCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border animate-fade-in">
                    <h3 className="font-semibold text-lg mb-2">Cash on Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay with cash, UPI, or card when you receive your order. Additional ₹40 handling fee may apply.
                    </p>
                  </div>
                )}

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
