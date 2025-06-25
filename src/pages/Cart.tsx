import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartPageProps> = ({ 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = React.useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);
  const countdownRef = React.useRef<NodeJS.Timeout>();

  const deliveryCharges = 50;
  const freeDeliveryMin = 200;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalDeliveryCharges = subtotal >= freeDeliveryMin ? 0 : deliveryCharges;
  const total = subtotal + finalDeliveryCharges;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const checkWhatsAppInstalled = () => {
    if (navigator.userAgent.match(/Android/i)) {
      try {
        window.location.href = 'intent://send/';
        return true;
      } catch (e) {
        return false;
      }
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      try {
        window.location.href = 'whatsapp://send/';
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const generateWhatsAppURL = () => {
    const orderDetails = cartItems.map(item => 
      `• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
    ).join('\n');
    
    const whatsappMessage = `🛍️ *New Order from RakhiMart*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${customerData.name}\n` +
      `Phone: ${customerData.phone}\n` +
      `Email: ${customerData.email || 'Not provided'}\n` +
      `Address: ${customerData.address}\n\n` +
      `*Order Items:*\n${orderDetails}\n\n` +
      `*Order Summary:*\n` +
      `Subtotal: ₹${subtotal}\n` +
      `Delivery: ₹${finalDeliveryCharges}\n` +
      `*Total: ₹${total}*\n\n` +
      `Please confirm this order. Thank you!`;

    const isWhatsAppInstalled = checkWhatsAppInstalled();
    const phoneNumber = '919872130902';
    
    if (isWhatsAppInstalled) {
      return `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    } else {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }
  };

  const startCountdown = () => {
    setShowConfirmation(true);
    setCountdown(5);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          redirectToWhatsApp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelRedirect = () => {
    clearInterval(countdownRef.current);
    setShowConfirmation(false);
  };

  const redirectToWhatsApp = () => {
    clearInterval(countdownRef.current);
    setShowConfirmation(false);
    
    const whatsappURL = generateWhatsAppURL();
    onClearCart();
    window.open(whatsappURL, '_blank');
    
    toast({
      title: "Order Placed!",
      description: "You've been redirected to WhatsApp for order confirmation.",
    });
  };

  const handleBuyNow = () => {
    if (!customerData.name || !customerData.phone || !customerData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Phone, Address)",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive"
      });
      return;
    }

    startCountdown();
  };

   if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Shop</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>

          <div className="text-center py-16">
            <ShoppingCart className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some beautiful rakhis to get started!</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Shop</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Shopping Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Your Items</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onClearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Clear Cart</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 p-2 sm:p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Square image container */}
                    <div className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full space-y-2">
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{item.name}</h3>
                      
                      {/* Price breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-600">Unit Price:</p>
                          <p className="text-gray-600">Quantity:</p>
                          <p className="text-gray-600">Total:</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-green-600 font-medium">₹{item.price.toFixed(2)}</p>
                          <p className="font-medium">{item.quantity}</p>
                          <p className="text-green-600 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="font-semibold text-base w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Delivery Charges:</span>
                  <span className={finalDeliveryCharges === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {finalDeliveryCharges === 0 ? 'FREE' : `₹${finalDeliveryCharges.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < freeDeliveryMin && (
                  <p className="text-xs sm:text-sm text-orange-600">
                    Add ₹{(freeDeliveryMin - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Full Name *</label>
                  <Input
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Phone Number *</label>
                  <Input
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Email (Optional)</label>
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="text-sm sm:text-base"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Delivery Address *</label>
                  <Textarea
                    value={customerData.address}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-base sm:text-lg py-5 sm:py-6"
                  size="lg"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Buy Now via WhatsApp
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  You'll be redirected to WhatsApp to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-[95%] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              You'll be redirected to WhatsApp in {countdown} seconds for order confirmation.
              <br /><br />
              Please make sure all your details are correct before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRedirect} className="text-sm sm:text-base">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={redirectToWhatsApp}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm sm:text-base"
            >
              Proceed Now ({countdown})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cart;