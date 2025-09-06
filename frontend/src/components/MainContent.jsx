import React from 'react';
import { Search, Filter, Wine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CocktailCard from './CocktailCard';
import LoadingSpinner from './LoadingSpinner';

const MainContent = ({
  activeView,
  cocktails,
  loading,
  searchQuery,
  selectedCategory,
  categories,
  onSearch,
  onCategoryChange,
  onCocktailSelect
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'my-bar-shelf':
        return 'My Bar Shelf';
      case 'manage-bar-shelf':
        return 'Manage Bar Shelf';
      case 'shopping-list':
        return 'Shopping List';
      case 'all-cocktails':
        return 'All Cocktails';
      case 'my-cocktails':
        return 'My Cocktails';
      case 'favorite-cocktails':
        return 'Favorite Cocktails';
      case 'featured-cocktails':
        return 'Featured Cocktails';
      case 'seasonal-cocktails':
        return 'Seasonal Cocktails';
      default:
        return 'All Cocktails';
    }
  };

  const getSearchPlaceholder = () => {
    const count = cocktails.length;
    return `Search ${count}+ premium cocktails...`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with background image effect */}
      <div 
        className="relative bg-gradient-to-r from-background via-background/95 to-background/90 border-b border-border"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23333333" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        <div className="p-6">
          {/* Search and Filter Row */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-12 h-12 text-lg search-input"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-48 h-12 bg-input border-border">
                <Filter className="w-4 h-4 mr-2 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {cocktails.length} of {cocktails.length} cocktails
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : cocktails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Wine className="w-16 h-16 empty-state-icon mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No cocktails found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cocktails.map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                cocktail={cocktail}
                onClick={() => onCocktailSelect(cocktail)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;

