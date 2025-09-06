import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CocktailDetail from './components/CocktailDetail';
import BarShelf from './components/BarShelf';
import ManageBarShelf from './components/ManageBarShelf';
import ShoppingList from './components/ShoppingList';

function App() {
  const [activeView, setActiveView] = useState('all-cocktails');
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({ categories: [], glasses: [], ingredients: [] });

  // Fetch cocktails from API
  const fetchCocktails = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        per_page: 50,
        ...params
      });
      
      const response = await fetch(`/api/cocktails?${queryParams}`);
      const data = await response.json();
      setCocktails(data.cocktails || []);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metadata
  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/metadata');
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  // Fetch featured cocktails
  const fetchFeaturedCocktails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cocktails/featured');
      const data = await response.json();
      setCocktails(data || []);
    } catch (error) {
      console.error('Error fetching featured cocktails:', error);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch seasonal cocktails
  const fetchSeasonalCocktails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cocktails/seasonal');
      const data = await response.json();
      setCocktails(data || []);
    } catch (error) {
      console.error('Error fetching seasonal cocktails:', error);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle view changes
  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedCocktail(null);
    setSearchQuery('');
    setSelectedCategory('All Categories');

    // Only fetch cocktails for cocktail-related views
    if (['featured-cocktails', 'seasonal-cocktails', 'all-cocktails'].includes(view)) {
      switch (view) {
        case 'featured-cocktails':
          fetchFeaturedCocktails();
          break;
        case 'seasonal-cocktails':
          fetchSeasonalCocktails();
          break;
        case 'all-cocktails':
        default:
          fetchCocktails();
          break;
      }
    } else if (view === 'my-cocktails') {
      // Fetch Fall 2025 Main Menu cocktails
      fetchMyCocktails();
    } else if (view === 'favorite-cocktails') {
      // Fetch empty favorites
      fetchFavoriteCocktails();
    }
  };

  // Fetch My Cocktails (Fall 2025 Main Menu)
  const fetchMyCocktails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/1/cocktails');
      const data = await response.json();
      setCocktails(data || []);
    } catch (error) {
      console.error('Error fetching my cocktails:', error);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Favorite Cocktails (empty)
  const fetchFavoriteCocktails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/1/favorites');
      const data = await response.json();
      setCocktails(data || []);
    } catch (error) {
      console.error('Error fetching favorite cocktails:', error);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const params = {};
    if (query) params.search = query;
    if (selectedCategory !== 'All Categories') params.category = selectedCategory;
    fetchCocktails(params);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category !== 'All Categories') params.category = category;
    fetchCocktails(params);
  };

  // Handle cocktail selection
  const handleCocktailSelect = (cocktail) => {
    setSelectedCocktail(cocktail);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedCocktail(null);
  };

  // Initial load
  useEffect(() => {
    fetchCocktails();
    fetchMetadata();
  }, []);

  // Render content based on active view
  const renderContent = () => {
    if (selectedCocktail) {
      return (
        <CocktailDetail 
          cocktail={selectedCocktail}
          onBack={handleBackToList}
        />
      );
    }

    switch (activeView) {
      case 'my-bar-shelf':
        return <BarShelf />;
      case 'manage-bar-shelf':
        return <ManageBarShelf />;
      case 'shopping-list':
        return <ShoppingList />;
      case 'all-cocktails':
      case 'my-cocktails':
      case 'favorite-cocktails':
      case 'featured-cocktails':
      case 'seasonal-cocktails':
      default:
        return (
          <MainContent
            activeView={activeView}
            cocktails={cocktails}
            loading={loading}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={metadata.categories}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onCocktailSelect={handleCocktailSelect}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
