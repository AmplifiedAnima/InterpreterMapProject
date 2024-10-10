from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("user-profile/", views.UserProfile, name="user-profile"),
    path("register/", views.create_user_profile, name="register"),
    path("login/", views.login_user, name="login"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', views.default_view,name='default_view')
]