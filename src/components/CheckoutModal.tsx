
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useSupabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  deliveryCharges: number;
  onOrderSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  deliveryCharges,
  onOrderSuccess,
}) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const createOrderMutation = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name || !customerData.phone || !customerData.address) {
      return;
    }

    const orderData = {
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      customer_email: customerData.email,
      customer_address: customerData.address,
      order_items: cartItems,
      total_amount: totalAmount + deliveryCharges,
      delivery_charges: deliveryCharges,
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      
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
        `Subtotal: ₹${totalAmount}\n` +
        `Delivery: ₹${deliveryCharges}\n` +
        `*Total: ₹${totalAmount + deliveryCharges}*\n\n` +
        `Please confirm this order. Thank you! 🙏`;

      const whatsappURL = `https://wa.me/917696400902?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        onOrderSuccess();
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Complete Your Order
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>₹{deliveryCharges}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">₹{totalAmount + deliveryCharges}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg">Delivery Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Full Name *
                </label>
                <Input
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number *
                </label>
                <Input
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email (Optional)
              </label>
              <Input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Delivery Address *
              </label>
              <Textarea
                value={customerData.address}
                onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your complete delivery address"
                rows={3}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? 'Processing...' : 'Place Order & Continue to WhatsApp'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutModal;
