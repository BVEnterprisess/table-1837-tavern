#!/usr/bin/env python3
"""
Load cocktail data from JSON file into the database
"""

import os
import sys
import json

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from flask import Flask
from src.models.user import db
from src.models.cocktail import Cocktail

def create_app():
    """Create Flask app for database operations"""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'src', 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

def load_cocktails_from_json():
    """Load cocktails from JSON file into database"""
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Load cocktail data
        json_path = '/home/ubuntu/cocktails_database.json'
        if not os.path.exists(json_path):
            print(f"Error: {json_path} not found")
            return
        
        with open(json_path, 'r', encoding='utf-8') as f:
            cocktails_data = json.load(f)
        
        print(f"Loading {len(cocktails_data)} cocktails...")
        
        # Clear existing cocktails
        Cocktail.query.delete()
        db.session.commit()
        
        # Load new cocktails
        loaded_count = 0
        for cocktail_data in cocktails_data:
            try:
                cocktail = Cocktail(
                    id=cocktail_data.get('id', ''),
                    name=cocktail_data.get('name', ''),
                    category=cocktail_data.get('category', ''),
                    alcoholic=cocktail_data.get('alcoholic', ''),
                    glass=cocktail_data.get('glass', ''),
                    instructions=cocktail_data.get('instructions', ''),
                    image=cocktail_data.get('image', ''),
                    video=cocktail_data.get('video', ''),
                    iba=cocktail_data.get('iba', ''),
                    date_modified=cocktail_data.get('date_modified', ''),
                    garnish=cocktail_data.get('garnish', '')
                )
                
                # Set ingredients and tags using properties
                cocktail.ingredients = cocktail_data.get('ingredients', [])
                cocktail.tags = cocktail_data.get('tags', [])
                
                db.session.add(cocktail)
                loaded_count += 1
                
                # Commit in batches
                if loaded_count % 100 == 0:
                    db.session.commit()
                    print(f"Loaded {loaded_count} cocktails...")
                    
            except Exception as e:
                print(f"Error loading cocktail {cocktail_data.get('name', 'Unknown')}: {e}")
                continue
        
        # Final commit
        db.session.commit()
        print(f"Successfully loaded {loaded_count} cocktails into database")
        
        # Verify the data
        total_in_db = Cocktail.query.count()
        print(f"Total cocktails in database: {total_in_db}")
        
        # Show some sample cocktails
        samples = Cocktail.query.limit(5).all()
        print("\nSample cocktails:")
        for cocktail in samples:
            print(f"- {cocktail.name} ({cocktail.category})")

if __name__ == "__main__":
    load_cocktails_from_json()

