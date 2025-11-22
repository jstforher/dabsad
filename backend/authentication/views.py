from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    """Serializer for login credentials."""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information."""
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_admin']
        read_only_fields = ['id', 'is_staff']

    def get_is_admin(self, obj):
        """Check if user is admin (staff or superuser)."""
        return obj.is_staff or obj.is_superuser


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Handle admin login."""
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Check if user has admin privileges
            if user.is_staff or user.is_superuser:
                login(request, user)
                user_serializer = UserSerializer(user)

                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': user_serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Admin privileges required'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'success': False,
        'error': 'Invalid input data',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """Handle admin logout."""
    logout(request)
    return Response({
        'success': True,
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_status(request):
    """Check if user is logged in and has admin privileges."""
    if request.user.is_staff or request.user.is_superuser:
        user_serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'authenticated': True,
            'admin': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'authenticated': True,
            'admin': False,
            'error': 'Admin privileges required'
        }, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_user(request):
    """Create initial admin user (for development setup)."""
    # This should be protected in production
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'error': 'User already exists'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Create admin user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.is_staff = True
    user.is_superuser = True
    user.save()

    return Response({
        'success': True,
        'message': 'Admin user created successfully',
        'user_id': user.id
    }, status=status.HTTP_201_CREATED)