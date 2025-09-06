from flask_sqlalchemy import SQLAlchemy
from src.models.user import db
import json

class Cocktail(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    alcoholic = db.Column(db.String(50))
    glass = db.Column(db.String(100))
    instructions = db.Column(db.Text)
    image = db.Column(db.String(500))
    ingredients_json = db.Column(db.Text)  # Store ingredients as JSON
    video = db.Column(db.String(500))
    tags_json = db.Column(db.Text)  # Store tags as JSON
    iba = db.Column(db.String(100))
    date_modified = db.Column(db.String(50))
    garnish = db.Column(db.String(200))
    
    def __repr__(self):
        return f'<Cocktail {self.name}>'
    
    @property
    def ingredients(self):
        """Get ingredients as list of dictionaries"""
        if self.ingredients_json:
            return json.loads(self.ingredients_json)
        return []
    
    @ingredients.setter
    def ingredients(self, value):
        """Set ingredients from list of dictionaries"""
        self.ingredients_json = json.dumps(value) if value else None
    
    @property
    def tags(self):
        """Get tags as list"""
        if self.tags_json:
            return json.loads(self.tags_json)
        return []
    
    @tags.setter
    def tags(self, value):
        """Set tags from list"""
        self.tags_json = json.dumps(value) if value else None
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'alcoholic': self.alcoholic,
            'glass': self.glass,
            'instructions': self.instructions,
            'image': self.image,
            'ingredients': self.ingredients,
            'video': self.video,
            'tags': self.tags,
            'iba': self.iba,
            'date_modified': self.date_modified,
            'garnish': self.garnish
        }

class UserBarShelf(db.Model):
    """Track ingredients available in user's bar"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    ingredient_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.String(100))  # Optional quantity tracking
    date_added = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'ingredient_name': self.ingredient_name,
            'quantity': self.quantity,
            'date_added': self.date_added.isoformat() if self.date_added else None
        }

class UserFavorite(db.Model):
    """Track user's favorite cocktails"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cocktail_id = db.Column(db.String(50), db.ForeignKey('cocktail.id'), nullable=False)
    date_added = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cocktail_id': self.cocktail_id,
            'date_added': self.date_added.isoformat() if self.date_added else None
        }

class UserCocktail(db.Model):
    """User's custom cocktail recipes"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    glass = db.Column(db.String(100))
    instructions = db.Column(db.Text)
    ingredients_json = db.Column(db.Text)
    tags_json = db.Column(db.Text)
    garnish = db.Column(db.String(200))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    @property
    def ingredients(self):
        if self.ingredients_json:
            return json.loads(self.ingredients_json)
        return []
    
    @ingredients.setter
    def ingredients(self, value):
        self.ingredients_json = json.dumps(value) if value else None
    
    @property
    def tags(self):
        if self.tags_json:
            return json.loads(self.tags_json)
        return []
    
    @tags.setter
    def tags(self, value):
        self.tags_json = json.dumps(value) if value else None
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'category': self.category,
            'glass': self.glass,
            'instructions': self.instructions,
            'ingredients': self.ingredients,
            'tags': self.tags,
            'garnish': self.garnish,
            'date_created': self.date_created.isoformat() if self.date_created else None
        }

