from django.contrib.auth.models import AbstractUser
from django.contrib import admin
from django.db import models
from datetime import date, datetime
from django.utils import timezone

class User(AbstractUser):
	followers = models.ManyToManyField("User", related_name="followedby")
	following = models.ManyToManyField("User", related_name="follows")
	# temp = models.CharField(max_length=64)

class message(models.Model):
	content = models.CharField( max_length=2000 ) # set the limit to 2000 chars
	date = models.DateTimeField(default=timezone.now) # default time will be the time at creation
	writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_messages")
	liked_by = models.ManyToManyField("User", related_name="likes")