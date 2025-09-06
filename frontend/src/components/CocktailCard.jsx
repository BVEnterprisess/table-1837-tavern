import React from 'react';
import { Wine, Clock, Star } from 'lucide-react';

const CocktailCard = ({ cocktail, onClick }) => {
  const getGlassIcon = () => {
    return <Wine className="w-4 h-4 text-primary" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Cocktail': 'bg-blue-500/20 text-blue-400',
      'Shot': 'bg-red-500/20 text-red-400',
      'Ordinary Drink': 'bg-green-500/20 text-green-400',
      'Punch / Party Drink': 'bg-purple-500/20 text-purple-400',
      'Beer': 'bg-yellow-500/20 text-yellow-400',
      'Coffee / Tea': 'bg-orange-500/20 text-orange-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const isSignature = cocktail.tags && cocktail.tags.includes('signature');

  return (
    <div className="cocktail-card group" onClick={onClick}>
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-secondary/50">
        {cocktail.image ? (
          <img
            src={cocktail.image}
            alt={cocktail.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-48 ${cocktail.image ? 'hidden' : 'flex'} items-center justify-center bg-secondary/30`}
        >
          <Wine className="w-12 h-12 text-primary/50" />
        </div>
        
        {/* Signature Badge */}
        {isSignature && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3" />
            Signature
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {cocktail.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(cocktail.category)}`}>
              {cocktail.category}
            </span>
            {cocktail.iba && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                IBA
              </span>
            )}
          </div>
        </div>

        {/* Glass and Alcoholic */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {getGlassIcon()}
            <span>{cocktail.glass}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            cocktail.alcoholic === 'Alcoholic' 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {cocktail.alcoholic}
          </span>
        </div>

        {/* Ingredients Preview */}
        <div className="text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-1">
            {cocktail.ingredients?.slice(0, 3).map((ingredient, index) => (
              <span key={index} className="text-xs">
                {ingredient.name}
                {index < Math.min(cocktail.ingredients.length - 1, 2) && ','}
              </span>
            ))}
            {cocktail.ingredients?.length > 3 && (
              <span className="text-xs text-primary">
                +{cocktail.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Instructions Preview */}
        {cocktail.instructions && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cocktail.instructions}
          </p>
        )}
      </div>
    </div>
  );
};

export default CocktailCard;

