
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategory, setEditCategory] = useState({ name: '', description: '' });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    onAddCategory(newCategory);
    setNewCategory({ name: '', description: '' });
    setIsAdding(false);
    toast({
      title: "Category Added",
      description: "New category has been added successfully!",
    });
  };

  const handleUpdateCategory = (id: string) => {
    if (!editCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    onUpdateCategory(id, editCategory);
    setEditingId(null);
    setEditCategory({ name: '', description: '' });
    toast({
      title: "Category Updated",
      description: "Category has been updated successfully!",
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      onDeleteCategory(id);
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully!",
      });
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditCategory({ name: category.name, description: category.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCategory({ name: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Category Management</CardTitle>
          <Button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Category Form */}
        {isAdding && (
          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddCategory} size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Category description (optional)"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              rows={2}
            />
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              {editingId === category.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                      placeholder="Category name"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={() => handleUpdateCategory(category.id)} size="sm">
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEditing} size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={editCategory.description}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    placeholder="Category description (optional)"
                    rows={2}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <Badge variant="outline">
                        {categories.length} categories
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(category)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No categories found. Add your first category to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
