import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings


class Memory(models.Model):
    """Memory model for storing romantic memories in 3D space."""

    CATEGORY_CHOICES = [
        ('PHOTO', 'Photo'),
        ('VIDEO', 'Video'),
        ('AUDIO', 'Audio'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    caption = models.TextField(blank=True, null=True)
    media_url = models.URLField(max_length=500)

    # 3D positioning
    position_x = models.FloatField(default=0.0, help_text="X position on sphere")
    position_y = models.FloatField(default=0.0, help_text="Y position on sphere")
    position_z = models.FloatField(default=0.0, help_text="Z position on sphere")
    orbit_radius = models.FloatField(default=5.0, help_text="Distance from center")

    # Memory properties
    is_secret = models.BooleanField(default=False, help_text="Hidden memory requiring discovery")
    is_featured = models.BooleanField(default=False, help_text="Featured memory")
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='PHOTO')
    date = models.DateTimeField()
    order = models.PositiveIntegerField(default=0, help_text="Display order")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'date']
        indexes = [
            models.Index(fields=['is_secret', 'is_featured']),
            models.Index(fields=['category']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.title} ({self.category})"

    def clean(self):
        """Validate 3D position data."""
        # Normalize position to unit sphere surface
        magnitude = (self.position_x**2 + self.position_y**2 + self.position_z**2)**0.5
        if magnitude > 0:
            self.position_x /= magnitude
            self.position_y /= magnitude
            self.position_z /= magnitude


class SiteSettings(models.Model):
    """Global site configuration settings."""

    id = models.AutoField(primary_key=True)
    rotation_speed = models.FloatField(
        default=0.001,
        help_text="Camera auto-rotation speed (radians per frame)"
    )
    particle_count = models.PositiveIntegerField(
        default=1000,
        help_text="Number of background particles"
    )
    music_enabled = models.BooleanField(default=True)
    auto_rotate = models.BooleanField(default=True)

    # Theme colors
    theme_color_primary = models.CharField(
        max_length=7,
        default='#9b6cff',
        help_text="Primary theme color (hex)"
    )
    theme_color_secondary = models.CharField(
        max_length=7,
        default='#ff6b8a',
        help_text="Secondary theme color (hex)"
    )
    theme_color_star = models.CharField(
        max_length=7,
        default='#f6f7ff',
        help_text="Star/accent color (hex)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return f"Site Settings (updated {self.updated_at.strftime('%Y-%m-%d')})"

    def save(self, *args, **kwargs):
        # Ensure only one SiteSettings instance exists
        if not self.pk and SiteSettings.objects.exists():
            raise ValidationError("Only one SiteSettings instance is allowed")
        super().save(*args, **kwargs)

    @property
    def theme_colors(self):
        """Return theme colors as dictionary."""
        return {
            "primary": self.theme_color_primary,
            "secondary": self.theme_color_secondary,
            "star": self.theme_color_star,
        }