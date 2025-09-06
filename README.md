# Table 1837 Tavern - Cocktail Rolodex Web Application

A comprehensive cocktail recipe management system with 700+ premium cocktail recipes, built with React frontend and Flask backend.

## 🍸 Features

- **700+ Premium Cocktail Recipes** - Complete database of classic and modern cocktails
- **Professional Bar Management** - Track ingredients, manage inventory, shopping lists
- **Advanced Search & Filtering** - Find cocktails by name, ingredient, category, or glass type
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Dark Professional Theme** - Matches the Table 1837 Tavern aesthetic

## 🎯 Sidebar Features

- **My Bar Shelf** - Track available ingredients and see makeable cocktails
- **Manage Bar Shelf** - Add/remove ingredients from your collection
- **Shopping List** - Keep track of ingredients you need to buy
- **All Cocktails** - Browse the complete database
- **My Cocktails** - Save personal cocktail collection
- **Favorite Cocktails** - Mark and access favorite drinks
- **Featured Cocktails** - Signature drinks and house specials
- **Seasonal Cocktails** - Curated seasonal selections

## 🚀 Live Demo

**Production URL:** https://j6h5i7cglw3d.manus.space

## 📁 Project Structure

```
cocktail-rolodex/
├── backend/                 # Flask backend application
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── static/         # Built frontend files
│   │   └── main.py         # Flask application entry point
│   ├── venv/               # Python virtual environment
│   ├── cocktails_database.json
│   ├── load_cocktails.py   # Database seeding script
│   └── requirements.txt
└── frontend/               # React frontend application
    ├── src/
    │   ├── components/     # React components
    │   ├── App.jsx         # Main application component
    │   └── App.css         # Application styles
    ├── dist/               # Built production files
    ├── package.json
    └── vite.config.js
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 20+
- pnpm (or npm)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd cocktail-rolodex/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Load cocktail database:**
   ```bash
   python load_cocktails.py
   ```

5. **Start Flask server:**
   ```bash
   python src/main.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup (Development)

1. **Navigate to frontend directory:**
   ```bash
   cd cocktail-rolodex/frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install  # or npm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev  # or npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Production Build

1. **Build frontend:**
   ```bash
   cd frontend
   pnpm build
   ```

2. **Copy built files to Flask static directory:**
   ```bash
   cp -r dist/* ../backend/src/static/
   ```

3. **Start Flask server:**
   ```bash
   cd ../backend
   source venv/bin/activate
   python src/main.py
   ```

   The complete application will be available at `http://localhost:5000`

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

- **cocktails** - Cocktail recipes with ingredients and instructions
- **ingredients** - Master list of all ingredients
- **user_bar_shelf** - User's available ingredients
- **user_shopping_list** - User's shopping list items
- **user_favorites** - User's favorite cocktails

## 🎨 Design Features

- **Dark Theme** - Professional bar atmosphere
- **Golden Accents** - Elegant highlighting and branding
- **Responsive Layout** - Mobile-first design approach
- **Professional Typography** - Clean, readable fonts
- **Intuitive Navigation** - Easy-to-use sidebar and search

## 🔧 API Endpoints

### Cocktails
- `GET /api/cocktails` - List cocktails with pagination and filtering
- `GET /api/cocktails/featured` - Get featured cocktails
- `GET /api/cocktails/seasonal` - Get seasonal cocktails
- `GET /api/metadata` - Get categories, glasses, and ingredients

### User Management
- `GET /api/users/{id}/bar-shelf` - Get user's ingredients
- `POST /api/users/{id}/bar-shelf` - Add ingredient to bar shelf
- `DELETE /api/users/{id}/bar-shelf/{ingredient_id}` - Remove ingredient
- `GET /api/users/{id}/shopping-list` - Get shopping list
- `POST /api/users/{id}/shopping-list` - Add to shopping list
- `GET /api/users/{id}/makeable` - Get cocktails user can make

## 🧪 Testing

The application has been thoroughly tested with:
- All sidebar functionality working correctly
- Search and filtering capabilities
- Responsive design on multiple screen sizes
- API endpoints returning proper data
- Database operations for user management

## 📦 Dependencies

### Backend (Python)
- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- Flask-SQLAlchemy - Database ORM
- SQLite - Database

### Frontend (JavaScript)
- React - UI framework
- Vite - Build tool and dev server
- Lucide React - Icons
- Modern CSS with CSS Grid and Flexbox

## 🚀 Deployment

The application is deployed using Manus deployment service and is available at:
**https://j6h5i7cglw3d.manus.space**

For custom deployment:
1. Build the frontend (`pnpm build`)
2. Copy built files to Flask static directory
3. Deploy Flask application to your preferred hosting service
4. Ensure SQLite database is properly initialized

## 📄 License

This project is created for demonstration purposes. All cocktail recipes are sourced from public APIs and databases.

## 🤝 Contributing

This is a complete implementation of the requested cocktail rolodex application. The codebase is well-structured and documented for easy maintenance and extension.

