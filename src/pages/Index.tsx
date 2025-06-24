import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Phone, Mail, MessageCircle, X, Plus, Minus, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  rating: number;
  reviews: Review[];
  category: string;
  stock: number;
  isOutOfStock: boolean;
  specifications: string[];
  materials: string;
  occasion: string;
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
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
    ],
    description: "Beautiful traditional gold-plated rakhi with intricate designs. Perfect for your beloved brother. Handcrafted with premium materials and adorned with sacred threads.",
    rating: 4.5,
    reviews: [],
    category: "Traditional",
    stock: 25,
    isOutOfStock: false,
    specifications: ["Gold-plated", "Handcrafted", "Sacred thread", "Traditional design"],
    materials: "Gold-plated metal, silk thread, beads",
    occasion: "Raksha Bandhan, Traditional ceremonies"
  },
  {
    id: 2,
    name: "Designer Pearl Rakhi",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
    ],
    description: "Elegant pearl rakhi with designer patterns. A symbol of pure love and protection. Features genuine pearls and intricate metalwork.",
    rating: 4.8,
    reviews: [],
    category: "Designer",
    stock: 15,
    isOutOfStock: false,
    specifications: ["Genuine pearls", "Designer pattern", "Premium finish", "Adjustable"],
    materials: "Pearls, silver-plated metal, silk",
    occasion: "Modern celebrations, Designer gifts"
  },
  {
    id: 3,
    name: "Kids Cartoon Rakhi",
    price: 199,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop"
    ],
    description: "Fun cartoon character rakhi specially designed for kids. Colorful and attractive with favorite cartoon characters that children love.",
    rating: 4.3,
    reviews: [],
    category: "Kids",
    stock: 30,
    isOutOfStock: false,
    specifications: ["Cartoon design", "Child-safe materials", "Bright colors", "Soft texture"],
    materials: "Non-toxic plastic, cotton thread, fabric",
    occasion: "Kids celebrations, Fun gifts"
  },
  {
    id: 4,
    name: "Silver Thread Rakhi",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
    ],
    description: "Classic silver thread rakhi with traditional motifs. Timeless elegance that represents the eternal bond between siblings.",
    rating: 4.6,
    reviews: [],
    category: "Traditional",
    stock: 20,
    isOutOfStock: false,
    specifications: ["Silver thread", "Traditional motifs", "Durable", "Classic design"],
    materials: "Silver thread, cotton, traditional beads",
    occasion: "Traditional celebrations, Family gatherings"
  },
  {
    id: 5,
    name: "Premium Kundan Rakhi",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
    ],
    description: "Luxurious kundan rakhi with precious stones. For the most special brother. Crafted with authentic kundan work and premium materials.",
    rating: 4.9,
    reviews: [],
    category: "Premium",
    stock: 10,
    isOutOfStock: false,
    specifications: ["Kundan work", "Precious stones", "Premium quality", "Luxury finish"],
    materials: "Kundan stones, gold-plated base, silk thread",
    occasion: "Special occasions, Premium gifts"
  },
  {
    id: 6,
    name: "Eco-Friendly Rakhi",
    price: 149,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop"
    ],
    description: "Environment-friendly rakhi made from natural materials. Show love for nature too. Biodegradable and sustainable.",
    rating: 4.2,
    reviews: [],
    category: "Eco-Friendly",
    stock: 40,
    isOutOfStock: false,
    specifications: ["Eco-friendly", "Biodegradable", "Natural materials", "Sustainable"],
    materials: "Natural fibers, organic cotton, plant-based dyes",
    occasion: "Eco-conscious celebrations, Nature lovers"
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, productReviews]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const addToCart = (product: Product) => {
    if (product.isOutOfStock || product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive"
      });
      
      setTimeout(() => {
        // This will be handled by the toast system
      }, 3000);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Stock Limit Reached",
            description: `Only ${product.stock} items available in stock`,
            variant: "destructive"
          });
          setTimeout(() => {}, 3000);
          return prevCart;
        }
        toast({
          title: "Updated Cart",
          description: `Increased quantity of ${product.name}`,
        });
        setTimeout(() => {}, 3000);
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
        setTimeout(() => {}, 3000);
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
    setTimeout(() => {}, 3000);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${product.stock} items available in stock`,
        variant: "destructive"
      });
      setTimeout(() => {}, 3000);
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
    const totalPrice = getTotalPrice();
    return totalPrice >= 200 ? 0 : 50;
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
      setTimeout(() => {}, 3000);
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

  const cancelRedirect = () => {
    setRedirectCountdown(0);
    toast({
      title: "Redirect Cancelled",
      description: "WhatsApp redirect has been cancelled",
    });
    setTimeout(() => {}, 3000);
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
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-orange-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  RakhiMart
                </h1>
                <p className="text-xs text-gray-500">Premium Rakhi Collection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setIsContactOpen(true)}
                className="hidden sm:flex items-center space-x-2 hover:bg-orange-50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-orange-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs animate-pulse">
                    {getTotalQuantity()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Celebrate Raksha Bandhan
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Express your love with our beautiful collection of Rakhis. From traditional to modern designs, find the perfect Rakhi for your beloved brother with premium quality and authentic craftsmanship.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for rakhis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-4xl font-bold text-gray-800">Our Rakhi Collection</h3>
            <p className="text-gray-600">{filteredAndSortedProducts.length} products found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-72 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                    onClick={() => setSelectedProduct(product)}
                  />
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                      {product.category}
                    </Badge>
                    {product.isOutOfStock && (
                      <Badge variant="destructive" className="block">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90">
                      {product.stock} left
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      ₹{product.price}
                    </span>
                    <StarRating rating={getAverageRating(product.id)} />
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500"><strong>Material:</strong> {product.materials}</p>
                    <p className="text-xs text-gray-500"><strong>Perfect for:</strong> {product.occasion}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="space-y-3 pt-0">
                  <Button 
                    onClick={() => addToCart(product)}
                    disabled={product.isOutOfStock || product.stock === 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 h-12 text-lg font-semibold shadow-lg"
                  >
                    {product.isOutOfStock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full border-orange-300 hover:bg-orange-50 h-12"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 opacity-50">
                <Search className="w-full h-full text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {selectedProduct.name}
              </h3>
              <Button variant="ghost" onClick={() => setSelectedProduct(null)} className="h-10 w-10 p-0">
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={selectedProduct.images[selectedImageIndex]} 
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover"
                    />
                    {selectedProduct.isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg p-3">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                          selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
                      {selectedProduct.category}
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                      {selectedProduct.stock} in stock
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      ₹{selectedProduct.price}
                    </span>
                    <StarRating rating={getAverageRating(selectedProduct.id)} />
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedProduct.description}</p>
                  
                  {/* Detailed Specifications */}
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">Product Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Materials</p>
                        <p className="text-gray-800">{selectedProduct.materials}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Perfect for</p>
                        <p className="text-gray-800">{selectedProduct.occasion}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Key Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.specifications.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => addToCart(selectedProduct)}
                      disabled={selectedProduct.isOutOfStock || selectedProduct.stock === 0}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 h-14 text-lg font-semibold shadow-lg"
                    >
                      {selectedProduct.isOutOfStock || selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="mt-12 border-t pt-8">
                <h4 className="text-2xl font-bold mb-6">Reviews & Ratings</h4>
                
                {/* Add Review */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8 border border-orange-200">
                  <h5 className="font-semibold mb-4 text-lg">Add Your Review</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <StarRating 
                        rating={newReview.rating} 
                        onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                        readonly={false}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with this rakhi..."
                        className="w-full min-h-[100px] border-orange-200 focus:border-orange-400"
                      />
                    </div>
                    <Button 
                      onClick={() => addReview(selectedProduct.id)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
                
                {/* Display Reviews */}
                <div className="space-y-6">
                  {(productReviews[selectedProduct.id] || []).map((review) => (
                    <div key={review.id} className="border rounded-xl p-6 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                  {(!productReviews[selectedProduct.id] || productReviews[selectedProduct.id].length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Shopping Cart</h3>
                <p className="text-orange-100 text-sm">{getTotalQuantity()} items</p>
              </div>
              <Button variant="ghost" onClick={() => setIsCartOpen(false)} className="text-white hover:bg-white/20 h-10 w-10 p-0">
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                  <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
                  <p className="text-gray-400">Add some beautiful rakhis to get started!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6 mb-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-md" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                          <p className="text-green-600 font-bold text-lg">₹{item.price}</p>
                          <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-3 py-1 bg-white rounded-lg border border-orange-200 min-w-[40px] text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100 disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-orange-200 pt-6 space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 space-y-3 border border-orange-200">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-bold text-gray-800">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Delivery:</span>
                        <span className={`font-bold ${getDeliveryCharges() === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                          {getDeliveryCharges() === 0 ? 'FREE' : `₹${getDeliveryCharges()}`}
                        </span>
                      </div>
                      {getTotalPrice() < 200 && (
                        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center">
                          <p className="text-sm text-orange-700 font-medium">
                            Add ₹{200 - getTotalPrice()} more for FREE delivery!
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold border-t border-orange-300 pt-3">
                        <span>Total:</span>
                        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                          ₹{getTotalPrice() + getDeliveryCharges()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {redirectCountdown > 0 && (
                        <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 text-center">
                          <p className="text-blue-800 font-medium mb-3">
                            Redirecting to WhatsApp in {redirectCountdown} seconds...
                          </p>
                          <Button 
                            onClick={cancelRedirect}
                            variant="outline" 
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            Cancel Redirect
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleBuyNow}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-14 text-lg font-semibold shadow-lg"
                        disabled={redirectCountdown > 0}
                      >
                        {redirectCountdown > 0 ? `Redirecting... ${redirectCountdown}` : 'Buy Now'}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                        * You will be redirected to WhatsApp for order confirmation and payment details
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
