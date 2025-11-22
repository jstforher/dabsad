from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    path('auth/login/', views.admin_login, name='admin-login'),
    path('auth/logout/', views.admin_logout, name='admin-logout'),
    path('auth/status/', views.admin_status, name='admin-status'),
    path('auth/create-admin/', views.create_admin_user, name='create-admin'),
]