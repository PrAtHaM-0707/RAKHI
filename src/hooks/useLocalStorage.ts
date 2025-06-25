
import { useState, useEffect } from 'react';

// Categories data
export const defaultCategories = [
  { id: '1', name: 'Traditional', description: 'Classic traditional rakhis with authentic designs' },
  { id: '2', name: 'Designer', description: 'Modern designer rakhis with contemporary styles' },
  { id: '3', name: 'Kids', description: 'Colorful and fun rakhis specially designed for children' },
  { id: '4', name: 'Premium', description: 'Luxury rakhis with premium materials and craftsmanship' },
  { id: '5', name: 'Eco-Friendly', description: 'Environment-friendly rakhis made from sustainable materials' },
];

// Products data
export const defaultProducts = [
  {
    id: '1',
    name: 'Traditional Gold Rakhi',
    price: 299,
    description: 'Beautiful traditional gold-plated rakhi with intricate designs. Perfect for your beloved brother. Handcrafted with premium materials and adorned with sacred threads.',
    category_id: '1',
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop'
    ],
    stock: 25,
    is_out_of_stock: false,
    specifications: ['Gold-plated', 'Handcrafted', 'Sacred thread', 'Traditional design'],
    materials: 'Gold-plated metal, silk thread, beads',
    occasion: 'Raksha Bandhan, Traditional ceremonies',
    rating: 4.5,
    categories: { id: '1', name: 'Traditional' }
  },
  {
    id: '2',
    name: 'Designer Silver Rakhi',
    price: 399,
    description: 'Elegant designer silver rakhi with modern patterns and beautiful gemstone accents.',
    category_id: '2',
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop'
    ],
    stock: 15,
    is_out_of_stock: false,
    specifications: ['Silver-plated', 'Gemstone accents', 'Designer pattern'],
    materials: 'Silver-plated metal, gemstones, silk thread',
    occasion: 'Raksha Bandhan, Modern celebrations',
    rating: 4.8,
    categories: { id: '2', name: 'Designer' }
  },
  {
    id: '3',
    name: 'Kids Colorful Rakhi',
    price: 149,
    description: 'Fun and colorful rakhi designed specially for children with cartoon characters.',
    category_id: '3',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop'
    ],
    stock: 30,
    is_out_of_stock: false,
    specifications: ['Kid-friendly', 'Cartoon design', 'Soft materials'],
    materials: 'Soft fabric, colorful threads, plastic charms',
    occasion: 'Raksha Bandhan for kids',
    rating: 4.2,
    categories: { id: '3', name: 'Kids' }
  }
];

export const defaultSiteSettings = {
  delivery_charges: '50',
  free_delivery_minimum: '200',
  contact_phone: '+91 7696400902',
  contact_email: 'prathamm4402@gmail.com',
  site_title: 'RakhiMart - Premium Rakhi Collection',
  site_description: 'Celebrate Raksha Bandhan with our beautiful collection of traditional and designer rakhis'
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Custom hooks for data management
export const useCategories = () => {
  const [categories] = useLocalStorage('categories', defaultCategories);
  return { data: categories, isLoading: false };
};

export const useProducts = (page = 1, limit = 12, categoryFilter?: string) => {
  const [products] = useLocalStorage('products', defaultProducts);
  
  let filteredProducts = products;
  if (categoryFilter && categoryFilter !== 'All') {
    const category = defaultCategories.find(c => c.name === categoryFilter);
    if (category) {
      filteredProducts = products.filter(p => p.category_id === category.id);
    }
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    data: {
      products: paginatedProducts,
      count: filteredProducts.length
    },
    isLoading: false
  };
};

export const useSiteSettings = () => {
  const [settings] = useLocalStorage('siteSettings', defaultSiteSettings);
  return { data: settings, isLoading: false };
};
