import React, { useState, useEffect } from 'react';
import { Plus, Search, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from './LoadingSpinner';

const ManageBarShelf = ({ userId = 1 }) => {
  const [allIngredients, setAllIngredients] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all available ingredients
  const fetchAllIngredients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ingredients');
      const data = await response.json();
      setAllIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setAllIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's current ingredients
  const fetchUserIngredients = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/bar-shelf`);
      const data = await response.json();
      setUserIngredients(data || []);
    } catch (error) {
      console.error('Error fetching user ingredients:', error);
      setUserIngredients([]);
    }
  };

  // Add ingredient to user's bar shelf
  const addIngredient = async (ingredientName) => {
    try {
      await fetch(`/api/users/${userId}/bar-shelf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredient_name: ingredientName,
        }),
      });
      fetchUserIngredients();
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  // Remove ingredient from user's bar shelf
  const removeIngredient = async (ingredientId) => {
    try {
      await fetch(`/api/users/${userId}/bar-shelf/${ingredientId}`, {
        method: 'DELETE',
      });
      fetchUserIngredients();
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };

  useEffect(() => {
    fetchAllIngredients();
    fetchUserIngredients();
  }, [userId]);

  // Get unique categories
  const categories = ['All', ...new Set(allIngredients.map(ing => ing.category).filter(Boolean))];

  // Filter ingredients
  const filteredIngredients = allIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if ingredient is in user's bar shelf
  const isInBarShelf = (ingredientName) => {
    return userIngredients.some(userIng => userIng.ingredient_name === ingredientName);
  };

  // Get user ingredient ID for removal
  const getUserIngredientId = (ingredientName) => {
    const userIng = userIngredients.find(userIng => userIng.ingredient_name === ingredientName);
    return userIng ? userIng.id : null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Bar Shelf</h1>
            <p className="text-muted-foreground">
              Add or remove ingredients from your bar shelf
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{userIngredients.length}</div>
            <div className="text-sm text-muted-foreground">In Your Bar</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 search-input"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-input border border-border rounded-md text-foreground"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{allIngredients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Your Bar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userIngredients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {Math.round((userIngredients.length / Math.max(allIngredients.length, 1)) * 100)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Filtered Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{filteredIngredients.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Ingredients ({filteredIngredients.length})
          </h2>

          {filteredIngredients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No ingredients found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search terms or category filter
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredIngredients.map((ingredient) => {
                const inBarShelf = isInBarShelf(ingredient.name);
                const userIngId = getUserIngredientId(ingredient.name);
                
                return (
                  <Card 
                    key={ingredient.name} 
                    className={`hover:border-primary/50 transition-all cursor-pointer ${
                      inBarShelf ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">{ingredient.name}</h3>
                          {ingredient.category && (
                            <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">
                              {ingredient.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {inBarShelf ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredient(userIngId)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addIngredient(ingredient.name)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            inBarShelf 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {inBarShelf && <Check className="w-2 h-2 text-primary-foreground" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBarShelf;

