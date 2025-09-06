# Cocktail Rolodex - Complete Codebase Overview

## 📁 File Structure and Key Components

### Backend (Flask) - `/cocktail-rolodex/backend/`

#### Core Application Files

**`src/main.py`** - Main Flask application entry point
- Configures Flask app with static file serving
- Registers API blueprints
- Sets up SQLAlchemy database
- Handles React app routing

**`src/models/user.py`** - Database models
- User model for authentication
- SQLAlchemy configuration
- Database initialization

**`src/models/cocktail.py`** - Cocktail data model
- Cocktail class for data structure
- Ingredient parsing and formatting
- Database interaction methods

#### API Routes

**`src/routes/cocktail.py`** - Main cocktail API endpoints
- `/api/cocktails` - List cocktails with search/filter
- `/api/cocktails/featured` - Featured cocktails
- `/api/cocktails/seasonal` - Seasonal cocktails
- `/api/metadata` - Categories, glasses, ingredients
- `/api/ingredients` - Master ingredient list

**`src/routes/user.py`** - User management endpoints
- `/api/users/{id}/bar-shelf` - Bar shelf management
- `/api/users/{id}/shopping-list` - Shopping list CRUD
- `/api/users/{id}/makeable` - Cocktails user can make
- `/api/users/{id}/favorites` - Favorite cocktails

#### Database and Data

**`load_cocktails.py`** - Database seeding script
- Loads 700+ cocktails from JSON into SQLite
- Creates database tables
- Populates initial data

**`cocktails_database.json`** - Complete cocktail database
- 700+ cocktail recipes
- Ingredients, instructions, images
- Categories and metadata

**`src/database/app.db`** - SQLite database file
- Stores all application data
- User preferences and collections
- Cocktail recipes and metadata

### Frontend (React) - `/cocktail-rolodex/frontend/`

#### Main Application

**`src/App.jsx`** - Root React component
- Main application state management
- View routing and navigation
- API integration and data fetching
- Component orchestration

**`src/App.css`** - Global application styles
- Dark theme implementation
- Table 1837 Tavern branding
- Responsive design rules
- Component styling

#### Core Components

**`src/components/Sidebar.jsx`** - Navigation sidebar
- Menu items and active state
- Professional bartender theme
- Responsive mobile menu

**`src/components/MainContent.jsx`** - Main content area
- Search and filter interface
- Cocktail grid display
- Pagination and loading states

**`src/components/CocktailCard.jsx`** - Individual cocktail display
- Recipe preview cards
- Image, name, and basic info
- Click handling for details

**`src/components/CocktailDetail.jsx`** - Detailed cocktail view
- Complete recipe information
- Ingredients with measurements
- Instructions and garnish details
- Back navigation

#### Feature Components

**`src/components/BarShelf.jsx`** - My Bar Shelf view
- Display user's ingredients
- Show makeable cocktails
- Ingredient statistics

**`src/components/ManageBarShelf.jsx`** - Ingredient management
- Add/remove ingredients
- Search ingredient database
- Category filtering

**`src/components/ShoppingList.jsx`** - Shopping list management
- Add items to buy
- Mark items as purchased
- Move items to bar shelf

**`src/components/LoadingSpinner.jsx`** - Loading indicator
- Consistent loading UI
- Used across components

#### Configuration

**`vite.config.js`** - Vite build configuration
- Development server settings
- API proxy configuration
- Build optimization

**`package.json`** - Frontend dependencies
- React and related packages
- Build scripts and commands
- Development dependencies

## 🔧 Key Technical Implementation Details

### Database Design

The application uses SQLite with these main tables:

```sql
-- Cocktails table (populated from JSON)
CREATE TABLE cocktails (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    alcoholic TEXT,
    glass TEXT,
    instructions TEXT,
    image TEXT,
    ingredients TEXT, -- JSON array
    garnish TEXT,
    tags TEXT -- JSON array
);

-- User bar shelf
CREATE TABLE user_bar_shelf (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ingredient_name TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shopping list
CREATE TABLE user_shopping_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ingredient_name TEXT,
    purchased BOOLEAN DEFAULT FALSE,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Architecture

**RESTful Design:**
- GET endpoints for data retrieval
- POST endpoints for creating resources
- PUT endpoints for updates
- DELETE endpoints for removal

**Response Format:**
```json
{
  "cocktails": [...],
  "page": 1,
  "pages": 140,
  "per_page": 50,
  "total": 700
}
```

**Error Handling:**
- Consistent error response format
- HTTP status codes
- Detailed error messages

### Frontend State Management

**React Hooks Used:**
- `useState` for component state
- `useEffect` for side effects and API calls
- Custom state management for complex interactions

**Data Flow:**
1. App.jsx manages global state
2. Components receive props and callbacks
3. API calls centralized in App.jsx
4. State updates trigger re-renders

### Responsive Design

**CSS Grid and Flexbox:**
- Flexible layouts for all screen sizes
- Mobile-first approach
- Breakpoints for tablet and desktop

**Component Responsiveness:**
- Sidebar collapses on mobile
- Card grids adapt to screen width
- Touch-friendly interface elements

### Search and Filtering

**Multi-criteria Search:**
- Text search across cocktail names
- Category filtering
- Ingredient-based filtering
- Real-time search results

**Performance Optimization:**
- Debounced search input
- Pagination for large result sets
- Efficient database queries

## 🎨 Design System

### Color Palette
- **Background:** Dark charcoal (#1a1a1a)
- **Primary:** Golden yellow (#fbbf24)
- **Text:** White (#ffffff)
- **Accent:** Muted colors for categories
- **Cards:** Dark gray with subtle borders

### Typography
- **Headers:** Bold, prominent sizing
- **Body:** Clean, readable fonts
- **Labels:** Consistent sizing and spacing

### Component Patterns
- **Cards:** Consistent padding and shadows
- **Buttons:** Golden accent with hover states
- **Inputs:** Dark theme with golden focus
- **Icons:** Lucide React icon library

## 🚀 Build and Deployment

### Development Workflow
1. Backend runs on port 5000
2. Frontend dev server on port 5173
3. Vite proxy handles API calls
4. Hot reload for development

### Production Build
1. `pnpm build` creates optimized bundle
2. Files copied to Flask static directory
3. Flask serves both API and frontend
4. Single deployment artifact

### Deployment Architecture
- Flask application serves everything
- SQLite database included
- Static files served by Flask
- CORS enabled for development

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting with Vite
- Optimized bundle size
- Lazy loading for images
- Efficient re-rendering

### Backend Optimization
- Database indexing on search fields
- Pagination for large datasets
- Efficient SQL queries
- Response caching headers

### User Experience
- Loading states for all async operations
- Error handling with user feedback
- Responsive design for all devices
- Intuitive navigation patterns

This codebase represents a complete, production-ready cocktail management application with professional-grade architecture and implementation.

