from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.cocktail import Cocktail, UserBarShelf, UserFavorite, UserCocktail
from sqlalchemy import or_, and_
import json

cocktail_bp = Blueprint('cocktail', __name__)

@cocktail_bp.route('/cocktails', methods=['GET'])
def get_cocktails():
    """Get all cocktails with optional filtering and search"""
    try:
        # Get query parameters
        search = request.args.get('search', '').strip()
        category = request.args.get('category', '').strip()
        alcoholic = request.args.get('alcoholic', '').strip()
        glass = request.args.get('glass', '').strip()
        ingredient = request.args.get('ingredient', '').strip()
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query
        query = Cocktail.query
        
        # Apply filters
        if search:
            query = query.filter(
                or_(
                    Cocktail.name.ilike(f'%{search}%'),
                    Cocktail.instructions.ilike(f'%{search}%'),
                    Cocktail.ingredients_json.ilike(f'%{search}%')
                )
            )
        
        if category and category != 'All Categories':
            query = query.filter(Cocktail.category == category)
        
        if alcoholic:
            query = query.filter(Cocktail.alcoholic == alcoholic)
        
        if glass:
            query = query.filter(Cocktail.glass == glass)
        
        if ingredient:
            query = query.filter(Cocktail.ingredients_json.ilike(f'%{ingredient}%'))
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        cocktails = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return jsonify({
            'cocktails': [cocktail.to_dict() for cocktail in cocktails],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/cocktails/<cocktail_id>', methods=['GET'])
def get_cocktail(cocktail_id):
    """Get a specific cocktail by ID"""
    try:
        cocktail = Cocktail.query.get_or_404(cocktail_id)
        return jsonify(cocktail.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/cocktails/random', methods=['GET'])
def get_random_cocktail():
    """Get a random cocktail"""
    try:
        cocktail = Cocktail.query.order_by(db.func.random()).first()
        if cocktail:
            return jsonify(cocktail.to_dict())
        return jsonify({'error': 'No cocktails found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/cocktails/featured', methods=['GET'])
def get_featured_cocktails():
    """Get featured cocktails (signature cocktails)"""
    try:
        featured = Cocktail.query.filter(
            Cocktail.tags_json.ilike('%signature%')
        ).all()
        
        if not featured:
            # Fallback to IBA cocktails
            featured = Cocktail.query.filter(
                Cocktail.iba.isnot(None),
                Cocktail.iba != ''
            ).limit(10).all()
        
        return jsonify([cocktail.to_dict() for cocktail in featured])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/cocktails/seasonal', methods=['GET'])
def get_seasonal_cocktails():
    """Get seasonal cocktails"""
    try:
        # For now, return cocktails with seasonal ingredients or tags
        seasonal = Cocktail.query.filter(
            or_(
                Cocktail.tags_json.ilike('%seasonal%'),
                Cocktail.ingredients_json.ilike('%cranberry%'),
                Cocktail.ingredients_json.ilike('%pumpkin%'),
                Cocktail.ingredients_json.ilike('%cinnamon%'),
                Cocktail.ingredients_json.ilike('%apple%')
            )
        ).limit(20).all()
        
        return jsonify([cocktail.to_dict() for cocktail in seasonal])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/metadata', methods=['GET'])
def get_metadata():
    """Get cocktail metadata (categories, glasses, ingredients)"""
    try:
        # Get unique categories
        categories = db.session.query(Cocktail.category).distinct().filter(
            Cocktail.category.isnot(None)
        ).all()
        categories = [cat[0] for cat in categories if cat[0]]
        
        # Get unique glasses
        glasses = db.session.query(Cocktail.glass).distinct().filter(
            Cocktail.glass.isnot(None)
        ).all()
        glasses = [glass[0] for glass in glasses if glass[0]]
        
        # Get ingredients from JSON (this is more complex, simplified for now)
        ingredients = set()
        cocktails = Cocktail.query.all()
        for cocktail in cocktails:
            for ingredient in cocktail.ingredients:
                if ingredient.get('name'):
                    ingredients.add(ingredient['name'])
        
        return jsonify({
            'categories': sorted(categories),
            'glasses': sorted(glasses),
            'ingredients': sorted(list(ingredients))
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User-specific routes
@cocktail_bp.route('/users/<int:user_id>/bar-shelf', methods=['GET'])
def get_user_bar_shelf(user_id):
    """Get user's bar shelf ingredients"""
    try:
        ingredients = UserBarShelf.query.filter_by(user_id=user_id).all()
        return jsonify([ingredient.to_dict() for ingredient in ingredients])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/bar-shelf', methods=['POST'])
def add_to_bar_shelf(user_id):
    """Add ingredient to user's bar shelf"""
    try:
        data = request.get_json()
        ingredient_name = data.get('ingredient_name')
        quantity = data.get('quantity', '')
        
        if not ingredient_name:
            return jsonify({'error': 'Ingredient name is required'}), 400
        
        # Check if ingredient already exists
        existing = UserBarShelf.query.filter_by(
            user_id=user_id,
            ingredient_name=ingredient_name
        ).first()
        
        if existing:
            existing.quantity = quantity
            db.session.commit()
            return jsonify(existing.to_dict())
        
        # Create new ingredient
        ingredient = UserBarShelf(
            user_id=user_id,
            ingredient_name=ingredient_name,
            quantity=quantity
        )
        db.session.add(ingredient)
        db.session.commit()
        
        return jsonify(ingredient.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/bar-shelf/<int:ingredient_id>', methods=['DELETE'])
def remove_from_bar_shelf(user_id, ingredient_id):
    """Remove ingredient from user's bar shelf"""
    try:
        ingredient = UserBarShelf.query.filter_by(
            id=ingredient_id,
            user_id=user_id
        ).first_or_404()
        
        db.session.delete(ingredient)
        db.session.commit()
        
        return jsonify({'message': 'Ingredient removed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/cocktails', methods=['GET'])
def get_user_cocktails(user_id):
    """Get user's custom cocktails - Fall 2025 Main Menu"""
    try:
        # Hardcode Fall 2025 menu data for reliability
        fall_menu = [
            {
                "id": "fall_2025_001",
                "name": "Orchard Mule",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Copper Mule Mug",
                "instructions": "Add vodka, cloudy apple cider, fresh lime juice, and house-spiced demerara syrup to a copper mule mug filled with ice. Top with ginger beer and stir gently. Garnish with cinnamon stick, dehydrated apple wheel, and star anise.",
                "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
                "ingredients": [
                    {"name": "Vodka", "measure": "1.5 oz"},
                    {"name": "Cloudy Apple Cider", "measure": "2 oz"},
                    {"name": "Fresh Lime Juice", "measure": "0.5 oz"},
                    {"name": "House-Spiced Demerara Syrup", "measure": "0.25 oz"},
                    {"name": "Ginger Beer", "measure": "2 oz"}
                ],
                "garnish": "Cinnamon stick, dehydrated apple wheel, star anise",
                "tags": ["Crisp", "Spiced", "Effervescent", "Seasonal"],
                "notes": "Crowd-pleaser; rustic visual, easy to batch syrup in advance"
            },
            {
                "id": "fall_2025_002",
                "name": "Autumn Ember",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Highball",
                "instructions": "Use dark rum infused with fig & spice for 24-48 hours. Add rum, fresh lime juice, and demerara syrup to a highball glass filled with ice. Top with ginger beer and stir gently. Garnish with fig slice, Luxardo cherry, and cinnamon stick.",
                "image": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400",
                "ingredients": [
                    {"name": "Dark Rum (fig & spice infused)", "measure": "1.5 oz"},
                    {"name": "Fresh Lime Juice", "measure": "0.75 oz"},
                    {"name": "Demerara Syrup", "measure": "0.25 oz"},
                    {"name": "Ginger Beer", "measure": "2 oz"}
                ],
                "garnish": "Fig slice, Luxardo cherry, cinnamon stick",
                "tags": ["Dark", "Spiced", "Fig-forward"],
                "notes": "Bold fall cocktail; photogenic, visually rich"
            },
            {
                "id": "fall_2025_003",
                "name": "Blood Orange Cava Spritz",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Wine Glass",
                "instructions": "Add Aperol and blood orange liqueur to a wine glass filled with ice. Top with Cava and soda water. Stir gently and garnish with dehydrated blood orange wheel and optional mint.",
                "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
                "ingredients": [
                    {"name": "Aperol", "measure": "1 oz"},
                    {"name": "Blood Orange Liqueur", "measure": "0.5 oz"},
                    {"name": "Cava", "measure": "3 oz"},
                    {"name": "Soda Water", "measure": "0.5 oz"}
                ],
                "garnish": "Dehydrated blood orange wheel, optional mint",
                "tags": ["Bright", "Fizzy", "Citrus-forward"],
                "notes": "Refreshing, photogenic, keeps high menu visibility"
            },
            {
                "id": "fall_2025_004",
                "name": "Mill Manhattan",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Coupe",
                "instructions": "Add rye whiskey, sweet vermouth, and Angostura bitters to a mixing glass filled with ice. Stir well and strain into a chilled coupe glass. Garnish with a Luxardo cherry.",
                "image": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400",
                "ingredients": [
                    {"name": "Rye Whiskey", "measure": "2 oz"},
                    {"name": "Sweet Vermouth", "measure": "0.75 oz"},
                    {"name": "Angostura Bitters", "measure": "2 dashes"}
                ],
                "garnish": "Luxardo Cherry",
                "tags": ["Premium", "Rye-forward", "Bitter-sweet"],
                "notes": "Price anchor; high-margin, classic presentation"
            },
            {
                "id": "fall_2025_005",
                "name": "Apple Martini",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Coupe",
                "instructions": "Add Grey Goose vodka and dry vermouth to a mixing glass filled with ice. Stir well and strain into a chilled coupe glass. Garnish with 2 blue cheese stuffed olives.",
                "image": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
                "ingredients": [
                    {"name": "Grey Goose Vodka", "measure": "2 oz"},
                    {"name": "Dry Vermouth", "measure": "0.25 oz"}
                ],
                "garnish": "2 Blue Cheese Stuffed Olives",
                "tags": ["Crisp", "Savory", "Ultra-dry"],
                "notes": "Tribute drink; high-contrast, Instagram-ready"
            },
            {
                "id": "fall_2025_006",
                "name": "Harvest Float",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Rocks Glass",
                "instructions": "Add vodka and coffee liqueur to a rocks glass filled with ice. Slowly float the pumpkin cream mixture on top. Garnish with nutmeg dusting and cinnamon stick.",
                "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
                "ingredients": [
                    {"name": "Vodka", "measure": "1 oz"},
                    {"name": "Coffee Liqueur", "measure": "0.5 oz"},
                    {"name": "Pumpkin Cream Float", "measure": "0.5-0.75 oz"}
                ],
                "garnish": "Nutmeg dusting, cinnamon stick",
                "tags": ["Creamy", "Spiced", "Indulgent"],
                "notes": "Seasonal dessert cocktail; layered float visually striking"
            },
            {
                "id": "fall_2025_007",
                "name": "Espressotini",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Coupe",
                "instructions": "Add vodka, coffee liqueur, and fresh espresso to a cocktail shaker filled with ice. Shake vigorously and strain into a chilled coupe glass. Garnish with cocoa stencil or vanilla garnish.",
                "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                "ingredients": [
                    {"name": "Vodka", "measure": "1.5 oz"},
                    {"name": "Coffee Liqueur", "measure": "1 oz"},
                    {"name": "Fresh Espresso", "measure": "0.5 oz"}
                ],
                "garnish": "Cocoa stencil or vanilla garnish",
                "tags": ["Coffee-forward", "Bold", "Dessert"],
                "notes": "Second dessert option; aromatic and photogenic"
            },
            {
                "id": "fall_2025_008",
                "name": "Cucumber Elder Collins",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Collins Glass",
                "instructions": "Muddle 2-3 cucumber slices in the bottom of a Collins glass. Add gin, elderflower liqueur, fresh lemon juice, and ruby red grapefruit juice. Fill with ice and top with soda water. Garnish with cucumber ribbon spiraling inside glass and lemon wheel.",
                "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
                "ingredients": [
                    {"name": "Gin", "measure": "1.5 oz"},
                    {"name": "Elderflower Liqueur", "measure": "0.5 oz"},
                    {"name": "Fresh Lemon Juice", "measure": "0.75 oz"},
                    {"name": "Ruby Red Grapefruit Juice", "measure": "1 oz"},
                    {"name": "Cucumber Slices", "measure": "2-3 slices"},
                    {"name": "Soda Water", "measure": "2 oz"}
                ],
                "garnish": "Cucumber ribbon spiraling inside glass, lemon wheel",
                "tags": ["Herbal", "Crisp", "Refreshing"],
                "notes": "Bright, visual, refreshing; perfect for contrast to heavier cocktails"
            },
            {
                "id": "fall_2025_009",
                "name": "Chili-Pama Margarita",
                "category": "Cocktail",
                "alcoholic": "Alcoholic",
                "glass": "Rocks Glass",
                "instructions": "Rim rocks glass with chili-salt. Add tequila blanco, Pama liqueur, fresh lime juice, and agave syrup to a cocktail shaker filled with ice. Shake well and strain into the prepared glass over fresh ice. Garnish with lime wheel.",
                "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
                "ingredients": [
                    {"name": "Tequila Blanco", "measure": "1.5 oz"},
                    {"name": "Pama Liqueur", "measure": "0.5 oz"},
                    {"name": "Fresh Lime Juice", "measure": "1 oz"},
                    {"name": "Agave Syrup", "measure": "0.25 oz"}
                ],
                "garnish": "Chili-salt rim, lime wheel",
                "tags": ["Tart", "Spicy", "Ruby-red elegance"],
                "notes": "Elegant tart/spicy combo; visually strong, color-forward"
            }
        ]
        
        return jsonify(fall_menu)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    """Get user's favorite cocktails - should be empty"""
    try:
        # Always return empty array for favorites
        return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/cocktails', methods=['POST'])
def create_user_cocktail(user_id):
    """Create a new user cocktail"""
    try:
        data = request.get_json()
        
        cocktail = UserCocktail(
            user_id=user_id,
            name=data.get('name'),
            category=data.get('category'),
            glass=data.get('glass'),
            instructions=data.get('instructions'),
            garnish=data.get('garnish')
        )
        
        if data.get('ingredients'):
            cocktail.ingredients = data['ingredients']
        if data.get('tags'):
            cocktail.tags = data['tags']
        
        db.session.add(cocktail)
        db.session.commit()
        
        return jsonify(cocktail.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/makeable', methods=['GET'])
def get_makeable_cocktails(user_id):
    """Get cocktails that can be made with user's bar shelf"""
    try:
        # Get user's ingredients
        user_ingredients = UserBarShelf.query.filter_by(user_id=user_id).all()
        user_ingredient_names = {ing.ingredient_name.lower() for ing in user_ingredients}
        
        if not user_ingredient_names:
            return jsonify([])
        
        # Find cocktails that can be made
        makeable = []
        cocktails = Cocktail.query.all()
        
        for cocktail in cocktails:
            cocktail_ingredients = {ing['name'].lower() for ing in cocktail.ingredients}
            if cocktail_ingredients.issubset(user_ingredient_names):
                makeable.append(cocktail.to_dict())
        
        return jsonify(makeable)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cocktail_bp.route('/users/<int:user_id>/shopping-list', methods=['GET'])
def get_shopping_list(user_id):
    """Generate shopping list for missing ingredients"""
    try:
        # Get user's current ingredients
        user_ingredients = UserBarShelf.query.filter_by(user_id=user_id).all()
        user_ingredient_names = {ing.ingredient_name.lower() for ing in user_ingredients}
        
        # Get user's favorite cocktails
        favorites = db.session.query(Cocktail).join(
            UserFavorite, Cocktail.id == UserFavorite.cocktail_id
        ).filter(UserFavorite.user_id == user_id).all()
        
        # Calculate missing ingredients
        missing_ingredients = set()
        for cocktail in favorites:
            for ingredient in cocktail.ingredients:
                ingredient_name = ingredient['name'].lower()
                if ingredient_name not in user_ingredient_names:
                    missing_ingredients.add(ingredient['name'])
        
        return jsonify({
            'missing_ingredients': sorted(list(missing_ingredients)),
            'total_items': len(missing_ingredients)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

