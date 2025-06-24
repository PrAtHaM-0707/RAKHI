
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Phone, Mail, MessageCircle, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: Review[];
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Traditional Gold Rakhi",
    price: 299,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    description: "Beautiful traditional gold-plated rakhi with intricate designs. Perfect for your beloved brother.",
    rating: 4.5,
    reviews: [],
    category: "Traditional"
  },
  {
    id: 2,
    name: "Designer Pearl Rakhi",
    price: 399,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
    description: "Elegant pearl rakhi with designer patterns. A symbol of pure love and protection.",
    rating: 4.8,
    reviews: [],
    category: "Designer"
  },
  {
    id: 3,
    name: "Kids Cartoon Rakhi",
    price: 199,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
    description: "Fun cartoon character rakhi specially designed for kids. Colorful and attractive.",
    rating: 4.3,
    reviews: [],
    category: "Kids"
  },
  {
    id: 4,
    name: "Silver Thread Rakhi",
    price: 249,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    description: "Classic silver thread rakhi with traditional motifs. Timeless elegance.",
    rating: 4.6,
    reviews: [],
    category: "Traditional"
  },
  {
    id: 5,
    name: "Premium Kundan Rakhi",
    price: 599,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
    description: "Luxurious kundan rakhi with precious stones. For the most special brother.",
    rating: 4.9,
    reviews: [],
    category: "Premium"
  },
  {
    id: 6,
    name: "Eco-Friendly Rakhi",
    price: 149,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
    description: "Environment-friendly rakhi made from natural materials. Show love for nature too.",
    rating: 4.2,
    reviews: [],
    category: "Eco-Friendly"
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productReviews, setProductReviews] = useState<{[key: number]: Review[]}>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('rakhiReviews');
    if (savedReviews) {
      setProductReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Save reviews to localStorage whenever productReviews changes
  useEffect(() => {
    localStorage.setItem('rakhiReviews', JSON.stringify(productReviews));
  }, [productReviews]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Updated Cart",
          description: `Increased quantity of ${product.name}`,
        });
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    const product = cart.find(item => item.id === productId);
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Removed from Cart",
      description: `${product?.name} has been removed from your cart`,
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryCharges = () => {
    const totalQuantity = getTotalQuantity();
    return totalQuantity >= 5 ? 0 : 50;
  };

  const addReview = (productId: number) => {
    if (!newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };

    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review]
    }));

    setNewReview({ rating: 5, comment: '' });
    toast({
      title: "Review Added",
      description: "Thank you for your review!",
    });
  };

  const getAverageRating = (productId: number) => {
    const reviews = productReviews[productId] || [];
    if (reviews.length === 0) return products.find(p => p.id === productId)?.rating || 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before buying",
        variant: "destructive"
      });
      return;
    }

    setRedirectCountdown(5);
    toast({
      title: "Redirecting to WhatsApp",
      description: "You will be redirected to WhatsApp for order confirmation in 5 seconds",
    });

    const interval = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Create WhatsApp message
          const orderDetails = cart.map(item => 
            `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
          ).join('\n');
          
          const total = getTotalPrice();
          const delivery = getDeliveryCharges();
          const finalTotal = total + delivery;
          
          const message = `🎉 New Rakhi Order 🎉\n\n${orderDetails}\n\nSubtotal: ₹${total}\nDelivery: ₹${delivery}\nTotal: ₹${finalTotal}\n\nPlease confirm this order!`;
          
          const whatsappUrl = `https://wa.me/9123456789?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          
          setRedirectCountdown(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const StarRating = ({ rating, onRatingChange, readonly = true }: { rating: number, onRatingChange?: (rating: number) => void, readonly?: boolean }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                RakhiMart
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setIsContactOpen(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                    {getTotalQuantity()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Celebrate Raksha Bandhan
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Express your love with our beautiful collection of Rakhis. From traditional to modern designs, find the perfect Rakhi for your beloved brother.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 inline-block shadow-lg">
            <p className="text-lg font-semibold text-orange-600">🚚 Free Delivery on orders of 5+ Rakhis</p>
            <p className="text-sm text-gray-600">Delivery charges: ₹50 for orders below 5 Rakhis</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Rakhi Collection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedProduct(product)}
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500">
                    {product.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <StarRating rating={getAverageRating(product.id)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{product.description.substring(0, 100)}...</p>
                </CardContent>
                <CardFooter className="space-y-2">
                  <Button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
              <Button variant="ghost" onClick={() => setSelectedProduct(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <Badge className="bg-orange-500">{selectedProduct.category}</Badge>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">₹{selectedProduct.price}</span>
                    <StarRating rating={getAverageRating(selectedProduct.id)} />
                  </div>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => addToCart(selectedProduct)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="mt-8 border-t pt-8">
                <h4 className="text-xl font-bold mb-4">Reviews & Ratings</h4>
                
                {/* Add Review */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold mb-3">Add Your Review</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <StarRating 
                        rating={newReview.rating} 
                        onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                        readonly={false}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Comment</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience..."
                        className="w-full"
                      />
                    </div>
                    <Button onClick={() => addReview(selectedProduct.id)}>
                      Submit Review
                    </Button>
                  </div>
                </div>
                
                {/* Display Reviews */}
                <div className="space-y-4">
                  {(productReviews[selectedProduct.id] || []).map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  {(!productReviews[selectedProduct.id] || productReviews[selectedProduct.id].length === 0) && (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Shopping Cart</h3>
              <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <p className="text-green-600 font-bold">₹{item.price}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-3 py-1 bg-white rounded border">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold">₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className={`font-bold ${getDeliveryCharges() === 0 ? 'text-green-600' : ''}`}>
                        {getDeliveryCharges() === 0 ? 'FREE' : `₹${getDeliveryCharges()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>₹{getTotalPrice() + getDeliveryCharges()}</span>
                    </div>
                    
                    {getTotalQuantity() < 5 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                        <p className="text-sm text-orange-700">
                          Add {5 - getTotalQuantity()} more Rakhi(s) for FREE delivery!
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6 space-y-3">
                      {redirectCountdown > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                          <p className="text-blue-700 font-medium">
                            Redirecting to WhatsApp in {redirectCountdown} seconds...
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleBuyNow}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        disabled={redirectCountdown > 0}
                      >
                        {redirectCountdown > 0 ? `Redirecting... ${redirectCountdown}` : 'Buy Now'}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        * You will be redirected to WhatsApp for order confirmation
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <Button variant="ghost" onClick={() => setIsContactOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <a 
                  href="https://wa.me/9123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">+91 91234 56789</p>
                  </div>
                </a>
                
                <a 
                  href="mailto:orders@rakhimart.com"
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">orders@rakhimart.com</p>
                  </div>
                </a>
                
                <a 
                  href="tel:+919123456789"
                  className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Phone className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+91 91234 56789</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">R</span>
            </div>
            <h3 className="text-2xl font-bold">RakhiMart</h3>
          </div>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Celebrating the bond of love with our exquisite collection of Rakhis. 
            Making every Raksha Bandhan special with quality products and heartfelt service.
          </p>
          <div className="flex flex-wrap justify-center items-center space-x-6 mb-6">
            <a href="https://wa.me/9123456789" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-orange-200">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a href="mailto:orders@rakhimart.com" className="flex items-center space-x-2 hover:text-orange-200">
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a href="tel:+919123456789" className="flex items-center space-x-2 hover:text-orange-200">
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </a>
          </div>
          <p className="text-orange-200 text-sm">
            © 2024 RakhiMart. Made with ❤️ for siblings everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
