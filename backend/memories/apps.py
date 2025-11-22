from django.apps import AppConfig


class MemoriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'memories'
    verbose_name = 'Memories'

    def ready(self):
        """Import signal handlers when app is ready."""
        try:
            import memories.signals
        except ImportError:
            pass