
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

    // Generate WhatsApp message
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
      `Please confirm this order. Thank you! 🙏`;

    const whatsappURL = `https://wa.me/917696400902?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Clear cart and redirect to WhatsApp
    onClearCart();
    window.open(whatsappURL, '_blank');
    
    toast({
      title: "Order Placed!",
      description: "You'll be redirected to WhatsApp for order confirmation.",
    });
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
              Back to Shop
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>

          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
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
            Back to Shop
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Shopping Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Items</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onClearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                      <p className="text-green-600 font-bold text-xl">₹{item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">₹{item.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className={finalDeliveryCharges === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {finalDeliveryCharges === 0 ? 'FREE' : `₹${finalDeliveryCharges}`}
                  </span>
                </div>
                {subtotal < freeDeliveryMin && (
                  <p className="text-sm text-orange-600">
                    Add ₹{freeDeliveryMin - subtotal} more for free delivery!
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email (Optional)</label>
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address *</label>
                  <Textarea
                    value={customerData.address}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    required
                  />
                </div>
                
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
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
    </div>
  );
};

export default Cart;
