from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
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
	messages = message.objects.all()
	
	# data_1 = [{'name': 'Peter', 'email': 'peter@example.org'}, {'name': 'Julia', 'email': 'julia@example.org'}]
	
	data_2 = serializers.serialize("json", messages )
	# data_2 = [{"model": "network.message", "pk": 1, "fields": {"content": "Test Message 20.10.30 01", "date": "2020-10-25T22:06:17Z", "writer": 1, "liked_by": [3, 4, 6]}}, {"model": "network.message", "pk": 2, "fields": {"content": "Test Message 20.10.30 02", "date": "2020-10-31T00:37:42.188Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 3, "fields": {"content": "test", "date": "2020-10-31T00:44:15.819Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 8, "fields": {"content": "test", "date": "2020-10-31T02:33:13.590Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 9, "fields": {"content": "test", "date": "2020-10-31T02:33:58.138Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 10, "fields": {"content": "test", "date": "2020-10-31T02:34:30.796Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 11, "fields": {"content": "test", "date": "2020-10-31T02:34:42.699Z", "writer": 1, "liked_by": []}}, {"model": "network.message", "pk": 12, "fields": {"content": "test", "date": "2020-11-01T08:53:05.937Z", "writer": 1, "liked_by": []}}]
	# data_2 = "[{\"model\": \"network.message\", \"pk\": 1, \"fields\": {\"content\": \"Test Message 20.10.30 01\", \"date\": \"2020-10-25T22:06:17Z\", \"writer\": 1, \"liked_by\": [3, 4, 6]}}, {\"model\": \"network.message\", \"pk\": 2, \"fields\": {\"content\": \"Test Message 20.10.30 02\", \"date\": \"2020-10-31T00:37:42.188Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 3, \"fields\": {\"content\": \"test\", \"date\": \"2020-10-31T00:44:15.819Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 8, \"fields\": {\"content\": \"test\", \"date\": \"2020-10-31T02:33:13.590Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 9, \"fields\": {\"content\": \"test\", \"date\": \"2020-10-31T02:33:58.138Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 10, \"fields\": {\"content\": \"test\", \"date\": \"2020-10-31T02:34:30.796Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 11, \"fields\": {\"content\": \"test\", \"date\": \"2020-10-31T02:34:42.699Z\", \"writer\": 1, \"liked_by\": []}}, {\"model\": \"network.message\", \"pk\": 12, \"fields\": {\"content\": \"test\", \"date\": \"2020-11-01T08:53:05.937Z\", \"writer\": 1, \"liked_by\": []}}]"
	# data_2 = [{'model': 'network.message', 'pk': 1, 'fields': {'content': 'Test Message 20.10.30 01', 'date': '2020-10-25T22:06:17Z', 'writer': 1, 'liked_by': [3, 4, 6]}}, {'model': 'network.message', 'pk': 2, 'fields': {'content': 'Test Message 20.10.30 02', 'date': '2020-10-31T00:37:42.188Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 3, 'fields': {'content': 'test', 'date': '2020-10-31T00:44:15.819Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 8, 'fields': {'content': 'test', 'date': '2020-10-31T02:33:13.590Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 9, 'fields': {'content': 'test', 'date': '2020-10-31T02:33:58.138Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 10, 'fields': {'content': 'test', 'date': '2020-10-31T02:34:30.796Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 11, 'fields': {'content': 'test', 'date': '2020-10-31T02:34:42.699Z', 'writer': 1, 'liked_by': []}}, {'model': 'network.message', 'pk': 12, 'fields': {'content': 'test', 'date': '2020-11-01T08:53:05.937Z', 'writer': 1, 'liked_by': []}}]
	# data_2 = [{'content': 'Test Message 20.10.30 01', 'date': '2020-10-25T22:06:17Z', 'writer': 1, 'liked_by': [3, 4, 6]}]
	# data_3 = json.loads(data_2)

	# data_4 = messages.toJSON()

	print(data_3)
	return JsonResponse(data_3, safe=False)