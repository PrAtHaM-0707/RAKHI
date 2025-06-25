
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package, TrendingUp, X, Eye, Tags } from 'lucide-react';
import { useLocalStorage, defaultCategories, defaultProducts, defaultSiteSettings } from '@/hooks/useLocalStorage';
import AdminProductForm from '@/components/AdminProductForm';
import CategoryManager from '@/components/CategoryManager';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState('50');
  const [freeDeliveryMin, setFreeDeliveryMin] = useState('200');
  
  const ADMIN_PASSWORD = 'admin123';

  // Local storage hooks
  const [categories, setCategories] = useLocalStorage('categories', defaultCategories);
  const [products, setProducts] = useLocalStorage('products', defaultProducts);
  const [siteSettings, setSiteSettings] = useLocalStorage('siteSettings', defaultSiteSettings);

  useEffect(() => {
    setDeliveryCharges(siteSettings.delivery_charges || '50');
    setFreeDeliveryMin(siteSettings.free_delivery_minimum || '200');
  }, [siteSettings]);

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

  const updateDeliverySettings = () => {
    setSiteSettings({
      ...siteSettings,
      delivery_charges: deliveryCharges,
      free_delivery_minimum: freeDeliveryMin
    });
    toast({
      title: "Settings Updated",
      description: "Delivery settings have been updated successfully!",
    });
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
      setEditingProduct(null);
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully!",
      });
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        rating: 0,
      };
      setProducts([...products, newProduct]);
      setIsAddingProduct(false);
      toast({
        title: "Product Added",
        description: "New product has been added successfully!",
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully!",
      });
    }
  };

  const toggleProductStock = (product: any) => {
    setProducts(products.map(p => 
      p.id === product.id 
        ? { ...p, is_out_of_stock: !p.is_out_of_stock }
        : p
    ));
  };

  const handleAddCategory = (categoryData: { name: string; description: string }) => {
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category Added",
      description: "New category has been added successfully!",
    });
  };

  const handleUpdateCategory = (id: string, categoryData: { name: string; description: string }) => {
    setCategories(categories.map(c => 
      c.id === id 
        ? { ...c, ...categoryData }
        : c
    ));
    toast({
      title: "Category Updated",
      description: "Category has been updated successfully!",
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(categories.filter(c => c.id !== id));
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully!",
      });
    }
  };

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
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.open('/', '_blank')} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button onClick={() => setIsAuthenticated(false)} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap space-x-1 mb-8 bg-white rounded-lg p-1 shadow-md">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Tags },
            { id: 'settings', label: 'Settings', icon: Edit },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 min-w-0"
              size="sm"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <p className="text-2xl font-bold">{products.filter(p => !p.is_out_of_stock).length}</p>
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
                    <p className="text-2xl font-bold">{products.filter(p => p.is_out_of_stock).length}</p>
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
                    <p className="text-2xl font-bold">{categories.length}</p>
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
              <Button
                onClick={() => setIsAddingProduct(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.images[0] || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.is_out_of_stock && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {product.images.slice(1, 3).map((img, idx) => (
                        <div key={idx} className="w-6 h-6 rounded border bg-white/80">
                          <img src={img} alt="" className="w-full h-full object-cover rounded" />
                        </div>
                      ))}
                      {product.images.length > 3 && (
                        <div className="w-6 h-6 rounded border bg-white/80 flex items-center justify-center text-xs">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-green-600 font-bold text-lg mb-2">₹{product.price}</p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{categories.find(c => c.id === product.category_id)?.name}</Badge>
                      <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant={product.is_out_of_stock ? "default" : "outline"}
                        onClick={() => toggleProductStock(product)}
                      >
                        {product.is_out_of_stock ? 'In Stock' : 'Out of Stock'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Categories Management</h2>
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
                <CardDescription>Manage delivery charges and free delivery threshold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Charges (₹)</label>
                    <Input
                      type="number"
                      value={deliveryCharges}
                      onChange={(e) => setDeliveryCharges(e.target.value)}
                      placeholder="Enter delivery charges"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Free Delivery Above (₹)</label>
                    <Input
                      type="number"
                      value={freeDeliveryMin}
                      onChange={(e) => setFreeDeliveryMin(e.target.value)}
                      placeholder="Enter minimum amount for free delivery"
                    />
                  </div>
                </div>
                <Button onClick={updateDeliverySettings}>
                  Update Delivery Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AdminProductForm
        product={editingProduct}
        isOpen={isAddingProduct || !!editingProduct}
        onClose={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
};

export default Admin;
