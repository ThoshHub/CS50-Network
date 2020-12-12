
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
    # returns json object of 10 messages, which 10 depend on the number passed in
    # 0 -> 00-09
    # 1 -> 10-19
    # 2 -> 20-29 etc...
    path("messages/<int:message_number>", views.return_messages, name="messages"), 
    # path("messages/<int:email_id>", views.email, name="email"), # need to change the route to "messages/content/<int:email_id> or something"
	path("users/<int:user_id>", views.return_user, name="users")
]
