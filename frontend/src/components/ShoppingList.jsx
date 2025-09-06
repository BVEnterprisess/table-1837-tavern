import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from './LoadingSpinner';

const ShoppingList = ({ userId = 1 }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState('');

  // Fetch user's shopping list
  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/shopping-list`);
      const data = await response.json();
      setShoppingList(data || []);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      setShoppingList([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to shopping list
  const addItem = async (itemName) => {
    if (!itemName.trim()) return;
    
    try {
      await fetch(`/api/users/${userId}/shopping-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredient_name: itemName.trim(),
        }),
      });
      setNewItem('');
      fetchShoppingList();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Remove item from shopping list
  const removeItem = async (itemId) => {
    try {
      await fetch(`/api/users/${userId}/shopping-list/${itemId}`, {
        method: 'DELETE',
      });
      fetchShoppingList();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Toggle item purchased status
  const togglePurchased = async (itemId, purchased) => {
    try {
      await fetch(`/api/users/${userId}/shopping-list/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchased: !purchased,
        }),
      });
      fetchShoppingList();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Clear purchased items
  const clearPurchased = async () => {
    try {
      await fetch(`/api/users/${userId}/shopping-list/clear-purchased`, {
        method: 'DELETE',
      });
      fetchShoppingList();
    } catch (error) {
      console.error('Error clearing purchased items:', error);
    }
  };

  // Add to bar shelf and remove from shopping list
  const addToBarShelf = async (item) => {
    try {
      // Add to bar shelf
      await fetch(`/api/users/${userId}/bar-shelf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredient_name: item.ingredient_name,
        }),
      });
      
      // Remove from shopping list
      await removeItem(item.id);
    } catch (error) {
      console.error('Error adding to bar shelf:', error);
    }
  };

  useEffect(() => {
    fetchShoppingList();
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(newItem);
  };

  const pendingItems = shoppingList.filter(item => !item.purchased);
  const purchasedItems = shoppingList.filter(item => item.purchased);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping List</h1>
            <p className="text-muted-foreground">
              Keep track of ingredients you need to buy
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{pendingItems.length}</div>
            <div className="text-sm text-muted-foreground">Items to Buy</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{shoppingList.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                To Buy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Purchased
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{purchasedItems.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Item */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter ingredient name..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newItem.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pending Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              To Buy ({pendingItems.length})
            </h2>
          </div>

          {pendingItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Your shopping list is empty
                </h3>
                <p className="text-muted-foreground text-center">
                  Add ingredients you need to buy for your cocktails
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <Card key={item.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => togglePurchased(item.id, item.purchased)}
                        />
                        <div>
                          <h3 className="font-medium text-foreground">{item.ingredient_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Added {new Date(item.date_added).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToBarShelf(item)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Add to Bar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Purchased Items */}
        {purchasedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Purchased ({purchasedItems.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearPurchased}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Purchased
              </Button>
            </div>

            <div className="space-y-2">
              {purchasedItems.map((item) => (
                <Card key={item.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => togglePurchased(item.id, item.purchased)}
                        />
                        <div>
                          <h3 className="font-medium text-foreground line-through">
                            {item.ingredient_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Purchased {new Date(item.date_purchased || item.date_added).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToBarShelf(item)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Add to Bar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;

