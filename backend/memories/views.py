import os
import uuid
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Memory, SiteSettings
from .serializers import (
    MemorySerializer, MemoryCreateUpdateSerializer,
    SiteSettingsSerializer, FileUploadSerializer
)


class MemoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Memory model with public read access and admin write access."""

    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return MemoryCreateUpdateSerializer
        return MemorySerializer

    def get_queryset(self):
        """Filter out secret memories for public access."""
        if self.request.user.is_authenticated:
            return Memory.objects.all()
        return Memory.objects.filter(is_secret=False)

    def perform_create(self, serializer):
        """Set created_by when creating memories."""
        serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Get featured memories only."""
        featured_memories = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_memories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def category(self, request):
        """Filter memories by category."""
        category = request.query_params.get('type', 'PHOTO')
        memories = self.get_queryset().filter(category=category.upper())
        serializer = self.get_serializer(memories, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def site_settings(request):
    """Get site configuration settings."""
    settings_obj = SiteSettings.objects.first()
    if not settings_obj:
        # Create default settings if none exist
        settings_obj = SiteSettings.objects.create()

    serializer = SiteSettingsSerializer(settings_obj)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """Handle file uploads for memory media."""
    serializer = FileUploadSerializer(data=request.FILES)

    if serializer.is_valid():
        file = serializer.validated_data['file']

        # Generate unique filename
        file_extension = file.name.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Save file to media directory
        file_path = default_storage.save(f'memories/{unique_filename}', file)

        # Return the URL
        file_url = request.build_absolute_uri(f'/media/{file_path}')

        return Response({
            'filename': unique_filename,
            'file_url': file_url,
            'size': file.size,
            'content_type': file.content_type
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reveal_secret(request):
    """Access secret memory with optional authentication key."""
    # Simple implementation - could add password/key requirement
    secret_key = request.data.get('key', '')

    # For now, allow access to all secrets (can be made more secure)
    if True:  # Replace with actual key validation if needed
        secret_memories = Memory.objects.filter(is_secret=True)
        serializer = MemorySerializer(secret_memories, many=True)
        return Response({
            'success': True,
            'memories': serializer.data
        })

    return Response({
        'success': False,
        'error': 'Invalid secret key'
    }, status=status.HTTP_401_UNAUTHORIZED)


# Error handling views
@api_view(['GET'])
@permission_classes([AllowAny])
def api_404(request):
    """Custom 404 handler for API endpoints."""
    return Response({
        'error': 'API endpoint not found',
        'message': 'The requested API endpoint does not exist.'
    }, status=status.HTTP_404_NOT_FOUND)


def api_500(request):
    """Custom 500 handler for API endpoints."""
    return Response({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred while processing your request.'
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)