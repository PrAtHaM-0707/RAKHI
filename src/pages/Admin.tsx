import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Package, Settings, List, LogOut, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminProductForm from '@/components/AdminProductForm';
import CategoryManager from '@/components/CategoryManager';
import { toast } from '@/hooks/use-toast';
import { useCategories, useProducts, useSiteSettings, useDeleteProduct, useToggleStock, useUpdateSettings, useAdminLogin } from '@/hooks/useData';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category_id: string;
  category_name?: string; 
  stock: number;
  is_out_of_stock: boolean;
  specifications: string[];
  materials: string;
  occasion: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [password, setPassword] = useState('');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState({
    site_title: '',
    site_description: '',
    contact_phone: '',
    contact_email: '',
    delivery_charges: '',
    free_delivery_minimum: '',
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const deleteProduct = useDeleteProduct();
  const toggleStock = useToggleStock();
  const updateSettings = useUpdateSettings();
  const adminLogin = useAdminLogin();

 
  useEffect(() => {
    if (siteSettings) {
      setSettings({
        site_title: siteSettings.site_title || '',
        site_description: siteSettings.site_description || '',
        contact_phone: siteSettings.contact_phone || '',
        contact_email: siteSettings.contact_email || '',
        delivery_charges: siteSettings.delivery_charges || '',
        free_delivery_minimum: siteSettings.free_delivery_minimum || '',
      });
    }
  }, [siteSettings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminLogin.mutateAsync(password);
      setIsAuthenticated(true);
      setPassword('');
      toast({ title: 'Success', description: 'Logged in successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast({ title: 'Logged Out', description: 'You have been logged out.' });
  };

  const handleDeleteProduct = async (_id: string) => {
    if (!_id || _id === 'undefined') {
      toast({
        title: 'Error',
        description: 'Invalid product ID.',
        variant: 'destructive',
      });
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(_id);
        toast({ title: 'Success', description: 'Product deleted successfully!' });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete product.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleStock = async (_id: string, is_out_of_stock: boolean) => {
  ;
    if (!_id || _id === 'undefined') {
      toast({
        title: 'Error',
        description: 'Invalid product ID.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await toggleStock.mutateAsync(_id);
      toast({
        title: 'Success',
        description: `Product marked as ${is_out_of_stock ? 'in stock' : 'out of stock'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle stock.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(settings);
      toast({ title: 'Success', description: 'Settings updated successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <Button type="submit" className="w-full" disabled={adminLogin.isLoading}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories">
            <List className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Management</CardTitle>
                <Button
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsProductFormOpen(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p>Loading products...</p>
              ) : !productsData?.products?.length ? (
                <p>No products found. Add your first product!</p>
              ) : (
                <div className="space-y-4">
                  {productsData.products.map((product: Product) => (
                    <div key={product._id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">₹{product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                        <p className="text-sm text-gray-600">{product.category_name || 'Unknown Category'}</p>
                        <Badge variant={product.is_out_of_stock ? 'destructive' : 'default'}>
                          {product.is_out_of_stock ? 'Out of Stock' : 'In Stock'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsProductFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStock(product._id, product.is_out_of_stock)}
                        >
                          {product.is_out_of_stock ? (
                            <>
                              <ToggleRight className="h-4 w-4 mr-1" />
                              Mark In Stock
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-1" />
                              Mark Out of Stock
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <AdminProductForm
            product={selectedProduct}
            isOpen={isProductFormOpen}
            onClose={() => {
              setIsProductFormOpen(false);
              setSelectedProduct(null);
            }}
            categories={categories}
          />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager categories={categories} />
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <p>Loading settings...</p>
              ) : (
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Site Title</label>
                      <Input
                        value={settings.site_title}
                        onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                        placeholder="Enter site title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input
                        value={settings.contact_phone}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                        placeholder="Enter contact phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Site Description</label>
                    <Textarea
                      value={settings.site_description}
                      onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                      placeholder="Enter site description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      value={settings.contact_email}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      placeholder="Enter contact email"
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Delivery Charges (₹)</label>
                      <Input
                        value={settings.delivery_charges}
                        onChange={(e) => setSettings({ ...settings, delivery_charges: e.target.value })}
                        placeholder="Enter delivery charges"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Free Delivery Minimum (₹)</label>
                      <Input
                        value={settings.free_delivery_minimum}
                        onChange={(e) => setSettings({ ...settings, free_delivery_minimum: e.target.value })}
                        placeholder="Enter free delivery minimum"
                        type="number"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateSettings.isLoading}>
                    Save Settings
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;