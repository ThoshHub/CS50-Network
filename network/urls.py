
from network.models import User
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("userpage/<int:user_id>", views.userpage, name="userpage"),
    path("followpage", views.followpage, name="followpage"),

	# API Routes
    path("messages/<int:message_number>", views.return_messages, name="messages"), # return 10 messaes at a time, return_messages being the page of messages to return
	path("messages/user/<int:user_id>/<int:message_number>", views.return_user_messages, name="user_messages"), # same as above but for specific user id
	path("users/pageinfo/<int:user_id>", views.return_user, name="users"), # return user content when id passed in
    # This returns the messages for a user's feed
    # The first number is the user id (which determines who he/she is following)
    # The second number corresponds to the page number that the user is on
    path("messages/followpage/<int:user_id>/<int:message_number>", views.return_followpage, name="messages_followpage"),

    # pass in the two integers, the first will be the id of the user making the request
    # the second will be the id of the user of the page that this api was requested on
    # it will return, "yes", "no", or "same" in a json string 
    # for example, user 1 is on user page 2, the request would be "following/users/1/2"
    # and it would return "yes" if user 1 follows user 2
    # if both users are the same aka "following/users/1/1", then the result will always be "same"
    # to indicate that it is the same user
    path("following/user/<int:user_id_1>/<int:user_id_2>", views.return_follows_status, name="follows"),
    path("user/current", views.return_current_user, name="current_user"), # returns id of current user (I think, check this pls I wrote this comment weeks after writing the function)

    # This makes user_id_1 follow user_id_2 
    path("follow/<int:user_id_1>/<int:user_id_2>", views.follow, name="followuser"),
     # This makes user_id_1 unfollow user_id_2
    path("unfollow/<int:user_id_1>/<int:user_id_2>", views.unfollow, name="unfollowuser"),
    # sends the id to edit a message (this needs to be done through a post request)
    path("message/edit/<int:message_id>", views.edit_message, name="edit_message"),
	# simliar to 'return_messages' but only returns content of ONE message
	# a user id is passed in and a field is returned in the json "likes" that says whether the user of that ID
	# likes the message
    path("message/content/<int:message_id>/<int:user_id>", views.message_content, name="message_content"), 

    path("message/like/<int:message_id>/<int:user_id>", views.like_message, name="like_message"), # user_id likes message_id
    path("message/unlike/<int:message_id>/<int:user_id>", views.unlike_message, name="unlike_message") # user_id unlikes message_id
]
