from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSet
router = DefaultRouter()
router.register(r'memories', views.MemoryViewSet)

app_name = 'memories'

urlpatterns = [
    # Include ViewSet URLs
    path('', include(router.urls)),

    # Custom API endpoints
    path('settings/', views.site_settings, name='site-settings'),
    path('memories/upload/', views.upload_file, name='file-upload'),
    path('auth/secret-reveal/', views.reveal_secret, name='reveal-secret'),
]