
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Award,
  Truck,
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCategories, useProducts, useSiteSettings, defaultSiteSettings } from '@/hooks/useLocalStorage';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import FilterSection from '@/components/FilterSection';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

const Index = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('default');
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  
  const productsPerPage = 12;

  // Fetch data from local storage
  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts(
    currentPage, 
    productsPerPage, 
    selectedCategory
  );
  const { data: siteSettingsData, isLoading: settingsLoading } = useSiteSettings();
  
  // Provide default values to prevent TypeScript errors
  const siteSettings = siteSettingsData || defaultSiteSettings;

  const products = productsData?.products || [];
  const totalProducts = productsData?.count || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        images: product.images
      }]);
    }
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: any) => {
    const isInWishlist = wishlist.includes(product.id);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(id => id !== product.id));
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      setWishlist([...wishlist, product.id]);
      toast({
        title: "Added to Wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryCharges = () => {
    const total = getTotalAmount();
    const freeDeliveryMin = parseInt(siteSettings.free_delivery_minimum || '200');
    const deliveryCharges = parseInt(siteSettings.delivery_charges || '50');
    
    return total >= freeDeliveryMin ? 0 : deliveryCharges;
  };

  // Apply filters and sorting
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Stock filter
      const matchesStock = showOutOfStock || !product.is_out_of_stock;
      
      return matchesSearch && matchesPrice && matchesStock;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep default order
        break;
    }

    return filtered;
  }, [products, searchQuery, priceRange, sortBy, showOutOfStock]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange([0, 10000]);
    setSortBy('default');
    setShowOutOfStock(true);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-orange-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {siteSettings.site_title || 'RakhiMart'}
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  {siteSettings.site_description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-orange-600" />
                <span className="hidden md:inline">{siteSettings.contact_phone}</span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate('/cart')}
                className="relative hover:bg-orange-50 border-orange-200"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Cart</span>
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Celebrate Raksha Bandhan with Love
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover our exquisite collection of traditional and designer rakhis. 
            Each piece crafted with love to make your celebration special.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center space-x-2 text-green-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Truck className="h-5 w-5" />
              <span className="text-sm md:text-base">Free delivery above ₹{siteSettings.free_delivery_minimum}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Shield className="h-5 w-5" />
              <span className="text-sm md:text-base">100% Quality Assured</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Award className="h-5 w-5" />
              <span className="text-sm md:text-base">Handcrafted with Love</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <FilterSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            categories={categories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showOutOfStock={showOutOfStock}
            onShowOutOfStockChange={setShowOutOfStock}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {totalProducts} products
                  {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
                </p>
                
                {filteredAndSortedProducts.length === 0 && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear Filters
                  </Button>
                )}
              </div>

              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isInWishlist={wishlist.includes(product.id)}
                      onViewDetails={handleViewProduct}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-orange-200 hover:border-orange-400"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(pageNumber)}
                          size="sm"
                          className="border-orange-200 hover:border-orange-400"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-orange-200 hover:border-orange-400"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{siteSettings.contact_phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{siteSettings.contact_email}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block hover:text-orange-200 transition-colors">About Us</a>
                <a href="#" className="block hover:text-orange-200 transition-colors">Shipping Policy</a>
                <a href="#" className="block hover:text-orange-200 transition-colors">Return Policy</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <p className="text-orange-100">
                Celebrate the bond of love with our premium rakhi collection.
              </p>
            </div>
          </div>
          
          <div className="border-t border-orange-400 mt-8 pt-4 text-center">
            <p className="text-orange-100">© 2024 RakhiMart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
      />
    </div>
  );
};

export default Index;
