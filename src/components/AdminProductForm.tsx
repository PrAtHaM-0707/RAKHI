import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAddProduct, useUpdateProduct } from '@/hooks/useData';

interface Product {
  _id?: string;
  name?: string;
  price: number;
  images: File[] | string[];
  description: string;
  category_id: string;
  stock: number;
  is_out_of_stock: boolean;
  specifications: string[];
  materials: string;
  occasion: string;
}

interface Category {
  _id: string;
  name: string;
}

interface AdminProductFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[] | undefined;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  isOpen,
  onClose,
  categories = [],
}) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    images: [],
    description: '',
    category_id: '',
    stock: 0,
    is_out_of_stock: false,
    specifications: [],
    materials: '',
    occasion: '',
  });
  const [newSpec, setNewSpec] = useState('');
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    console.log('Categories in AdminProductForm:', categories); // Log categories
    console.log('Product in AdminProductForm:', product); // Log product
    if (product) {
      setFormData({
        _id: product._id,
        name: product.name || '',
        price: product.price || 0,
        images: [], // Reset for new uploads
        description: product.description || '',
        category_id: product.category_id ? String(product.category_id) : '',
        stock: product.stock || 0,
        is_out_of_stock: product.is_out_of_stock || false,
        specifications: product.specifications || [],
        materials: product.materials || '',
        occasion: product.occasion || '',
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        images: [],
        description: '',
        category_id: categories?.[0]?._id ? String(categories[0]._id) : '',
        stock: 0,
        is_out_of_stock: false,
        specifications: [],
        materials: '',
        occasion: '',
      });
    }
  }, [product, isOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Log form data
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields, including a category.',
        variant: 'destructive',
      });
      return;
    }
    if (!product && formData.images.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one image.',
        variant: 'destructive',
      });
      return;
    }
    try {
      if (product && product._id) {
        await updateProduct.mutateAsync({ _id: product._id, product: formData });
        toast({ title: 'Success', description: 'Product updated successfully!' });
      } else {
        await addProduct.mutateAsync(formData);
        toast({ title: 'Success', description: 'Product added successfully!' });
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product.',
        variant: 'destructive',
      });
    }
  };

  const addSpecification = () => {
    if (newSpec.trim()) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, newSpec.trim()],
      });
      setNewSpec('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              {categories.length === 0 ? (
                <p className="text-sm text-red-600">No categories available. Please add a category first.</p>
              ) : (
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((category): category is Category & { _id: string } => !!category?._id)
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name || '(No name)'}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                placeholder="Enter stock quantity"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Product Images (Max 3) *</label>
            <div className="flex space-x-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []).slice(0, 3) })}
                className="flex-1"
              />
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })}
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {product?.images && product.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Materials</label>
              <Input
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="e.g., Silk, Cotton, Beads"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Occasion</label>
              <Input
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                placeholder="e.g., Raksha Bandhan, Festival"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Specifications</label>
            <div className="flex space-x-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Add specification"
                className="flex-1"
              />
              <Button type="button" onClick={addSpecification} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.specifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specifications.map((spec, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.is_out_of_stock}
              onCheckedChange={(checked) => setFormData({ ...formData, is_out_of_stock: checked })}
            />
            <label className="text-sm font-medium">Mark as Out of Stock</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              disabled={addProduct.isLoading || updateProduct.isLoading}
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductForm;