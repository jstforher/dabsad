#!/bin/bash

# Django Backend Setup Script

echo "🚀 Setting up Django backend for 3D Romantic Photo Gallery..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p media/memories
mkdir -p staticfiles

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo ""
echo "👤 Would you like to create an admin user? (y/n)"
read -r create_user
if [[ $create_user =~ ^[Yy]$ ]]; then
    echo "Creating admin user..."
    python manage.py createsuperuser
fi

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo ""
echo "✅ Django backend setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start development server: python manage.py runserver"
echo "3. Visit admin panel: http://localhost:8000/admin/"
echo ""
echo "📝 Configuration:"
echo "- Media files: backend/media/"
echo "- Static files: backend/staticfiles/"
echo "- Database: backend/db.sqlite3 (SQLite)"