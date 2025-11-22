from django.contrib import admin
from .models import Memory, SiteSettings


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    """Admin interface for Memory model."""

    list_display = [
        'title', 'category', 'is_secret', 'is_featured',
        'date', 'order', 'created_at'
    ]
    list_filter = ['category', 'is_secret', 'is_featured', 'date', 'created_at']
    search_fields = ['title', 'caption']
    ordering = ['order', 'date', 'created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'caption', 'media_url', 'category')
        }),
        ('3D Positioning', {
            'fields': ('position_x', 'position_y', 'position_z', 'orbit_radius'),
            'description': 'Position values should be on unit sphere (-1 to 1)'
        }),
        ('Memory Properties', {
            'fields': ('is_secret', 'is_featured', 'date', 'order')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """Show all memories to superusers, only non-secret to others."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(is_secret=False)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Admin interface for SiteSettings model."""

    list_display = ['id', 'rotation_speed', 'particle_count', 'music_enabled', 'updated_at']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Animation Settings', {
            'fields': ('rotation_speed', 'particle_count', 'auto_rotate')
        }),
        ('Audio Settings', {
            'fields': ('music_enabled',)
        }),
        ('Theme Colors', {
            'fields': ('theme_color_primary', 'theme_color_secondary', 'theme_color_star'),
            'description': 'Colors in hex format (e.g., #9b6cff)'
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        """Only allow one instance of SiteSettings."""
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)