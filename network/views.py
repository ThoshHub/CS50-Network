from collections import UserDict
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models import Value, IntegerField
from django.http import HttpResponse, HttpResponseRedirect
from django.http import request
from django.shortcuts import render
from django.urls import reverse
from .forms import messageForm
from .models import User, message
from django.http import JsonResponse
from django.core import serializers
import json
from datetime import date, datetime
from django.utils import timezone

def index(request):
	# TODO need to show the user some sort of blank page if the user 
	if request.method == "POST":
		form = messageForm(request.POST)
		if form.is_valid():
			return_message = form.cleaned_data["message"] # get the message that the user submitted
			# print("DEBUG STATEMENT: The Mesage Returned was: \n\"" + return_message + "\"")
			current_user = request.user
			current_user_name = return_user_name(current_user.id)
			posted_message = message(content=str(return_message), writer=current_user, writername=current_user_name)
			posted_message.save()
	return render(request, "network/index.html", {"form": messageForm()})

def login_view(request):
	if request.method == "POST":

		# Attempt to sign user in
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)

		# Check if authentication successful
		if user is not None:
			login(request, user)
			return HttpResponseRedirect(reverse("index"))
		else:
			return render(request, "network/login.html", {
				"message": "Invalid username and/or password."
			})
	else:
		return render(request, "network/login.html")


def logout_view(request):
	logout(request)
	return HttpResponseRedirect(reverse("index"))


def register(request):
	if request.method == "POST":
		username = request.POST["username"]
		email = request.POST["email"]

		# Ensure password matches confirmation
		password = request.POST["password"]
		confirmation = request.POST["confirmation"]
		if password != confirmation:
			return render(request, "network/register.html", {
				"message": "Passwords must match."
			})

		# Attempt to create new user
		try:
			user = User.objects.create_user(username, email, password)
			user.save()
		except IntegrityError:
			return render(request, "network/register.html", {
				"message": "Username already taken."
			})
		login(request, user)
		return HttpResponseRedirect(reverse("index"))
	else:
		return render(request, "network/register.html")

def return_messages(request, message_number):
	number_of_messages = message.objects.all().count() # Total number of messages in the database
	begin = message_number * 10 # first index of message
	end = begin + 10  # last index of message
	
	# if the last index is greater than the total number of messages, 
	# then set it to the max number of messages
	# for example if 75 messages exist, and 70-79 is requested, 70-75 will be requested instead
	if end > number_of_messages:
		end = number_of_messages 
	# print("MAX: " + str(number_of_messages) + ", START: " + str(begin) + ", END: " + str(end)) # debug

	messages = message.objects.order_by("-date")[begin:end] # The messages object is requested from the database
	messages_json = serializers.serialize("json", messages) # serialize them into a json string
	messages_list = json.loads(messages_json) # convert json string into a list
	return JsonResponse(messages_list, safe=False) # return the list

def return_user_messages(request, user_id, message_number): # you can think of "message_number"  as 'Page Number'
	# print("User ID: " + str(user_id) + ", Message Number: " + str(message_number))
	
	# calculate pages
	number_of_messages = message.objects.filter(writer = user_id).count()
	begin = message_number * 10 # first index of message
	end = begin + 10  # last index of message

	# if the last index is greater than the total number of messages, 
	# then set it to the max number of messages
	# for example if 75 messages exist, and 70-79 is requested, 70-75 will be requested instead
	if end > number_of_messages:
		end = number_of_messages 
	# print("MAX: " + str(number_of_messages) + ", START: " + str(begin) + ", END: " + str(end)) # debug

	# get messages for a specific user
	messages = message.objects.filter(writer = user_id).order_by("-date")[begin:end] # The messages object is requested from the database
	messages_json = serializers.serialize("json", messages) # serialize them into a json string
	messages_list = json.loads(messages_json) # convert json string into a list
	return JsonResponse(messages_list, safe=False) # return the list

# returns user name from user id,
# differs from return_user method because
# this one doesn't take a request, just the user id to be 
# used locally by the server
def return_user_name(user_id):
	writer = User.objects.filter(id = user_id).first()
	if writer is None:
		return "user_undefined"
	else:
		return writer

# This model 
def return_user(request, user_id):
	writer = User.objects.filter(id = user_id).first()
	numOfFollowing = len(User.objects.filter(id = user_id).values('following')) # returns ids of following
	numOfFollowers = len(User.objects.filter(id = user_id).values('followers')) # returns ids of followers
	# print(str(writer) + ", " + str(numOfFollowing) + ", " + str(numOfFollowers))
	
	# data = [{'name': 'Peter', 'email': 'peter@example.org'}] # Format Data Like This
	data = [{'name': str(writer), 'numFollowing': str(numOfFollowing), 'numFollowers': str(numOfFollowers)}] # str(writer) is the username of the id of the user that was passed in
	return JsonResponse(data, safe=False)	

def userpage(request, user_id):
	return render(request, "network/userpage.html", {
		"user_id": user_id
	})

def followpage(request):
	return render(request, "network/followpage.html")

def return_current_user(request): # Serves the id of the current user
	current_user = request.user
	data = {'loggedin': current_user.id}
	print(data)
	return JsonResponse(data, safe=False)

def return_follows_status(request, user_id_1, user_id_2): # Check whether user_id_1 is FOLLOWING user_id_2
	# Get List of People that "user_id_1" follows in a list
	visitor = User.objects.filter(id = user_id_1).values_list("following", flat=True)
	# print(visitor)

	returnvar = ""
	# DEBUG: Print Out Results
	if user_id_1 == user_id_2:
		returnvar = "same"
	elif user_id_2 in visitor:
		returnvar = "yes"
	else: 
		returnvar = "no"
	# print("User 1 Follows User 2: " + returnvar)
	
	# data = "{\"name\":\"John\", \"age\":31, \"city\":\"New Yorkk\"}" # Dummy Data for Debugging
	# data = [{'follows': str(returnvar)}] # Alternative option
	data = {'follows': str(returnvar)}
	return JsonResponse(data, safe=False)

def follow(request, user_id_1, user_id_2):
	# print(str(user_id_1) + " Will Now Follow " + str(user_id_2))
	
	# https://docs.djangoproject.com/en/dev/ref/models/relations/#django.db.models.fields.related.RelatedManager.add
	# Edit the following list of "user_id_1" to add "user_id_2"
	user_1 = User.objects.get(id = user_id_1)
	user_2 = User.objects.get(id = user_id_2)
	user_1.following.add(user_2)

	data = {'follows_success': "true"}
	return JsonResponse(data, safe=False)

def unfollow(request, user_id_1, user_id_2):
	print(str(user_id_1) + " Will Now Unfollow " + str(user_id_2))

	# https://docs.djangoproject.com/en/dev/ref/models/relations/#django.db.models.fields.related.RelatedManager.add
	# Edit the following list of "user_id_1" to remove "user_id_2"
	user_1 = User.objects.get(id = user_id_1)
	user_2 = User.objects.get(id = user_id_2)
	user_1.following.remove(user_2)

	data = {'unfollows_success': "true"}
	return JsonResponse(data, safe=False)

def edit_message(request, message_id):
	# print("edit_message() function has been called, message_id: " + str(message_id))
	# if request.method == "POST":
	# 	print("Method is POST")
	# else:
	# 	print("Method is NOT POST")

	received_json_data = json.loads(request.body.decode("utf-8"))
	new_message = received_json_data["new_message"] # This is the message recieved
	# print("RECIEVED MESSAGE: " + str(new_message) + ", MESSAGE ID: " + str(message_id))

	cur_message = message.objects.get(id = message_id) # grab the message equal to the id passed in
	# print(cur_message.content) # print the message (debug)
	cur_message.content = new_message # set the message content equal to the new message
	cur_message.save() # save the new message

	# data = {'Message Completed': "True"}
	# return JsonResponse(data, safe=False)
	# return HttpResponse("OK")
	return HttpResponse("Message Recieved")

def message_content(request, message_id, user_id):
	cur_message = message.objects.get(id = message_id) # grab the message equal to the id passed in
	cur_user = User.objects.get(id = user_id)
	
	user_likes_message = False # Assume user does not like message
	if cur_message.liked_by.filter(id = user_id): # If user does like message
		user_likes_message = True # Set equal to true
	print("User Likes Message: " + str(user_likes_message)) # debug

	# organize data into key-value pairs
	data = {'content': str(cur_message.content), 'writer_id': str(cur_message.writer.id), 'writername': str(cur_message.writername), 'date': str(cur_message.date), 'numoflikes': str(cur_message.numoflikes), 'liked_by':str(user_likes_message)}
	
	# print(data) # For Debugging
	# return HttpResponse("Dummy Value") # For Debugging
	
	# send data in JSON format
	return JsonResponse(data, safe=False)

def like_message(request, message_id, user_id):
	print("User ID: " + str(user_id) + " Likes Message ID: " + str(message_id))
	cur_user = User.objects.get(id = user_id)
	cur_message = message.objects.get(id = message_id) # grab the message equal to the id passed in
	# print(str(cur_message.numoflikes) + ", " + str(cur_user))
	cur_message.numoflikes = cur_message.numoflikes + 1
	cur_message.liked_by.add(cur_user)
	cur_message.save()

	data = {"Message_Liked":str(message_id), "User_Liked":str(user_id)}
	return JsonResponse(data, safe=False)

def unlike_message(request, message_id, user_id):
	print("User ID: " + str(user_id) + " Unlikes Message ID: " + str(message_id))
	cur_user = User.objects.get(id = user_id)
	cur_message = message.objects.get(id = message_id) # grab the message equal to the id passed in
	# print(str(cur_message.numoflikes) + ", " + str(cur_user))
	cur_message.numoflikes = cur_message.numoflikes - 1
	cur_message.liked_by.remove(cur_user)
	cur_message.save()

	data = {"Message_Unliked":str(message_id), "User_Unliked":str(user_id)}
	return JsonResponse(data, safe=False)
