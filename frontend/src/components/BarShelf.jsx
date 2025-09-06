import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';

const BarShelf = ({ userId = 1 }) => {
  const [ingredients, setIngredients] = useState([]);
  const [makeableCocktails, setMakeableCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's bar shelf ingredients
  const fetchBarShelf = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/bar-shelf`);
      const data = await response.json();
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching bar shelf:', error);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cocktails that can be made with current ingredients
  const fetchMakeableCocktails = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/makeable`);
      const data = await response.json();
      setMakeableCocktails(data || []);
    } catch (error) {
      console.error('Error fetching makeable cocktails:', error);
      setMakeableCocktails([]);
    }
  };

  // Remove ingredient from bar shelf
  const removeIngredient = async (ingredientId) => {
    try {
      await fetch(`/api/users/${userId}/bar-shelf/${ingredientId}`, {
        method: 'DELETE',
      });
      fetchBarShelf();
      fetchMakeableCocktails();
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };

  useEffect(() => {
    fetchBarShelf();
    fetchMakeableCocktails();
  }, [userId]);

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.ingredient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-foreground">My Bar Shelf</h1>
            <p className="text-muted-foreground">
              Track your available ingredients and see what cocktails you can make
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{ingredients.length}</div>
            <div className="text-sm text-muted-foreground">Ingredients</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{ingredients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Makeable Cocktails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{makeableCocktails.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {ingredients.length > 0 ? Math.round((makeableCocktails.length / Math.max(ingredients.length, 1)) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>

        {/* Ingredients List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Ingredients</h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {filteredIngredients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {ingredients.length === 0 ? 'No ingredients yet' : 'No matching ingredients'}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {ingredients.length === 0 
                    ? 'Start building your bar by adding ingredients you have available'
                    : 'Try adjusting your search terms'
                  }
                </p>
                {ingredients.length === 0 && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Ingredient
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIngredients.map((ingredient) => (
                <Card key={ingredient.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{ingredient.ingredient_name}</h3>
                        {ingredient.quantity && (
                          <p className="text-sm text-muted-foreground">{ingredient.quantity}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(ingredient.date_added).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Makeable Cocktails */}
        {makeableCocktails.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Cocktails You Can Make ({makeableCocktails.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {makeableCocktails.slice(0, 6).map((cocktail) => (
                <Card key={cocktail.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-2">{cocktail.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cocktail.category === 'Cocktail' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {cocktail.category}
                      </span>
                      <span>{cocktail.glass}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {makeableCocktails.length > 6 && (
              <div className="text-center">
                <Button variant="outline">
                  View All {makeableCocktails.length} Makeable Cocktails
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarShelf;

