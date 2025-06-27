import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  Star,
  Phone,
  Mail,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCategories, useProducts, useSiteSettings, defaultSiteSettings } from "@/hooks/useData";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import FilterSection from "@/components/FilterSection";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  rating?: number;
  categories?: { name: string };
  stock: number;
  is_out_of_stock: boolean;
  specifications: string[];
  materials: string;
  occasion: string;
}

interface IndexProps {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
}

const Index: React.FC<IndexProps> = ({ cartItems, onAddToCart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("default");
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const productsPerPage = 12;

  // Fetch data
  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts(
    currentPage,
    productsPerPage,
    selectedCategory
  );
  const { data: siteSettingsData } = useSiteSettings();

  const siteSettings = siteSettingsData || defaultSiteSettings;

  // Normalize product data
  const products = React.useMemo(() => {
    return (productsData?.products || []).map((product: any) => ({
      ...product,
      id: product._id,
      images: product.images?.length ? product.images : ["/placeholder.svg"],
    }));
  }, [productsData]);

  const totalProducts = productsData?.count || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const getCategoryName = (categoryId: string) => {
    if (categoryId === "All") return "All Categories";
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || categoryId;
  };

  const handleAddToCart = (product: Product) => {
   onAddToCart({
      ...product,
      id: product._id || product.id, 
    });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct({
      ...product,
      id: product._id || product.id,
    });
    setIsProductModalOpen(true);
  };

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = showOutOfStock || !product.is_out_of_stock;
      return matchesSearch && matchesPrice && matchesStock;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, priceRange, sortBy, showOutOfStock]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange([0, 10000]);
    setSortBy("default");
    setShowOutOfStock(true);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl">R</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl600 font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {siteSettings.site_title || "RakhiMart"}
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  {siteSettings.site_description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/cart")}
                className="relative hover:bg-orange-50 border-orange-200 p-2 md:px-4"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {totalProducts} products
                  {selectedCategory !== "All" && ` in "${getCategoryName(selectedCategory)}"`}
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
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={() => {}}
                      isInWishlist={false}
                      onViewDetails={handleViewProduct}
                    />
                  ))}
                </div>
              )}

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
                      if (totalPages <= 5) pageNumber = i + 1;
                      else if (currentPage <= 3) pageNumber = i + 1;
                      else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                      else pageNumber = currentPage - 2 + i;

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
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
                <a href="#" className="block hover:text-orange-200 transition-colors">
                  About Us
                </a>
                <a href="#" className="block hover:text-orange-200 transition-colors">
                  Shipping Policy
                </a>
                <a href="#" className="block hover:text-orange-200 transition-colors">
                  Return Policy
                </a>
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
            <p className="text-orange-100">© 2025 RakhiMart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onToggleWishlist={() => {}}
        isInWishlist={false}
      />
    </div>
  );
};

export default Index;