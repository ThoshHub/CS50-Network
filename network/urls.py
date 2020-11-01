
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
	# API Routes
    path("messages", views.return_message, name="message") # returns json object of 10 messages
    # path("messages/<int:email_id>", views.email, name="email"),
]
