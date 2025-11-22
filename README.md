# 3D Romantic Photo Gallery

A romantic web application where memories float in a spherical 3D universe that users can explore. Built with Next.js 16, React 19, Three.js, and Django REST Framework.

## ✨ Features

- 🌌 **3D Memory Universe**: Interactive 3D space with floating memory nodes
- 💝 **Hidden Heart Star**: Secret discovery feature with special animations
- 🎵 **Background Music**: Romantic soundtrack with toggle controls
- 📱 **Mobile Responsive**: Automatic 2D gallery fallback for mobile devices
- 🎨 **Beautiful UI**: Romantic theme with glass morphism effects
- ⚡ **Performance Optimized**: LOD system and device detection
- 🛡️ **Admin Dashboard**: Full CRUD operations for memory management
- 🔒 **Authentication**: Secure admin login system
- 📂 **File Upload**: Support for images, videos, and audio files

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Django 5.x** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (SQLite for development)
- **Pillow** - Image processing
- **django-cors-headers** - CORS handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dabsad
```

### 2. Backend Setup
```bash
cd backend
chmod +x setup.sh
./setup.sh

# Manual setup (if script doesn't work):
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd ../
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:3000/admin
- **Django Admin**: http://localhost:8000/admin

## 📁 Project Structure

```
dabsad/
├── backend/                    # Django backend
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   ├── romantic_gallery/      # Django project settings
│   ├── memories/              # Memory management app
│   │   ├── models.py         # Memory and SiteSettings models
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py    # DRF serializers
│   │   └── urls.py           # API routing
│   ├── authentication/        # Admin authentication
│   ├── media/                # Uploaded files
│   └── setup.sh              # Setup script
├── src/                       # Next.js frontend
│   ├── app/                  # App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── universe/        # 3D universe page
│   │   └── admin/           # Admin dashboard
│   ├── components/          # React components
│   │   ├── Navigation.tsx   # Navigation component
│   │   ├── Universe3D.tsx   # Main 3D scene
│   │   ├── MemoryNode.tsx   # 3D memory node
│   │   ├── MemoryModal.tsx  # Memory detail modal
│   │   ├── HeartStar.tsx    # Secret discovery
│   │   ├── MusicToggle.tsx  # Background music
│   │   ├── FallbackGallery.tsx # 2D gallery fallback
│   │   └── Admin/           # Admin components
│   ├── lib/                 # Utilities
│   │   └── api.ts           # API integration
│   ├── types/               # TypeScript types
│   └── globals.css          # Global styles
├── package.json             # Frontend dependencies
├── next.config.ts          # Next.js configuration
└── README.md               # This file
```

## 🎮 Usage

### For Visitors
1. **Landing Page**: View the romantic entrance with typewriter effect
2. **Enter Universe**: Click "Enter Our Universe" to explore
3. **3D Navigation**:
   - Click and drag to rotate the view
   - Scroll to zoom in/out
   - Click memory nodes to view details
   - Discover the hidden Heart Star
4. **Background Music**: Toggle music using the navigation button
5. **Mobile Users**: Automatic 2D gallery fallback

### For Administrators
1. **Access Admin Panel**: Navigate to `/admin`
2. **Login**: Use admin credentials
3. **Manage Memories**:
   - Add new memories with file uploads
   - Edit existing memories
   - Set featured and secret flags
   - Adjust 3D positioning
4. **Configure Settings**:
   - Animation speed and particle count
   - Theme colors
   - Background music
5. **View Analytics**: Track visitor engagement (coming soon)

## 🎨 Customization

### Theme Colors
Edit the CSS variables in `src/app/globals.css`:
```css
:root {
  --bg-primary: #0b1020;
  --bg-secondary: #1a1f3a;
  --accent-primary: #9b6cff;
  --accent-secondary: #ff6b8a;
  --accent-star: #f6f7ff;
}
```

### 3D Settings
Configure through the admin panel or modify the `SiteSettings` model:
- Camera rotation speed
- Particle count
- Auto-rotation toggle
- Theme colors

### Memory Categories
- **PHOTO**: Images and photos
- **VIDEO**: Video files
- **AUDIO**: Audio recordings

## 🔧 Configuration

### Environment Variables
```bash
# Backend
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📱 Mobile Support

The application automatically detects device capabilities:
- **High-end devices**: Full 3D experience
- **Low-end/mobile devices**: 2D gallery fallback
- **Touch gestures**: Swipe navigation
- **Performance optimization**: Reduced particle count and LOD

## 🎯 Performance Features

- **LOD System**: Level of detail based on camera distance
- **Device Detection**: Automatic quality adjustment
- **Lazy Loading**: On-demand memory loading
- **Optimized Assets**: Compressed images and efficient 3D models
- **Memory Management**: Proper cleanup and disposal

## 🔒 Security

- **Admin Authentication**: Session-based admin login
- **File Validation**: Type and size limits for uploads
- **CSRF Protection**: Cross-site request forgery prevention
- **CORS Configuration**: Proper cross-origin settings
- **Input Validation**: Server-side validation for all inputs

## 🐛 Troubleshooting

### Common Issues

**Django Setup Problems**:
```bash
# Make sure Python and pip are installed
python3 --version
pip --version

# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Three.js Issues**:
- Check browser WebGL support
- Update graphics drivers
- Clear browser cache

**File Upload Problems**:
- Check file size limits (10MB max)
- Verify allowed file types
- Ensure media directory permissions

**API Connection Issues**:
- Verify Django server is running on port 8000
- Check CORS settings
- Ensure Next.js rewrites are configured properly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 💝 Acknowledgments

Built with love for creating romantic digital experiences. Special thanks to the open-source community for the amazing tools and libraries that made this project possible.