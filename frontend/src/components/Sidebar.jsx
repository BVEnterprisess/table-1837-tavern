import React from 'react';
import { 
  Home, 
  Settings, 
  ShoppingCart, 
  Wine, 
  Heart, 
  Star, 
  Calendar,
  Search,
  Sun,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const Sidebar = ({ activeView, onViewChange }) => {
  const navigationItems = [
    { id: 'my-bar-shelf', label: 'My Bar Shelf', icon: Home },
    { id: 'manage-bar-shelf', label: 'Manage Bar Shelf', icon: Settings },
    { id: 'shopping-list', label: 'Shopping List', icon: ShoppingCart },
    { id: 'all-cocktails', label: 'All Cocktails', icon: Wine },
    { id: 'my-cocktails', label: 'My Cocktails', icon: Heart },
    { id: 'favorite-cocktails', label: 'Favorite Cocktails', icon: Heart },
    { id: 'featured-cocktails', label: 'Featured Cocktails', icon: Star },
    { id: 'seasonal-cocktails', label: 'Seasonal Cocktails', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wine className="w-5 h-5 text-primary-foreground cocktail-glass-icon" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Table 1837</h1>
            <h2 className="text-lg font-bold text-sidebar-foreground">Tavern</h2>
          </div>
          <Sun className="w-5 h-5 text-primary ml-auto cursor-pointer hover:text-primary/80 transition-colors" />
        </div>
        <p className="text-sm text-sidebar-foreground/70">Professional Cocktail Manager</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search cocktails, ingredients"
            className="pl-10 search-input"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Bartender</p>
            <p className="text-xs text-sidebar-foreground/70">Mixologist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

