
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, Package, ShoppingCart, Users, TrendingUp, Upload, X } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  rating: number;
  category: string;
  stock: number;
  isOutOfStock: boolean;
  specifications: string[];
  materials: string;
  occasion: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    images: ['', '', ''],
    description: '',
    category: '',
    stock: 0,
    isOutOfStock: false,
    specifications: [''],
    materials: '',
    occasion: ''
  });

  const ADMIN_PASSWORD = 'admin123'; // In real app, this should be in environment variables

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('rakhi-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products
      const defaultProducts: Product[] = [
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
          category: "Traditional",
          stock: 25,
          isOutOfStock: false,
          specifications: ["Gold-plated", "Handcrafted", "Sacred thread", "Traditional design"],
          materials: "Gold-plated metal, silk thread, beads",
          occasion: "Raksha Bandhan, Traditional ceremonies"
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('rakhi-products', JSON.stringify(defaultProducts));
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveProductsToStorage = (updatedProducts: Product[]) => {
    localStorage.setItem('rakhi-products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name!,
      price: newProduct.price!,
      images: newProduct.images?.filter(img => img) || [],
      description: newProduct.description || '',
      rating: 0,
      category: newProduct.category!,
      stock: newProduct.stock || 0,
      isOutOfStock: newProduct.isOutOfStock || false,
      specifications: newProduct.specifications?.filter(spec => spec) || [],
      materials: newProduct.materials || '',
      occasion: newProduct.occasion || ''
    };

    const updatedProducts = [...products, product];
    saveProductsToStorage(updatedProducts);

    setNewProduct({
      name: '',
      price: 0,
      images: ['', '', ''],
      description: '',
      category: '',
      stock: 0,
      isOutOfStock: false,
      specifications: [''],
      materials: '',
      occasion: ''
    });
    setIsAddingProduct(false);

    toast({
      title: "Product Added",
      description: "New product has been added successfully!",
    });
  };

  const updateProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    saveProductsToStorage(updatedProducts);
    setEditingProduct(null);

    toast({
      title: "Product Updated",
      description: "Product has been updated successfully!",
    });
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProductsToStorage(updatedProducts);

    toast({
      title: "Product Deleted",
      description: "Product has been deleted successfully!",
    });
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription>Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Hint: Default password is 'admin123'
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-orange-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  RakhiMart Admin
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-md">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold">{products.filter(p => !p.isOutOfStock).length}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold">{products.filter(p => p.isOutOfStock).length}</p>
                  </div>
                  <Package className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">{new Set(products.map(p => p.category)).size}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map((product) => (
                <Card key={product.id}>
                  <div className="relative">
                    <img 
                      src={product.images[0] || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.isOutOfStock && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <p className="text-green-600 font-bold text-lg">₹{product.price}</p>
                    <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">Connect to Supabase to view orders</p>
                <p className="text-sm text-gray-500">Orders will be saved and displayed here once database is connected</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold">
                {isAddingProduct ? 'Add New Product' : 'Edit Product'}
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    value={isAddingProduct ? newProduct.name : editingProduct?.name}
                    onChange={(e) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, name: e.target.value }))
                        : setEditingProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <Input
                    type="number"
                    value={isAddingProduct ? newProduct.price : editingProduct?.price}
                    onChange={(e) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))
                        : setEditingProduct(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)
                    }
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select
                    value={isAddingProduct ? newProduct.category : editingProduct?.category}
                    onValueChange={(value) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, category: value }))
                        : setEditingProduct(prev => prev ? ({ ...prev, category: value }) : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <Input
                    type="number"
                    value={isAddingProduct ? newProduct.stock : editingProduct?.stock}
                    onChange={(e) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, stock: Number(e.target.value) }))
                        : setEditingProduct(prev => prev ? ({ ...prev, stock: Number(e.target.value) }) : null)
                    }
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={isAddingProduct ? newProduct.description : editingProduct?.description}
                  onChange={(e) => 
                    isAddingProduct 
                      ? setNewProduct(prev => ({ ...prev, description: e.target.value }))
                      : setEditingProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)
                  }
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Images (up to 3)</label>
                <div className="space-y-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Input
                      key={i}
                      value={
                        isAddingProduct 
                          ? newProduct.images?.[i] || ''
                          : editingProduct?.images[i] || ''
                      }
                      onChange={(e) => {
                        const images = isAddingProduct ? [...(newProduct.images || [])] : [...(editingProduct?.images || [])];
                        images[i] = e.target.value;
                        if (isAddingProduct) {
                          setNewProduct(prev => ({ ...prev, images }));
                        } else {
                          setEditingProduct(prev => prev ? ({ ...prev, images }) : null);
                        }
                      }}
                      placeholder={`Image URL ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Materials</label>
                  <Input
                    value={isAddingProduct ? newProduct.materials : editingProduct?.materials}
                    onChange={(e) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, materials: e.target.value }))
                        : setEditingProduct(prev => prev ? ({ ...prev, materials: e.target.value }) : null)
                    }
                    placeholder="Enter materials used"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Occasion</label>
                  <Input
                    value={isAddingProduct ? newProduct.occasion : editingProduct?.occasion}
                    onChange={(e) => 
                      isAddingProduct 
                        ? setNewProduct(prev => ({ ...prev, occasion: e.target.value }))
                        : setEditingProduct(prev => prev ? ({ ...prev, occasion: e.target.value }) : null)
                    }
                    placeholder="Perfect for..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="outOfStock"
                  checked={isAddingProduct ? newProduct.isOutOfStock : editingProduct?.isOutOfStock}
                  onChange={(e) => 
                    isAddingProduct 
                      ? setNewProduct(prev => ({ ...prev, isOutOfStock: e.target.checked }))
                      : setEditingProduct(prev => prev ? ({ ...prev, isOutOfStock: e.target.checked }) : null)
                  }
                />
                <label htmlFor="outOfStock" className="text-sm font-medium">
                  Mark as Out of Stock
                </label>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={isAddingProduct ? addProduct : updateProduct}
                  className="flex-1"
                >
                  {isAddingProduct ? 'Add Product' : 'Update Product'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
