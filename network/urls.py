
from network.models import User
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("userpage/<int:user_id>", views.userpage, name="userpage"),
    
	# API Routes
    path("messages/<int:message_number>", views.return_messages, name="messages"), # return message content when id passed in
	path("users/<int:user_id>", views.return_user, name="users") # return user content when id passed in
]
