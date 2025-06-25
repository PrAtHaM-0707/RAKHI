import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  _id: string; // Changed from id to _id
  name: string;
}

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showOutOfStock: boolean;
  onShowOutOfStockChange: (show: boolean) => void;
  onClearFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  showOutOfStock,
  onShowOutOfStockChange,
  onClearFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [minPrice, setMinPrice] = React.useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = React.useState(priceRange[1].toString());

  const handlePriceChange = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || 10000;
    onPriceRangeChange([min, max]);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    priceRange[0] > 0 || priceRange[1] < 10000,
    sortBy !== 'default',
    !showOutOfStock,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search rakhis..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-orange-200 focus:border-orange-400"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={onClearFilters} size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="w-20"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <Button
                  variant={showOutOfStock ? "outline" : "default"}
                  onClick={() => onShowOutOfStockChange(!showOutOfStock)}
                  size="sm"
                  className="w-full justify-start"
                >
                  {showOutOfStock ? "Show All" : "In Stock Only"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          onClick={() => onCategoryChange('All')}
          size="sm"
          className="border-orange-200 hover:border-orange-400"
        >
          All
        </Button>
        {categories.slice(0, 6).map((category) => (
          <Button
            key={category._id}
            variant={selectedCategory === category._id ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category._id)}
            size="sm"
            className="border-orange-200 hover:border-orange-400"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;