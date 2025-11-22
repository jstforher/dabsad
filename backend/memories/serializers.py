from rest_framework import serializers
from .models import Memory, SiteSettings
import uuid


class PositionSerializer(serializers.Serializer):
    """Serializer for 3D position data."""
    x = serializers.FloatField()
    y = serializers.FloatField()
    z = serializers.FloatField()


class MemorySerializer(serializers.ModelSerializer):
    """Serializer for Memory model."""
    position = PositionSerializer(source='*', read_only=True)

    class Meta:
        model = Memory
        fields = [
            'id', 'title', 'caption', 'media_url', 'position', 'orbit_radius',
            'is_featured', 'category', 'date', 'order'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """Convert position fields to nested position object."""
        data = super().to_representation(instance)
        if 'position_x' in data:
            # Remove individual position fields since we use nested position
            data.pop('position_x', None)
            data.pop('position_y', None)
            data.pop('position_z', None)
        return data


class MemoryCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating memories (admin only)."""
    position = PositionSerializer(required=False, help_text="3D position on unit sphere")

    class Meta:
        model = Memory
        fields = [
            'title', 'caption', 'media_url', 'position', 'orbit_radius',
            'is_secret', 'is_featured', 'category', 'date', 'order'
        ]

    def create(self, validated_data):
        """Handle nested position data."""
        position_data = validated_data.pop('position', None)

        # Generate random position on sphere if not provided
        if position_data:
            validated_data['position_x'] = position_data['x']
            validated_data['position_y'] = position_data['y']
            validated_data['position_z'] = position_data['z']
        else:
            # Generate random position on unit sphere
            import random
            import math

            theta = random.uniform(0, 2 * math.pi)  # azimuthal angle
            phi = random.uniform(0, math.pi)       # polar angle

            validated_data['position_x'] = math.sin(phi) * math.cos(theta)
            validated_data['position_y'] = math.sin(phi) * math.sin(theta)
            validated_data['position_z'] = math.cos(phi)

        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Handle nested position data on update."""
        position_data = validated_data.pop('position', None)

        if position_data:
            instance.position_x = position_data['x']
            instance.position_y = position_data['y']
            instance.position_z = position_data['z']

        return super().update(instance, validated_data)


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for SiteSettings model."""
    theme_colors = serializers.DictField(read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            'rotation_speed', 'particle_count', 'music_enabled', 'auto_rotate',
            'theme_colors', 'theme_color_primary', 'theme_color_secondary',
            'theme_color_star'
        ]


class FileUploadSerializer(serializers.Serializer):
    """Serializer for file uploads."""
    file = serializers.FileField(
        max_length=100,
        allow_empty_file=False,
        help_text="File to upload (max 10MB)"
    )

    def validate_file(self, value):
        """Validate file type and size."""
        # Check file size (10MB limit)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")

        # Check file extension
        allowed_extensions = {
            'image': ['jpg', 'jpeg', 'png'],
            'video': ['mp4', 'webm'],
            'audio': ['mp3', 'wav']
        }

        file_extension = value.name.split('.')[-1].lower()

        # Find category based on extension
        category = None
        for cat, extensions in allowed_extensions.items():
            if file_extension in extensions:
                category = cat
                break

        if not category:
            raise serializers.ValidationError(
                f"File type .{file_extension} not allowed. "
                f"Allowed types: {', '.join(sum(allowed_extensions.values(), []))}"
            )

        return value