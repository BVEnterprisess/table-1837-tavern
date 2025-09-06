# Table 1837 Tavern - Installation Guide

## 🚀 Quick Start

This guide will help you set up the complete cocktail rolodex application on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11 or higher**
- **Node.js 20 or higher**
- **pnpm** (recommended) or npm
- **Git** (for cloning)

## 📦 Installation Steps

### Step 1: Extract the Source Code

Extract the provided source code archive:
```bash
tar -xzf cocktail-app-complete-source.tar.gz
cd cocktail-app-source
```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   
   **On macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```
   
   **On Windows:**
   ```bash
   venv\Scripts\activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Load the cocktail database:**
   ```bash
   python load_cocktails.py
   ```
   
   You should see output like:
   ```
   Loading 700 cocktails...
   Loaded 100 cocktails...
   ...
   Successfully loaded 700 cocktails into database
   ```

### Step 3: Frontend Setup (Development Mode)

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   pnpm install
   ```
   
   Or if using npm:
   ```bash
   npm install
   ```

### Step 4: Running the Application

#### Option A: Development Mode (Recommended for development)

1. **Start the Flask backend** (in backend directory):
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python src/main.py
   ```
   
   Backend will be available at: `http://localhost:5000`

2. **Start the React frontend** (in frontend directory, new terminal):
   ```bash
   pnpm dev
   ```
   
   Frontend will be available at: `http://localhost:5173`

#### Option B: Production Mode (Single server)

1. **Build the frontend:**
   ```bash
   cd frontend
   pnpm build
   ```

2. **Copy built files to Flask static directory:**
   ```bash
   cp -r dist/* ../backend/src/static/
   ```

3. **Start the Flask server:**
   ```bash
   cd ../backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python src/main.py
   ```
   
   Complete application available at: `http://localhost:5000`

## 🎯 Verification

Once running, you should be able to:

1. **Access the application** in your web browser
2. **See the Table 1837 Tavern interface** with dark theme
3. **Browse 700+ cocktail recipes** in the main area
4. **Use all sidebar features:**
   - My Bar Shelf
   - Manage Bar Shelf
   - Shopping List
   - All Cocktails
   - Featured Cocktails
   - etc.

## 🔧 Troubleshooting

### Common Issues

**1. Python virtual environment issues:**
```bash
# Make sure you're in the backend directory
cd backend
# Recreate the virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**2. Node.js dependency issues:**
```bash
# Clear npm/pnpm cache
pnpm store prune  # or npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install  # or npm install
```

**3. Database not loading:**
```bash
# Make sure you're in the backend directory with venv activated
cd backend
source venv/bin/activate
# Check if the JSON file exists
ls -la cocktails_database.json
# Reload the database
python load_cocktails.py
```

**4. Frontend not connecting to backend:**
- Make sure both servers are running
- Check that backend is on port 5000
- Verify the Vite proxy configuration in `vite.config.js`

**5. Port conflicts:**
```bash
# Check what's running on ports 5000 and 5173
lsof -i :5000
lsof -i :5173
# Kill processes if needed
kill -9 <PID>
```

## 📁 Project Structure After Installation

```
cocktail-app-source/
├── README.md                    # Main documentation
├── CODEBASE_OVERVIEW.md        # Technical details
├── INSTALLATION_GUIDE.md       # This file
├── backend/                    # Flask backend
│   ├── src/
│   │   ├── main.py            # Flask app entry point
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   ├── static/            # Built frontend files
│   │   └── database/          # SQLite database
│   ├── venv/                  # Python virtual environment
│   ├── cocktails_database.json # Cocktail data
│   ├── load_cocktails.py      # Database loader
│   └── requirements.txt       # Python dependencies
└── frontend/                  # React frontend
    ├── src/
    │   ├── App.jsx           # Main React component
    │   ├── App.css           # Styles
    │   └── components/       # React components
    ├── dist/                 # Built files (after build)
    ├── package.json          # Node.js dependencies
    └── vite.config.js        # Build configuration
```

## 🌐 Accessing the Application

- **Development Mode:** http://localhost:5173
- **Production Mode:** http://localhost:5000
- **Live Demo:** https://j6h5i7cglw3d.manus.space

## 🎨 Features to Test

1. **Search Functionality** - Try searching for "martini" or "whiskey"
2. **Category Filtering** - Use the dropdown to filter by cocktail type
3. **Cocktail Details** - Click on any cocktail card to see full recipe
4. **Bar Shelf Management** - Add ingredients to your virtual bar
5. **Shopping List** - Add ingredients you need to buy
6. **Featured Cocktails** - Check out the signature drinks
7. **Responsive Design** - Resize your browser or test on mobile

## 💡 Development Tips

- **Hot Reload:** Frontend changes auto-refresh in development mode
- **API Testing:** Use browser dev tools to inspect API calls
- **Database:** SQLite database file is at `backend/src/database/app.db`
- **Logs:** Check terminal output for any errors or warnings

## 🚀 Next Steps

Once you have the application running:

1. **Explore the codebase** using the CODEBASE_OVERVIEW.md
2. **Customize the design** by modifying the CSS
3. **Add new features** by extending the React components
4. **Deploy to production** using your preferred hosting service

The application is fully functional and ready for use or further development!

