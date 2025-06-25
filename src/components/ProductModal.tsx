
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';

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
  specifications: string[];
  materials: string;
  occasion: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[currentImageIndex] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_out_of_stock && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{product.rating || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {product.categories && (
                  <Badge variant="outline" className="border-orange-200 text-orange-600">
                    {product.categories.name}
                  </Badge>
                )}
                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            {product.materials && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Materials</h3>
                <p className="text-gray-700">{product.materials}</p>
              </div>
            )}
            
            {product.occasion && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Occasion</h3>
                <p className="text-gray-700">{product.occasion}</p>
              </div>
            )}
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Specifications</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex pt-4">
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.is_out_of_stock || product.stock === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
