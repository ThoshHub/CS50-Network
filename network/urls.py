
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
	# API Routes
    path("messages", views.return_messages, name="messages") # returns json object of 10 messages
    # path("messages/<int:email_id>", views.email, name="email"),
]
