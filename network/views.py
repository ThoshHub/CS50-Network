from collections import UserDict
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
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
			posted_message = message(content=str(return_message), writer=current_user)
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

def return_messages(request):
	# messages = message.objects.all() # grab all messages, returns 1-12
	messages = message.objects.order_by("-date") # compare this to above returns 12-1 
	data_2 = serializers.serialize("json", messages) # serialize them into a json string
	data_3 = json.loads(data_2) # convert json string into a list

	# todo only grab 10
	# todo print out all messages in messages
	for m in messages:
		print(m)

	return JsonResponse(data_3, safe=False) # return the list

# This model 
def return_user(request, user_id):
	writer = User.objects.filter(id = user_id).first()
	# print(writer)
	print("Got to Line 77: "+ str(writer))
	# need to format the data like this
	# data = [{'name': 'Peter', 'email': 'peter@example.org'}] # this also works
	data = [{'name': str(writer)}] # str(writer) is the username of the id of the user that was passed in
	return JsonResponse(data, safe=False)	

def userpage(request, user_id):
	return render(request, "network/userpage.html", {
		"user_id": user_id
	})