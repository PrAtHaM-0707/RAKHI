
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  rating: number;
  categories?: { name: string };
  stock: number;
  is_out_of_stock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-orange-200/50 hover:border-orange-300">
      <div className="relative overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-orange-50 to-red-50">
          <img
            src={product.images[currentImageIndex] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Image Navigation */}
          {product.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                ‹
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                ›
              </Button>
            </div>
          )}
          
          {/* Image Indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {product.is_out_of_stock && (
            <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && !product.is_out_of_stock && (
            <Badge className="bg-orange-500/90 backdrop-blur-sm text-white">
              Only {product.stock} left
            </Badge>
          )}
          {product.rating >= 4.5 && (
            <Badge className="bg-yellow-500/90 backdrop-blur-sm text-white flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Top Rated
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-orange-50"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              {product.categories && (
                <Badge variant="outline" className="text-xs border-orange-200 text-orange-600 bg-orange-50">
                  {product.categories.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-600">{product.rating || 0}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Stock:</span>
            <Badge variant={product.stock > 10 ? "secondary" : "outline"} className="text-xs">
              {product.stock}
            </Badge>
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.is_out_of_stock || product.stock === 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="text-xs text-orange-600 hover:text-orange-700 p-0 h-auto"
          >
            View Details →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
