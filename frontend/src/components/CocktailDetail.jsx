import React from 'react';
import { ArrowLeft, Wine, Clock, Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CocktailDetail = ({ cocktail, onBack }) => {
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
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          
          <div className="flex-1" />
          
          <Button variant="ghost" size="sm" className="hover:bg-secondary">
            <Heart className="w-4 h-4 mr-2" />
            Add to Favorites
          </Button>
          
          <Button variant="ghost" size="sm" className="hover:bg-secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-secondary/50">
              {cocktail.image ? (
                <img
                  src={cocktail.image}
                  alt={cocktail.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-96 ${cocktail.image ? 'hidden' : 'flex'} items-center justify-center bg-secondary/30`}
              >
                <Wine className="w-24 h-24 text-primary/50" />
              </div>
              
              {/* Signature Badge */}
              {isSignature && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Signature Cocktail
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Meta */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {cocktail.name}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(cocktail.category)}`}>
                  {cocktail.category}
                </span>
                {cocktail.iba && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                    IBA Official
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cocktail.alcoholic === 'Alcoholic' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {cocktail.alcoholic}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Wine className="w-4 h-4 text-primary" />
                  <span>{cocktail.glass}</span>
                </div>
                {cocktail.garnish && (
                  <div>
                    <span className="font-medium">Garnish:</span> {cocktail.garnish}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Ingredients</h2>
              <div className="space-y-2">
                {cocktail.ingredients?.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-secondary/30 rounded-lg">
                    <span className="font-medium text-foreground">{ingredient.name}</span>
                    <span className="text-sm text-muted-foreground">{ingredient.measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Instructions</h2>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-foreground leading-relaxed">
                  {cocktail.instructions}
                </p>
              </div>
            </div>

            {/* Tags */}
            {cocktail.tags && cocktail.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {cocktail.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Link */}
            {cocktail.video && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Video Tutorial</h2>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(cocktail.video, '_blank')}
                >
                  Watch Video Tutorial
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocktailDetail;

